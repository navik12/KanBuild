# 🛣️ KanBuild — Highway Construction Project & Bidding System

This is a small project I made to learn how road construction projects
are managed. It's a simple version of **AASHTOWare Project** — the
software that state transportation departments, like the **Kansas DOT**,
use to keep track of road projects and the bids that contractors send in
to build them.

I built it to get better at SQL, databases, data analysis, reporting,
HTML, and working through a project from start to finish.

### What I built, step by step
1. **Designed a database** — five related tables (projects, contractors, bids, materials) with keys and constraints.
2. **Loaded sample data** — 8 highway projects, 10 contractors, and the bids between them.
3. **Wrote 20 SQL reports** — using JOINs, GROUP BY, subqueries, CTEs, CASE, and a few data-quality checks.
4. **Analyzed the data in Python** — used pandas to summarize it and export a clean CSV.
5. **Built a web page** — an HTML/CSS/JavaScript page where you can add projects, add companies, submit bids, and see each project's bids.
6. **Created a dashboard** — connected the data to Google Looker Studio and built scorecards and charts.
7. **Wrote the documentation** — requirements, test cases, and a user guide, and put it all on GitHub.

---

## 📊 Live Dashboard

I built this dashboard in Google Looker Studio using the data from this
project. It shows the budgets, project status, and how much each project
saved compared to its budget.

**[View the live dashboard →](https://datastudio.google.com/reporting/d2bb1150-ab37-44da-8e52-bd410689eb9a)**

![KanBuild — KDOT Project Dashboard](docs/report.png)

It shows the same results as the SQL reports:
- **Scorecards** — total budget ($39.65M), total projects (8), and projects open for bidding (2)
- **Budget by Project** — each project's cost, colored by county
- **Projects by Status** — how many projects are Planned, Bidding, In Progress, and so on
- **Savings per Project** — the budget minus the winning bid (I-35 saved the most, about $550K)

---

## 📖 About this project

**The idea behind it.** State transportation departments build and repair
thousands of miles of highways. For each project, construction companies
compete by submitting a bid — the price they'll charge to do the work —
and the department usually picks the lowest qualified bidder. Keeping
track of all those projects, bids, budgets, and materials is a big data
job, and the real software that handles it is called AASHTOWare Project.

**What KanBuild does.** KanBuild is a small version of that same idea. It
stores a handful of projects (like "I-70 Resurfacing"), the contractors
who bid on them, the bids themselves, and the materials each project uses.
Then it answers the kinds of questions a manager would ask:

- Who submitted the lowest bid on each project?
- Did the winning bid come in under or over budget?
- How many projects are open for bidding right now?
- Which county has the most road work by dollars?
- Is any of the data missing or wrong?

**How it fits together.**
1. A **database** (SQLite) holds the projects, contractors, bids, and materials.
2. A set of **SQL reports** pulls and analyzes that data to answer the questions above.
3. A **Python script** double-checks the data and exports a CSV for the dashboard.
4. A **web page** shows the project list and lets you add projects, add companies, and submit bids — each bid is checked against the project's budget right away.
5. The **docs** (requirements, test cases, user guide) wrap it up like a real project.

**On the web page you can:**
- Add a new project (name, county, budget, status) — it shows up in the table.
- Add a new company, or just type one while bidding — it's remembered for next time.
- Submit a bid for any project; it instantly tells you if the bid is under or over budget.
- Hover the **Bids** column to see every company that bid on a project, with the lowest one marked as the likely winner.
- See all bids together in the **Submitted Bids** table.

**Saving permanently.** I also wrote a small Python backend (`web/server.py`,
using only the standard library). Run it with `python3 web/server.py` and the
page saves every project, company, and bid straight into the SQLite database,
so they last after you close the browser. If you skip the server and just open
the file, it still works in a "demo mode" that resets on refresh.

> All the data here is made up for learning. KanBuild isn't affiliated
> with AASHTO, AASHTOWare, or the Kansas DOT — it's a personal practice
> project inspired by how their software works.

---

## What I practiced and where it lives

| Skill | Where to find it |
|-------|------------------|
| SQL queries and reporting | `database/03_queries.sql` — 20 reports (JOINs, GROUP BY, subqueries, CTEs, CASE) |
| Database design | `database/01_schema.sql` — 5 related tables, keys, indexes, constraints |
| Data validation | `database/03_queries.sql` (Q17–Q19) and `analysis/analyze.py` |
| Data analysis | `analysis/analyze.py` — Python and pandas |
| Reporting / BI | `analysis/analyze.py` → CSV → Looker Studio dashboard |
| HTML / front-end | `web/index.html`, `web/app.js` |
| Full-stack (backend + API) | `web/server.py` — Python server that saves to the database |
| Documentation and testing | `docs/` — requirements, test cases, user guide |

## Tools I used (all free)
- **SQLite** — the database
- **Python + pandas** — the data analysis
- **HTML / CSS / JavaScript** — the web page
- **Git / GitHub** — version control
- **Google Looker Studio** — the dashboard

---

## 🚀 How to run it
```bash
cd KanBuild

# 1. Build the database and print all 20 reports
bash database/build.sh

# 2. Run the Python data analysis (creates a CSV)
python3 analysis/analyze.py

# 3. Open the web page
#    a) Save permanently (database mode):
python3 web/server.py      # then open http://localhost:8000
#    b) Or just look at it (demo mode):
open web/index.html
```

## 📁 Project structure
```
KanBuild/
├── README.md
├── database/
│   ├── 01_schema.sql          # create the tables
│   ├── 02_sample_data.sql     # sample Kansas data
│   ├── 03_queries.sql         # 20 SQL reports
│   └── build.sh               # builds and runs everything
├── analysis/
│   └── analyze.py             # Python + pandas analysis → CSV
├── web/
│   ├── index.html             # project list + add/bid forms
│   ├── app.js                 # front-end logic
│   └── server.py              # Python backend that saves to the database
└── docs/
    ├── requirements.md        # what the project needs to do
    ├── test_cases.md          # tests to check it works
    └── user_guide.md          # how to use it
```

---
*All data in this project is fictional.*
