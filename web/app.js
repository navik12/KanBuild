// ============================================================
// KanBuild — web/app.js
// PURPOSE: Fill the projects table and handle the bid form.
// NOTE: This demo uses sample data hard-coded here so the page
//       works with zero setup. In a real system this data would
//       come from the database via an API.
// ============================================================

// ---- Sample data (mirrors database/02_sample_data.sql) ----

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

const contractors = [
  { id: 1,  name: "Sunflower Paving Co." },
  { id: 2,  name: "Prairie Road Builders" },
  { id: 3,  name: "Heartland Construction" },
  { id: 4,  name: "Cornerstone Asphalt LLC" },
  { id: 5,  name: "Midwest Bridge & Grade" },
  { id: 6,  name: "Flint Hills Excavating" },
  { id: 7,  name: "Great Plains Paving" },
  { id: 8,  name: "Liberty Civil Works" },
  { id: 9,  name: "Frontier Road Co." },
  { id: 10, name: "Capitol Infrastructure" },
];

const bids = [
  { projectId: 1, contractorId: 1, amount: 4100000 },
  { projectId: 1, contractorId: 3, amount: 4350000 },
  { projectId: 1, contractorId: 7, amount: 3980000 },
  { projectId: 2, contractorId: 5, amount: 6600000 },
  { projectId: 2, contractorId: 8, amount: 6950000 },
  { projectId: 2, contractorId: 3, amount: 6720000 },
  { projectId: 3, contractorId: 4, amount: 1480000 },
  { projectId: 3, contractorId: 1, amount: 1525000 },
  { projectId: 4, contractorId: 8, amount: 12200000 },
  { projectId: 4, contractorId: 5, amount: 12800000 },
  { projectId: 4, contractorId: 10, amount: 11950000 },
  { projectId: 5, contractorId: 2, amount: 2250000 },
  { projectId: 5, contractorId: 7, amount: 2400000 },
  { projectId: 8, contractorId: 9, amount: 1700000 },
  { projectId: 8, contractorId: 6, amount: 1680000 },
];

// Helpers
const money = (n) => "$" + n.toLocaleString("en-US");
const companyName = (id) => contractors.find((c) => c.id === id).name;

// Get all bids for one project, sorted lowest first
function bidsForProject(projectId) {
  return bids
    .filter((b) => b.projectId === projectId)
    .sort((a, b) => a.amount - b.amount);
}

// ---- 1. Build the projects table (with a Bids column) ----
const tbody = document.querySelector("#projectTable tbody");
const projectSelect = document.querySelector("#project");

projects.forEach((p) => {
  const tr = document.createElement("tr");
  const cssStatus = p.status.replace(/\s+/g, ""); // "In Progress" -> "InProgress"

  // Build the hover popup listing this project's bids
  const projectBids = bidsForProject(p.id);
  let bidsCell;
  if (projectBids.length === 0) {
    bidsCell = `<span class="no-bids">No bids yet</span>`;
  } else {
    // The first one (lowest) is the winning bid
    const rows = projectBids
      .map((b, i) => {
        const winner = i === 0 ? ' class="winner"' : "";
        const tag = i === 0 ? " ⭐ lowest" : "";
        return `<tr${winner}><td>${companyName(b.contractorId)}</td><td>${money(b.amount)}${tag}</td></tr>`;
      })
      .join("");
    bidsCell = `
      <span class="bid-count">${projectBids.length} bids ▾</span>
      <div class="bid-popup">
        <table>
          <thead><tr><th>Company</th><th>Bid amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  tr.innerHTML = `
    <td>${p.name}</td>
    <td>${p.county}</td>
    <td>${money(p.budget)}</td>
    <td><span class="badge ${cssStatus}">${p.status}</span></td>
    <td class="bids-cell">${bidsCell}</td>`;
  tbody.appendChild(tr);

  // dropdown option for the bid form
  const opt = document.createElement("option");
  opt.value = p.id;
  opt.textContent = p.name;
  projectSelect.appendChild(opt);
});

// ---- 2. Fill the Company dropdown so you don't have to type names ----
const companySelect = document.querySelector("#company");
contractors.forEach((c) => {
  const opt = document.createElement("option");
  opt.value = c.name;
  opt.textContent = c.name;
  companySelect.appendChild(opt);
});

// ---- 3. Handle bid submission (with simple validation) ----
const form = document.querySelector("#bidForm");
const msg = document.querySelector("#msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectId = Number(projectSelect.value);
  const company = companySelect.value;
  const amount = Number(document.querySelector("#amount").value);
  const project = projects.find((p) => p.id === projectId);

  // Warn if the bid is over budget (a business rule)
  if (amount > project.budget) {
    msg.style.color = "#842029";
    msg.textContent = `⚠ Bid of ${money(amount)} is OVER the ${money(project.budget)} budget for "${project.name}". Submitted anyway for review.`;
  } else {
    msg.style.color = "#0f5132";
    msg.textContent = `✓ Bid of ${money(amount)} from "${company}" recorded for "${project.name}".`;
  }
  form.reset();
});
