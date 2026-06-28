// ============================================================
// KanBuild — web/app.js
// PURPOSE: Fill the projects table and handle the bid form.
// SKILL DEMONSTRATED: Basic JavaScript / front-end interactivity.
// NOTE: This demo uses sample data hard-coded here so the page
//       works with zero setup. In a real system this data would
//       come from the database via an API.
// ============================================================

// Sample data (mirrors database/02_sample_data.sql)
const projects = [
  { id: 1, name: "I-70 Resurfacing — Mile 350-365", county: "Shawnee",  budget: 4200000,  status: "In Progress" },
  { id: 2, name: "US-75 Bridge Replacement",        county: "Jackson",  budget: 6800000,  status: "Awarded" },
  { id: 3, name: "K-10 Shoulder Widening",          county: "Douglas",  budget: 1500000,  status: "Bidding" },
  { id: 4, name: "I-35 Interchange Upgrade",        county: "Johnson",  budget: 12500000, status: "Bidding" },
  { id: 5, name: "US-54 Pavement Repair",           county: "Sedgwick", budget: 2300000,  status: "Complete" },
  { id: 6, name: "K-18 Culvert Replacement",        county: "Riley",    budget: 850000,   status: "Planned" },
  { id: 7, name: "I-135 Lane Addition",             county: "Saline",   budget: 9750000,  status: "Planned" },
  { id: 8, name: "US-50 Intersection Safety",       county: "Ford",     budget: 1750000,  status: "In Progress" },
];

// Format a number as US dollars
const money = (n) => "$" + n.toLocaleString("en-US");

// ---- 1. Build the projects table ----
const tbody = document.querySelector("#projectTable tbody");
const projectSelect = document.querySelector("#project");

projects.forEach((p) => {
  // table row
  const tr = document.createElement("tr");
  const cssStatus = p.status.replace(/\s+/g, ""); // "In Progress" -> "InProgress"
  tr.innerHTML = `
    <td>${p.name}</td>
    <td>${p.county}</td>
    <td>${money(p.budget)}</td>
    <td><span class="badge ${cssStatus}">${p.status}</span></td>`;
  tbody.appendChild(tr);

  // dropdown option for the bid form
  const opt = document.createElement("option");
  opt.value = p.id;
  opt.textContent = p.name;
  projectSelect.appendChild(opt);
});

// ---- 2. Handle bid submission (with simple validation) ----
const form = document.querySelector("#bidForm");
const msg = document.querySelector("#msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectId = Number(projectSelect.value);
  const company = document.querySelector("#company").value.trim();
  const amount = Number(document.querySelector("#amount").value);
  const project = projects.find((p) => p.id === projectId);

  // Validation: warn if bid is over budget (a real business rule)
  if (amount > project.budget) {
    msg.style.color = "#842029";
    msg.textContent = `⚠ Bid of ${money(amount)} is OVER the ${money(project.budget)} budget for "${project.name}". Submitted anyway for review.`;
  } else {
    msg.style.color = "#0f5132";
    msg.textContent = `✓ Bid of ${money(amount)} from "${company}" recorded for "${project.name}".`;
  }
  form.reset();
});
