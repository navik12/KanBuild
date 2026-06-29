// ============================================================
// KanBuild — web/app.js
// PURPOSE: Fill the tables and handle the three forms
//          (add project, add company, submit bid).
//
// TWO MODES:
//   • DATABASE MODE — when started with `python3 web/server.py`,
//     the page loads from and saves to the real SQLite database,
//     so everything you add lasts forever.
//   • DEMO MODE — if you just double-click the file (no server),
//     it falls back to the built-in sample data below. You can
//     still add things, but they reset when you refresh.
// ============================================================

// ---- Built-in sample data (used only in DEMO MODE) ----

let projects = [
  { id: 1, name: "I-70 Resurfacing — Mile 350-365", county: "Shawnee",  budget: 4200000,  status: "In Progress" },
  { id: 2, name: "US-75 Bridge Replacement",        county: "Jackson",  budget: 6800000,  status: "Awarded" },
  { id: 3, name: "K-10 Shoulder Widening",          county: "Douglas",  budget: 1500000,  status: "Bidding" },
  { id: 4, name: "I-35 Interchange Upgrade",        county: "Johnson",  budget: 12500000, status: "Bidding" },
  { id: 5, name: "US-54 Pavement Repair",           county: "Sedgwick", budget: 2300000,  status: "Complete" },
  { id: 6, name: "K-18 Culvert Replacement",        county: "Riley",    budget: 850000,   status: "Planned" },
  { id: 7, name: "I-135 Lane Addition",             county: "Saline",   budget: 9750000,  status: "Planned" },
  { id: 8, name: "US-50 Intersection Safety",       county: "Ford",     budget: 1750000,  status: "In Progress" },
];

let contractors = [
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

let useApi = false; // becomes true if the backend server answers

// ---- Helpers ----
const money = (n) => "$" + Number(n).toLocaleString("en-US");
const projectName = (id) => projects.find((p) => p.id === id).name;
const projectBudget = (id) => projects.find((p) => p.id === id).budget;

function bidsForProject(projectId) {
  return bids
    .filter((b) => b.projectId === projectId)
    .sort((a, b) => a.amount - b.amount);
}

// ======================= RENDERING =======================

const tbody = document.querySelector("#projectTable tbody");
const bidsTbody = document.querySelector("#bidsTable tbody");
const projectSelect = document.querySelector("#project");
const companyList = document.querySelector("#companyList");

function renderProjects() {
  tbody.innerHTML = "";
  projects.forEach((p) => {
    const tr = document.createElement("tr");
    const cssStatus = p.status.replace(/\s+/g, "");

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

function renderBids() {
  bidsTbody.innerHTML = "";
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

function renderProjectOptions() {
  projectSelect.innerHTML = "";
  projects.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    projectSelect.appendChild(opt);
  });
}

function renderCompanyOptions() {
  companyList.innerHTML = "";
  contractors.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.name;
    companyList.appendChild(opt);
  });
}

function renderAll() {
  renderProjects();
  renderBids();
  renderProjectOptions();
  renderCompanyOptions();
}

// ======================= DATA LOADING =======================

// Try the backend. If it answers, use the database; otherwise stay in demo mode.
async function init() {
  try {
    const res = await fetch("/api/data");
    if (res.ok) {
      const data = await res.json();
      projects = data.projects;
      contractors = data.contractors;
      bids = data.bids;
      useApi = true;
    }
  } catch (e) {
    useApi = false; // server not running — keep the built-in sample data
  }
  renderAll();
  showMode();
}

// Reload fresh data from the database after a change (keeps server-assigned IDs)
async function reload() {
  const res = await fetch("/api/data");
  const data = await res.json();
  projects = data.projects;
  contractors = data.contractors;
  bids = data.bids;
  renderAll();
}

// Small banner telling the user which mode they're in
function showMode() {
  const banner = document.querySelector("#mode");
  if (!banner) return;
  if (useApi) {
    banner.className = "mode-db";
    banner.innerHTML = "💾 <strong>Database mode</strong> — everything you add is saved permanently.";
  } else {
    banner.className = "mode-demo";
    banner.innerHTML = "🧪 <strong>Demo mode</strong> — changes reset on refresh. To save permanently, run <code>python3 web/server.py</code> and open <code>localhost:8000</code>.";
  }
}

// Add a company locally (demo mode only). In DB mode the server handles it.
function addCompanyLocal(name) {
  const exists = contractors.some((c) => c.name.toLowerCase() === name.toLowerCase());
  if (!exists) {
    const nextId = Math.max(0, ...contractors.map((c) => c.id)) + 1;
    contractors.push({ id: nextId, name });
    renderCompanyOptions();
  }
}

// ======================= FORM HANDLERS =======================

// --- Add a New Project ---
const projectForm = document.querySelector("#projectForm");
const pmsg = document.querySelector("#pmsg");

projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.querySelector("#pname").value.trim();
  const county = document.querySelector("#pcounty").value.trim();
  const budget = Number(document.querySelector("#pbudget").value);
  const status = document.querySelector("#pstatus").value;
  if (!name || !county || !budget) return;

  if (useApi) {
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, county, budget, status }),
    });
    await reload();
  } else {
    const nextId = Math.max(0, ...projects.map((p) => p.id)) + 1;
    projects.push({ id: nextId, name, county, budget, status });
    renderProjects();
    renderProjectOptions();
  }

  pmsg.style.color = "#0f5132";
  pmsg.textContent = `✓ Added project "${name}" (${county}, ${money(budget)}, ${status}).`;
  projectForm.reset();
});

// --- Add a New Company ---
const companyForm = document.querySelector("#companyForm");
const cmsg = document.querySelector("#cmsg");

companyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.querySelector("#cname").value.trim();
  if (!name) return;

  if (useApi) {
    await fetch("/api/contractors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await reload();
  } else {
    addCompanyLocal(name);
  }

  cmsg.style.color = "#0f5132";
  cmsg.textContent = `✓ Added "${name}". It's now available when submitting a bid.`;
  companyForm.reset();
});

// --- Submit a Bid ---
const form = document.querySelector("#bidForm");
const msg = document.querySelector("#msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const projectId = Number(projectSelect.value);
  const company = document.querySelector("#company").value.trim();
  const amount = Number(document.querySelector("#amount").value);
  const project = projects.find((p) => p.id === projectId);
  if (!company || !amount) return;

  if (useApi) {
    await fetch("/api/bids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, company, amount }),
    });
    await reload();
  } else {
    bids.push({ projectId, company, amount });
    addCompanyLocal(company);
    renderProjects();
    renderBids();
  }

  // Tell the user whether it's under or over budget
  if (amount > project.budget) {
    msg.style.color = "#842029";
    msg.textContent = `⚠ ${company}'s bid of ${money(amount)} is OVER the ${money(project.budget)} budget for "${project.name}".`;
  } else {
    const saving = project.budget - amount;
    msg.style.color = "#0f5132";
    msg.textContent = `✓ ${company}'s bid of ${money(amount)} is UNDER budget (saves ${money(saving)}) for "${project.name}".`;
  }
  form.reset();
});

// Start everything
init();
