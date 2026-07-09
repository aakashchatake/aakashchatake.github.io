const cells = [
  ["Solapur", 88, "Hub"], ["Pandharpur", 81, "Spoke"], ["Malshiras", 84, "Spoke"], ["Mohol", 76, "Cluster"],
  ["Akkalkot", 69, "Candidate"], ["Barshi", 79, "Cluster"], ["Mangalwedha", 72, "Candidate"], ["Sangola", 74, "Cluster"],
  ["Karmala", 67, "Watch"], ["Madha", 73, "Candidate"], ["North Solapur", 86, "Cluster"], ["South Solapur", 83, "Cluster"],
  ["Village belt A", 92, "Best"], ["Village belt B", 78, "Cluster"], ["Village belt C", 64, "Watch"], ["Village belt D", 71, "Candidate"]
];

function score() {
  const f = Number(document.getElementById("feedstock").value);
  const i = Number(document.getElementById("infra").value);
  const e = Number(document.getElementById("economics").value);
  const v = Number(document.getElementById("environment").value);
  const s = 0.40 * f + 0.25 * i + 0.20 * e + 0.15 * v;
  document.getElementById("score").textContent = `${s.toFixed(1)} / 100`;
  updateProposal();
}

function runPlanner() {
  const grid = document.getElementById("clusterMap");
  grid.innerHTML = cells.map(([name, value, type]) => {
    const cls = value >= 88 ? "best" : value >= 76 ? "hot" : "";
    return `<article class="cell ${cls}"><strong>${name}</strong><span>${type}</span><br><span>ML suitability ${value}/100</span></article>`;
  }).join("");
  document.getElementById("plannerStatus").textContent = "ML planner completed: 4 high-priority clusters identified";
  updateProposal();
}

function proposalText() {
  const viability = document.getElementById("score").textContent;
  return `GFIS Level 1 Government Proposal Note

Objective:
Deploy GFIS as an AI-driven planning and monitoring framework for rural biogas infrastructure.

Planning logic:
- Plant suitability score = 0.40 feedstock + 0.25 infrastructure + 0.20 economics + 0.15 environment.
- Geospatial AI identifies village/taluka clusters using livestock, crop residue, municipal organic waste, roads, grid access and market proximity.
- K-Means/hub-spoke planning groups plants into district-level operating networks.
- XGBoost/LSTM methane models estimate yield, energy output and stability trends.
- IoT sensors provide pH, temperature, pressure, CH4/CO2/H2S and flow telemetry.

Current demo viability score:
${viability}

Government value:
- objective subsidy targeting,
- district monitoring of 50-200 plants per hub,
- methane and carbon-credit estimation,
- rural energy security planning,
- auditable IP-backed GFIS software platform.

IP note:
GFIS copyright application, acknowledgement slip and author NOC are copied in the Level 1/IP reference folder. Final legal claims should be reviewed by counsel before government submission.`;
}

function updateProposal() {
  document.getElementById("proposalNote").textContent = proposalText();
}

function exportProposal() {
  const blob = new Blob([proposalText()], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gfis-level1-government-proposal-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function resetPlanner() {
  document.getElementById("feedstock").value = 82;
  document.getElementById("infra").value = 74;
  document.getElementById("economics").value = 68;
  document.getElementById("environment").value = 79;
  document.getElementById("clusterMap").innerHTML = "";
  document.getElementById("plannerStatus").textContent = "Awaiting run";
  score();
}

["feedstock", "infra", "economics", "environment"].forEach((id) => {
  document.getElementById(id).addEventListener("input", score);
});
document.getElementById("runPlanner").addEventListener("click", runPlanner);
document.getElementById("exportProposal").addEventListener("click", exportProposal);
document.getElementById("resetPlanner").addEventListener("click", resetPlanner);
score();
