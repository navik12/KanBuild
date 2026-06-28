# 🛣️ KanBuild — Highway Construction Project & Bidding System

A small, **100% free** portfolio project that recreates — on a tiny
scale — **AASHTOWare Project**, the software state DOTs (like the
**Kansas Department of Transportation**) use to manage road
construction projects and contractor bids.

> Built to practice every skill in the **KDOT Management Analyst II**
> job description: SQL, databases, reporting/BI, data analysis, HTML,
> and the System Development Life Cycle (SDLC).

---

## 🎯 Why this project?
The real job is the technical lead for KDOT's project/bidding software.
This repo is a miniature version of that exact system — so it maps
directly to the job and makes a strong talking point in an interview.

## 🧩 How it covers every JD skill

| JD skill | Where it lives | What you do |
|----------|----------------|-------------|
| **SQL (30% of the job)** | `database/03_queries.sql` | 20 reports: JOINs, GROUP BY, subqueries, CTEs, CASE |
| **Database admin / design** | `database/01_schema.sql` | 5 related tables, keys, indexes, constraints |
| **Data validation** | Q17–Q19 + `analyze.py` | Audit queries for bad/missing data |
| **Reporting & BI** | `analysis/analyze.py` → CSV → Looker Studio | Export data and build a dashboard |
| **Data analysis** | `analysis/analyze.py` | Python + pandas summaries |
| **HTML / website updates** | `web/index.html`, `web/app.js` | Project list + bid form |
| **SDLC + testing** | `docs/` | Requirements → test cases → user guide |
| **Training / documentation** | `docs/user_guide.md` | Plain how-to guide |
| **AASHTOWare knowledge** | the whole concept | You can speak to bids, projects, materials |

## 🆓 Tools used (all free, no credit card)
- **SQLite** — the database (syntax ~matches the SQL Server / T-SQL KDOT uses)
- **Python + pandas** — data analysis (already installed on your Mac)
- **HTML / CSS / JavaScript** — the web page
- **Git / GitHub** — version control (optional next step)
- **Google Looker Studio** — free BI dashboard (optional next step)

---

## 🚀 Quick start
```bash
cd KanBuild

# 1. Build the database and print all 20 reports
bash database/build.sh

# 2. Run the Python data analysis (exports a CSV)
python3 analysis/analyze.py

# 3. Open the web page
open web/index.html        # or: python3 -m http.server 8000
```

## 📁 Project structure
```
KanBuild/
├── README.md                  ← you are here
├── database/
│   ├── 01_schema.sql          ← create the tables
│   ├── 02_sample_data.sql     ← realistic Kansas sample data
│   ├── 03_queries.sql         ← 20 SQL reports (your main practice)
│   └── build.sh               ← one command to build + run it all
├── analysis/
│   └── analyze.py             ← Python + pandas analysis → CSV
├── web/
│   ├── index.html             ← project list + bid form
│   └── app.js                 ← front-end logic
└── docs/
    ├── requirements.md        ← SDLC: plan
    ├── test_cases.md          ← SDLC: test
    └── user_guide.md          ← documentation / training
```

## 📚 Learning path (suggested order)
1. Read `docs/requirements.md` — understand what we're building.
2. Read `database/01_schema.sql` — see how the tables relate.
3. Run `bash database/build.sh` — watch the reports print.
4. Open `database/03_queries.sql` and run queries one at a time; tweak them.
5. Run `python3 analysis/analyze.py` — see Python analyze the same data.
6. Open `web/index.html` — try the bid form.
7. Work through `docs/test_cases.md` — mark each test Pass/Fail.
8. (Stretch) Build a Looker Studio dashboard from the exported CSV.

---
*Demo project for KDOT Management Analyst II skill prep. All data is fictional.*
