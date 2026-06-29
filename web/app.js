// ============================================================
// KanBuild — web/app.js
// PURPOSE: Fill the projects table and handle the bid form.
//          Submitting a bid adds it live to the page and checks
//          whether it is under or over the project's budget.
// NOTE: This demo uses sample data hard-coded here so the page
//       works with zero setup. New bids are kept in memory only
//       (they reset when you refresh) — a real system would save
//       them to the database through a backend.
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

// Each bid stores the company NAME directly so new custom companies work too.
let bids = [
  { projectId: 1, company: "Sunflower Paving Co.",    amount: 4100000 },
  { projectId: 1, company: "Heartland Construction",  amount: 4350000 },
  { projectId: 1, company: "Great Plains Paving",     amount: 3980000 },
  { projectId: 2, company: "Midwest Bridge & Grade",  amount: 6600000 },
  { projectId: 2, company: "Liberty Civil Works",     amount: 6950000 },
  { projectId: 2, company: "Heartland Construction",  amount: 6720000 },
  { projectId: 3, company: "Cornerstone Asphalt LLC", amount: 1480000 },
  { projectId: 3, company: "Sunflower Paving Co.",    amount: 1525000 },
  { projectId: 4, company: "Liberty Civil Works",     amount: 12200000 },
  { projectId: 4, company: "Midwest Bridge & Grade",  amount: 12800000 },
  { projectId: 4, company: "Capitol Infrastructure",  amount: 11950000 },
  { projectId: 5, company: "Prairie Road Builders",   amount: 2250000 },
  { projectId: 5, company: "Great Plains Paving",     amount: 2400000 },
  { projectId: 8, company: "Frontier Road Co.",       amount: 1700000 },
  { projectId: 8, company: "Flint Hills Excavating",  amount: 1680000 },
];

// Helpers
const money = (n) => "$" + n.toLocaleString("en-US");

// Get all bids for one project, sorted lowest first
function bidsForProject(projectId) {
  return bids
    .filter((b) => b.projectId === projectId)
    .sort((a, b) => a.amount - b.amount);
}

// ---- Build (or rebuild) the projects table ----
const tbody = document.querySelector("#projectTable tbody");

function renderProjects() {
  tbody.innerHTML = ""; // clear, then rebuild (so new bids show up)

  projects.forEach((p) => {
    const tr = document.createElement("tr");
    const cssStatus = p.status.replace(/\s+/g, ""); // "In Progress" -> "InProgress"

    const projectBids = bidsForProject(p.id);
    let bidsCell;
    if (projectBids.length === 0) {
      bidsCell = `<span class="no-bids">No bids yet</span>`;
    } else {
      const rows = projectBids
        .map((b, i) => {
          const winner = i === 0 ? ' class="winner"' : "";
          const tag = i === 0 ? " ⭐ lowest" : "";
          return `<tr${winner}><td>${b.company}</td><td>${money(b.amount)}${tag}</td></tr>`;
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
  });
}

renderProjects();

// ---- Build (or rebuild) the visible "Submitted Bids" table ----
const bidsTbody = document.querySelector("#bidsTable tbody");
const projectName = (id) => projects.find((p) => p.id === id).name;
const projectBudget = (id) => projects.find((p) => p.id === id).budget;

function renderBids() {
  bidsTbody.innerHTML = "";
  // newest first (a copy so we don't reverse the real array)
  [...bids].reverse().forEach((b) => {
    const budget = projectBudget(b.projectId);
    const over = b.amount > budget;
    const result = over
      ? `<span class="over">⚠ Over budget</span>`
      : `<span class="under">✓ Under budget</span>`;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${projectName(b.projectId)}</td>
      <td>${b.company}</td>
      <td>${money(b.amount)}</td>
      <td>${money(budget)}</td>
      <td>${result}</td>`;
    bidsTbody.appendChild(tr);
  });
}

renderBids();

// ---- Fill the Project dropdown in the bid form (rebuildable) ----
const projectSelect = document.querySelector("#project");

function renderProjectOptions() {
  projectSelect.innerHTML = "";
  projects.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    projectSelect.appendChild(opt);
  });
}

renderProjectOptions();

// ---- Handle "Add a New Project" ----
const projectForm = document.querySelector("#projectForm");
const pmsg = document.querySelector("#pmsg");

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.querySelector("#pname").value.trim();
  const county = document.querySelector("#pcounty").value.trim();
  const budget = Number(document.querySelector("#pbudget").value);
  const status = document.querySelector("#pstatus").value;

  if (!name || !county || !budget) return;

  // Give the new project the next id number
  const nextId = Math.max(...projects.map((p) => p.id)) + 1;
  projects.push({ id: nextId, name, county, budget, status });

  renderProjects();        // show the new row in the table
  renderProjectOptions();  // make it pickable in the bid form

  pmsg.style.color = "#0f5132";
  pmsg.textContent = `✓ Added project "${name}" (${county}, ${money(budget)}, ${status}). It's now in the table and the bid form.`;
  projectForm.reset();
});

// ---- Fill the company suggestion list (you can still type a NEW one) ----
const companyList = document.querySelector("#companyList");

function renderCompanyOptions() {
  companyList.innerHTML = "";
  contractors.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.name;
    companyList.appendChild(opt);
  });
}

renderCompanyOptions();

// Add a company to the list (used by the form and by new bids). Skips duplicates.
function addCompany(name) {
  const exists = contractors.some(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (!exists) {
    const nextId = Math.max(...contractors.map((c) => c.id)) + 1;
    contractors.push({ id: nextId, name });
    renderCompanyOptions();
  }
}

// ---- Handle "Add a New Company" ----
const companyForm = document.querySelector("#companyForm");
const cmsg = document.querySelector("#cmsg");

companyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.querySelector("#cname").value.trim();
  if (!name) return;

  const before = contractors.length;
  addCompany(name);

  if (contractors.length > before) {
    cmsg.style.color = "#0f5132";
    cmsg.textContent = `✓ Added "${name}". It's now saved in the company list for bids.`;
  } else {
    cmsg.style.color = "#842029";
    cmsg.textContent = `"${name}" is already in the list.`;
  }
  companyForm.reset();
});

// ---- Handle bid submission: add it live + check budget ----
const form = document.querySelector("#bidForm");
const msg = document.querySelector("#msg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectId = Number(projectSelect.value);
  const company = document.querySelector("#company").value.trim();
  const amount = Number(document.querySelector("#amount").value);
  const project = projects.find((p) => p.id === projectId);

  if (!company || !amount) return;

  // 1. Actually add the bid to the data
  bids.push({ projectId, company, amount });

  // Remember a brand-new company so it stays in the list for next time
  addCompany(company);

  // 2. Redraw both tables so the new bid appears everywhere
  renderProjects();
  renderBids();

  // 3. Tell the user whether it is under or over budget
  if (amount > project.budget) {
    msg.style.color = "#842029";
    msg.textContent = `⚠ ${company}'s bid of ${money(amount)} is OVER the ${money(project.budget)} budget for "${project.name}". Added for review — hover the Bids column to see it.`;
  } else {
    const saving = project.budget - amount;
    msg.style.color = "#0f5132";
    msg.textContent = `✓ ${company}'s bid of ${money(amount)} is UNDER budget (saves ${money(saving)}) for "${project.name}". Added — hover the Bids column to see it.`;
  }

  form.reset();
});
