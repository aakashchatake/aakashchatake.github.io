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
const scenarioStorageKey = "gfis.linkedScenario.v1";
const memoryStorageKey = "gfis.controlRoom.memory.v1";
let lastPrediction = null;
let lastStateSnapshot = null;

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
      recordParameterChange(key, Number(event.target.value));
      publishScenario("Process variables updated");
      predict();
    });
  });
  publishScenario("Initial process state ready");
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

function getMemory() {
  try {
    return JSON.parse(localStorage.getItem(memoryStorageKey) || "[]");
  } catch {
    return [];
  }
}

function setMemory(records) {
  localStorage.setItem(memoryStorageKey, JSON.stringify(records.slice(-300)));
  renderMemory();
}

function compactState(input = state) {
  return `T ${input.temperature?.toFixed?.(1) ?? input.temperature} C, pH ${input.pH?.toFixed?.(1) ?? input.pH}, OLR ${input.OLR?.toFixed?.(1) ?? input.OLR}, HRT ${input.HRT?.toFixed?.(1) ?? input.HRT}, TS ${input.TS?.toFixed?.(1) ?? input.TS}, VS ${input.VS?.toFixed?.(1) ?? input.VS}`;
}

function describeEffect(previous, current, result) {
  const parts = [];
  if (previous) {
    ["OLR", "pH", "temperature", "HRT", "TS", "VS"].forEach((key) => {
      const diff = current[key] - previous[key];
      if (Math.abs(diff) >= 0.09) parts.push(`${key} ${diff > 0 ? "+" : ""}${diff.toFixed(1)}`);
    });
  }
  if (result) {
    parts.push(`CH4 ${Number(result.methane_yield).toFixed(2)}`);
    parts.push(`VFA/ALK ${Number(result.vfa_alk_ratio).toFixed(3)}`);
    parts.push(result.stability_label);
    if (result.physics_violation) parts.push("physics violation");
  }
  return parts.length ? parts.join(" | ") : "Baseline state";
}

function addMemory(action, result = null, extra = {}) {
  const records = getMemory();
  const record = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    timestamp: new Date().toISOString(),
    action,
    state: { ...state },
    result,
    effect: extra.effect || describeEffect(lastStateSnapshot, state, result),
    notes: extra.notes || ""
  };
  records.push(record);
  setMemory(records);
  lastStateSnapshot = { ...state };
  if (result) lastPrediction = result;
}

function recordParameterChange(key, value) {
  if (!lastStateSnapshot) {
    lastStateSnapshot = { ...state };
    return;
  }
  const before = lastStateSnapshot[key];
  if (before === undefined || Math.abs(value - before) < 0.09) return;
  addMemory("Parameter changed", lastPrediction, {
    effect: `${key} changed from ${Number(before).toFixed(1)} to ${Number(value).toFixed(1)}; next prediction/simulation records the response.`
  });
}

function renderMemory() {
  const records = getMemory().slice().reverse();
  const rows = document.getElementById("memoryRows");
  const count = document.getElementById("memoryCount");
  const action = document.getElementById("latestAction");
  const effect = document.getElementById("latestEffect");
  if (!rows || !count || !action || !effect) return;
  count.textContent = String(records.length);
  action.textContent = records[0]?.action || "No runs yet";
  effect.textContent = records[0]?.effect || "Waiting for parameter change";
  rows.innerHTML = records.slice(0, 40).map((record) => {
    const output = record.result
      ? `CH4 ${Number(record.result.methane_yield).toFixed(2)}, VFA/ALK ${Number(record.result.vfa_alk_ratio).toFixed(3)}, ${record.result.stability_label || "state n/a"}`
      : record.effect;
    return `<tr>
      <td>${new Date(record.timestamp).toLocaleString()}</td>
      <td>${record.action}</td>
      <td>${compactState(record.state)}</td>
      <td>${output}<br><small>${record.notes || ""}</small></td>
    </tr>`;
  }).join("");
}

function downloadFile(filename, mime, content) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportMemoryJson() {
  downloadFile(`gfis-control-room-memory-${Date.now()}.json`, "application/json", JSON.stringify(getMemory(), null, 2));
}

function exportMemoryCsv() {
  const rows = getMemory();
  const header = ["timestamp", "action", "temperature", "pH", "OLR", "HRT", "TS", "VS", "methane_yield", "vfa_alk_ratio", "stability_label", "effect"];
  const csv = [header.join(",")].concat(rows.map((record) => {
    const result = record.result || {};
    return header.map((key) => {
      const value = record.state?.[key] ?? result[key] ?? record[key] ?? "";
      return `"${String(value).replaceAll('"', '""')}"`;
    }).join(",");
  })).join("\n");
  downloadFile(`gfis-control-room-memory-${Date.now()}.csv`, "text/csv", csv);
}

function exportMemoryReport() {
  const rows = getMemory();
  const latest = rows.at(-1);
  const warnings = rows.filter((r) => r.result?.stability_label && r.result.stability_label !== "Stable").length;
  const report = [
    "# GFIS Control Room Experiment Report",
    "",
    `Generated: ${new Date().toLocaleString()}`,
    `Total records: ${rows.length}`,
    `Warning/Critical records: ${warnings}`,
    "",
    "## Latest Run",
    latest ? `- Action: ${latest.action}\n- State: ${compactState(latest.state)}\n- Effect: ${latest.effect}` : "No records available.",
    "",
    "## Interpretation",
    "This local report captures operator parameter changes, model outputs, OLR sweeps, 48-hour trace runs and simulator handoffs. It is browser-local evidence for the digital-twin-ready workflow and can be exported before clearing memory.",
    "",
    "## Records",
    ...rows.map((r, i) => `${i + 1}. ${r.timestamp} | ${r.action} | ${compactState(r.state)} | ${r.effect}`)
  ].join("\n");
  downloadFile(`gfis-control-room-report-${Date.now()}.md`, "text/markdown", report);
}

function resetMemory() {
  if (!confirm("Export required data before reset. Clear all local GFIS control-room memory now?")) return;
  localStorage.removeItem(memoryStorageKey);
  renderMemory();
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
  let result;
  try {
    result = await api("/predict", { method: "POST", body: JSON.stringify(state) });
    document.getElementById("methaneMetric").textContent = result.methane_yield.toFixed(2);
    document.getElementById("boundMetric").textContent = result.physics_upper_bound.toFixed(2);
    document.getElementById("vfaMetric").textContent = result.vfa_alk_ratio.toFixed(3);
    document.getElementById("violationMetric").textContent = result.physics_violation ? "Yes" : "No";
    setStability(result.stability_label);
  } catch (error) {
    result = fallbackPredict(state);
    document.getElementById("methaneMetric").textContent = result.methane_yield.toFixed(2);
    document.getElementById("boundMetric").textContent = result.physics_upper_bound.toFixed(2);
    document.getElementById("vfaMetric").textContent = result.vfa_alk_ratio.toFixed(3);
    document.getElementById("violationMetric").textContent = result.physics_violation ? "Yes" : "No";
    setStability(result.stability_label);
  }
  addMemory("Prediction", result);
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
    addMemory("What-if OLR sweep", outputs.at(-1), { notes: `${outputs.length} OLR scenarios evaluated.` });
  } catch {
    const outputs = fallbackSimulate(scenarios);
    drawChart(outputs);
    addMemory("What-if OLR sweep", outputs.at(-1), { notes: `${outputs.length} fallback OLR scenarios evaluated.` });
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
    addMemory("48h plant trace", outputs.at(-1), { notes: "48-hour API trace completed." });
  } catch {
    const outputs = fallbackPlantTrace();
    drawChart(outputs.filter((_, index) => index % 6 === 0).map((item) => ({
      OLR: `${item.hour}h`,
      methane_yield: item.methane_yield
    })));
    addMemory("48h plant trace", outputs.at(-1), { notes: "48-hour fallback trace completed." });
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

function scenarioPayload(reason = "Manual update") {
  const payload = {
    source: "GFIS Model Control Room",
    reason,
    updated_at: new Date().toISOString(),
    state: { ...state },
    interpretation: {
      current_vfa_risk:
        state.OLR >= 4.5 || state.pH < 6.8 ? "Warning/Critical tendency" : "Stable tendency",
      expected_response:
        "Industrial simulator will adjust acidification rate, methane projection, feed depletion and soft-sensor alarms from these variables."
    }
  };
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => params.set(key, String(value)));
  payload.simulator_url = `industrial_simulation.html?${params.toString()}`;
  return payload;
}

function publishScenario(reason) {
  const payload = scenarioPayload(reason);
  try {
    localStorage.setItem(scenarioStorageKey, JSON.stringify(payload));
  } catch {
    // Local files can run in stricter browser contexts; query parameters still carry the state.
  }
  const status = document.getElementById("scenarioStatus");
  if (status) {
    status.textContent = `OLR ${state.OLR.toFixed(1)}, pH ${state.pH.toFixed(1)}, Temp ${state.temperature.toFixed(1)} C`;
  }
  const openLink = document.getElementById("openLinkedSimulator");
  if (openLink) openLink.href = payload.simulator_url;
  return payload;
}

function sendToIndustrialSimulator() {
  const payload = publishScenario("Sent from control room");
  addMemory("Sent to industrial simulator", lastPrediction, {
    notes: `Simulator URL: ${payload.simulator_url}`
  });
  window.location.href = payload.simulator_url;
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
  addMemory("Optimization applied", lastPrediction, { notes: "Operating point updated by optimizer." });
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
document.getElementById("sendToIndustrial").addEventListener("click", sendToIndustrialSimulator);
document.getElementById("exportCsv").addEventListener("click", exportMemoryCsv);
document.getElementById("exportJson").addEventListener("click", exportMemoryJson);
document.getElementById("exportReport").addEventListener("click", exportMemoryReport);
document.getElementById("resetMemory").addEventListener("click", resetMemory);

initControls();
checkApi();
predict();
simulate();
loadEvaluation();
renderMemory();
