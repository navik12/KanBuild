# KanBuild — Test Cases

These are the checks I use to make sure each requirement actually works.
Run the queries in `database/03_queries.sql`, compare the result to the
"Expected" column, and mark each one Pass or Fail.

| # | Requirement | How to check | Expected result | Pass/Fail |
|---|-------------|--------------|-----------------|-----------|
| T1 | R1 | Run Q1 | 8 projects listed, biggest budget (I-35, $12.5M) first | ☐ |
| T2 | R2 | Run Q3 | Only certified contractors appear (8 of 10) | ☐ |
| T3 | R3 | Run Q7 | 15 bids, each showing the project and contractor name | ☐ |
| T4 | R5 | Run Q9 | One winning (lowest) bid per project that has bids | ☐ |
| T5 | R5 | Run Q11 | I-70 winner is Great Plains Paving ($3.98M) | ☐ |
| T6 | R6 | Run Q13 | "savings" = budget − winning bid, with the right sign | ☐ |
| T7 | R7 | Run Q17 | US-50 (has a start date, missing end date) appears | ☐ |
| T8 | R7 | Run Q18 | No bids over budget, so 0 rows (data is clean) | ☐ |
| T9 | R8 | Open web/index.html | Table shows 8 projects with colored status badges | ☐ |
| T10 | R8 | Submit a bid over budget on the web form | An orange "over budget" warning appears | ☐ |
| T11 | Foreign keys | Try inserting a bid with project_id 999 | It's rejected (see the note below) | ☐ |

### Note on T11 (database integrity check)
```sql
-- Run inside: sqlite3 database/kanbuild.db
PRAGMA foreign_keys = ON;
INSERT INTO bids (bid_id, project_id, contractor_id, bid_amount, bid_date)
VALUES (999, 999, 1, 100000, '2026-06-01');
-- Expected: "FOREIGN KEY constraint failed"
```

## Bug log
If something fails, I note it here like a simple bug tracker.

| Bug # | Test | What went wrong | Status |
|-------|------|-----------------|--------|
| (example) B1 | T10 | Warning showed the wrong color | Fixed |
