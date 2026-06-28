# KanBuild — Test Cases (SDLC: Test Phase)

> **SDLC skill:** Testing proves each requirement actually works.
> This is exactly the JD's "SDLC testing" duty. Run the queries in
> `database/03_queries.sql`, compare to "Expected", and mark Pass/Fail.

| # | Requirement | Test (how to check) | Expected result | Pass/Fail |
|---|-------------|---------------------|-----------------|-----------|
| T1 | R1 | Run Q1 | 8 projects listed, biggest budget (I-35, $12.5M) first | ☐ |
| T2 | R2 | Run Q3 | Only certified=1 contractors appear (8 of 10) | ☐ |
| T3 | R3 | Run Q7 | 15 bids, each showing project + contractor name | ☐ |
| T4 | R5 | Run Q9 | One winning (MIN) bid per project that has bids | ☐ |
| T5 | R5 | Run Q11 | I-70 winner = Great Plains Paving ($3.98M) | ☐ |
| T6 | R6 | Run Q13 | "savings" column = budget − winning bid; sign correct | ☐ |
| T7 | R7 | Run Q17 | US-50 (has start date, missing end date) appears | ☐ |
| T8 | R7 | Run Q18 | No bids over budget → 0 rows (data is clean) | ☐ |
| T9 | R8 | Open web/index.html | Table shows 8 projects with colored status badges | ☐ |
| T10 | R8 | Submit a bid over budget on the web form | Orange "⚠ OVER budget" warning appears | ☐ |
| T11 | Foreign keys | Try inserting a bid with project_id=999 | Rejected (FK violation) — see note below | ☐ |

### Note on T11 (database integrity test)
```sql
-- Run inside: sqlite3 database/kanbuild.db
PRAGMA foreign_keys = ON;
INSERT INTO bids (bid_id, project_id, contractor_id, bid_amount, bid_date)
VALUES (999, 999, 1, 100000, '2026-06-01');
-- Expected: "FOREIGN KEY constraint failed"
```

## Bug log (SDLC: defect tracking)
Record anything that fails here, like a real bug tracker / GitHub issue:

| Bug # | Test | What went wrong | Status |
|-------|------|-----------------|--------|
| (example) B1 | T10 | Warning showed wrong color | Fixed |
