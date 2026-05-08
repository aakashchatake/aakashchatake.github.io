const API = window.GFIS_API_BASE || "https://y3kgjnwetp.us-east-1.awsapprunner.com";
const docsLink = document.getElementById("apiDocsLink");
if (docsLink) docsLink.href = `${API}/docs`;
let apiOnline = false;

const specs = [
  ["temperature", "Temperature", 25, 45, 37, "C"],
  ["pH", "pH", 6, 8.5, 7.1, ""],
  ["OLR", "OLR", 1, 6.5, 3.2, "kg VS/m3d"],
  ["HRT", "HRT", 10, 45, 25, "days"],
  ["TS", "TS", 4, 16, 9, "%"],
  ["VS", "VS", 2.5, 13, 6.8, "%"],
  ["C_N_ratio", "C/N", 12, 38, 25, ""],
  ["ambient_temperature", "Ambient", 15, 40, 28, "C"],
  ["moisture", "Moisture", 65, 95, 82, "%"]
];

const controls = document.getElementById("controls");
const state = {};

function initControls() {
  specs.forEach(([key, label, min, max, value, unit]) => {
    state[key] = value;
    const wrapper = document.createElement("div");
    wrapper.className = "control";
    wrapper.innerHTML = `
      <label><span>${label}</span><strong id="${key}Value">${value} ${unit}</strong></label>
      <input id="${key}" type="range" min="${min}" max="${max}" value="${value}" step="0.1" />
    `;
    controls.appendChild(wrapper);
    wrapper.querySelector("input").addEventListener("input", (event) => {
      state[key] = Number(event.target.value);
      document.getElementById(`${key}Value`).textContent = `${state[key]} ${unit}`;
      predict();
    });
  });
}

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!response.ok) throw new Error(`${path} failed`);
  return response.json();
}

function fallbackPredict(input) {
  const tempEffect = 1 - Math.min(Math.abs(input.temperature - 37) / 16, 0.55);
  const phEffect = 1 - Math.min(Math.abs(input.pH - 7.1) / 1.7, 0.65);
  const loadingEffect = Math.max(0.45, 1 - Math.max(0, input.OLR - 3.6) * 0.1);
  const retentionEffect = Math.min(1.12, Math.max(0.72, input.HRT / 25));
  const substrate = Math.max(0.1, input.VS / 8);
  const methane = Math.max(0.08, 0.42 * tempEffect * phEffect * loadingEffect * retentionEffect * substrate);
  const vfa = Math.max(0.12, 0.18 + Math.max(0, input.OLR - 3) * 0.09 + Math.max(0, 6.9 - input.pH) * 0.22);
  const bound = Math.max(methane + 0.04, input.VS * 0.075);
  return {
    methane_yield: methane,
    physics_upper_bound: bound,
    vfa_alk_ratio: vfa,
    physics_violation: methane > bound,
    stability_label: vfa > 0.8 ? "Critical" : vfa > 0.4 ? "Warning" : "Stable"
  };
}

function fallbackSimulate(scenarios) {
  return scenarios.map((scenario) => {
    const row = { ...state, ...scenario };
    return { OLR: scenario.OLR, ...fallbackPredict(row) };
  });
}

function fallbackPlantTrace(hours = 48) {
  return Array.from({ length: hours + 1 }, (_, hour) => {
    const stress = hour > 28 ? (hour - 28) / 20 : 0;
    const row = {
      ...state,
      OLR: state.OLR + stress * 1.2,
      pH: state.pH - stress * 0.35,
      temperature: state.temperature + Math.sin(hour / 4) * 1.4
    };
    return { hour, ...fallbackPredict(row) };
  });
}

function setButtonBusy(button, busyText) {
  if (!button) return () => {};
  const previous = button.textContent;
  button.disabled = true;
  button.classList.add("is-busy");
  button.textContent = busyText;
  return () => {
    button.disabled = false;
    button.classList.remove("is-busy");
    button.textContent = previous;
  };
}

async function checkApi() {
  const pill = document.getElementById("apiStatus");
  try {
    await api("/health");
    apiOnline = true;
    pill.textContent = "API Online";
    pill.className = "status-pill ok";
  } catch {
    apiOnline = false;
    pill.textContent = "Demo Mode";
    pill.className = "status-pill fail";
  }
}

function setStability(label) {
  const badge = document.getElementById("stabilityBadge");
  badge.textContent = label;
  badge.style.color = label === "Stable" ? "var(--green)" : label === "Warning" ? "var(--amber)" : "var(--red)";
}

async function predict() {
  try {
    const result = await api("/predict", { method: "POST", body: JSON.stringify(state) });
    document.getElementById("methaneMetric").textContent = result.methane_yield.toFixed(2);
    document.getElementById("boundMetric").textContent = result.physics_upper_bound.toFixed(2);
    document.getElementById("vfaMetric").textContent = result.vfa_alk_ratio.toFixed(3);
    document.getElementById("violationMetric").textContent = result.physics_violation ? "Yes" : "No";
    setStability(result.stability_label);
  } catch (error) {
    const result = fallbackPredict(state);
    document.getElementById("methaneMetric").textContent = result.methane_yield.toFixed(2);
    document.getElementById("boundMetric").textContent = result.physics_upper_bound.toFixed(2);
    document.getElementById("vfaMetric").textContent = result.vfa_alk_ratio.toFixed(3);
    document.getElementById("violationMetric").textContent = result.physics_violation ? "Yes" : "No";
    setStability(result.stability_label);
  }
}

async function simulate() {
  const release = setButtonBusy(document.getElementById("runSimulation"), "Running...");
  const scenarios = [2.0, 2.6, 3.2, 3.8, 4.4, 5.0].map((OLR) => ({ OLR }));
  try {
    const outputs = await api("/simulate", {
      method: "POST",
      body: JSON.stringify({ base: state, scenarios })
    });
    drawChart(outputs);
  } catch {
    drawChart(fallbackSimulate(scenarios));
  } finally {
    release();
  }
}

async function plantTrace() {
  const release = setButtonBusy(document.getElementById("runPlantTrace"), "Tracing...");
  try {
    const outputs = await api("/plant-run?hours=48", {
      method: "POST",
      body: JSON.stringify(state)
    });
    drawChart(outputs.filter((_, index) => index % 6 === 0).map((item) => ({
      OLR: `${item.hour}h`,
      methane_yield: item.methane_yield
    })));
  } catch {
    drawChart(fallbackPlantTrace().filter((_, index) => index % 6 === 0).map((item) => ({
      OLR: `${item.hour}h`,
      methane_yield: item.methane_yield
    })));
  } finally {
    release();
  }
}

function drawChart(outputs) {
  const chart = document.getElementById("chart");
  chart.innerHTML = "";
  const max = Math.max(...outputs.map((item) => item.methane_yield), 1);
  outputs.forEach((item) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${Math.max(8, (item.methane_yield / max) * 230)}px`;
    bar.title = `OLR ${item.OLR}: ${item.methane_yield}`;
    bar.innerHTML = `<span>${item.OLR}</span>`;
    chart.appendChild(bar);
  });
}

async function optimize() {
  const release = setButtonBusy(document.getElementById("optimize"), "Optimizing...");
  let result;
  try {
    result = await api("/optimize", { method: "POST", body: JSON.stringify(state) });
  } catch {
    result = { temperature: 37, pH: 7.12, OLR: Math.min(3.4, state.OLR) };
  } finally {
    release();
  }
  ["temperature", "pH", "OLR"].forEach((key) => {
    if (result[key] !== undefined) {
      state[key] = result[key];
      const input = document.getElementById(key);
      input.value = result[key];
      input.dispatchEvent(new Event("input"));
    }
  });
}

async function loadEvaluation() {
  try {
    const result = await api("/evaluate");
    document.getElementById("evaluationBox").textContent = JSON.stringify(result, null, 2);
  } catch {
    document.getElementById("evaluationBox").textContent = JSON.stringify({
      mode: "browser demo fallback",
      api: API,
      note: "Live API unavailable from this browser. Control-room simulation remains interactive using local physics-guided approximations."
    }, null, 2);
  }
}

document.getElementById("runSimulation").addEventListener("click", simulate);
document.getElementById("runPlantTrace").addEventListener("click", plantTrace);
document.getElementById("optimize").addEventListener("click", optimize);

initControls();
checkApi();
predict();
simulate();
loadEvaluation();
