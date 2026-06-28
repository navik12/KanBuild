-- ============================================================
-- KanBuild — FILE: 03_queries.sql
-- PURPOSE: 20 reporting queries — your main SQL practice
-- SKILL DEMONSTRATED: SELECT, WHERE, JOIN, GROUP BY, aggregates,
--                     subqueries, CTEs, CASE, ORDER BY, data validation
-- ------------------------------------------------------------
-- Run all:   sqlite3 kanbuild.db < 03_queries.sql
-- Or open:   sqlite3 kanbuild.db   then paste one query at a time
-- These mirror the real JD duty: "write SQL queries, validate
-- data, and build reports for management."
-- ============================================================

.headers on
.mode column

-- ============================================================
-- BASICS: SELECT / WHERE / ORDER BY
-- ============================================================

-- Q1. List every project, biggest budget first
SELECT name, county, budget, status
FROM projects
ORDER BY budget DESC;

-- Q2. Only projects currently open for bidding
SELECT name, county, budget
FROM projects
WHERE status = 'Bidding';

-- Q3. Certified contractors only (data filtering + boolean flag)
SELECT company_name, city
FROM contractors
WHERE certified = 1
ORDER BY company_name;

-- ============================================================
-- AGGREGATES: COUNT / SUM / AVG / MIN / MAX + GROUP BY
-- ============================================================

-- Q4. How many projects are in each status?
SELECT status, COUNT(*) AS project_count
FROM projects
GROUP BY status
ORDER BY project_count DESC;

-- Q5. Total and average project budget across the whole agency
SELECT
    COUNT(*)        AS total_projects,
    SUM(budget)     AS total_budget,
    ROUND(AVG(budget), 0) AS avg_budget,
    MAX(budget)     AS largest_project
FROM projects;

-- Q6. Total budget by county (which counties have the most road work?)
SELECT county, COUNT(*) AS projects, SUM(budget) AS total_budget
FROM projects
GROUP BY county
ORDER BY total_budget DESC;

-- ============================================================
-- JOINS: combining tables (the heart of real reporting)
-- ============================================================

-- Q7. Every bid with the project name AND contractor name
SELECT p.name AS project, c.company_name AS contractor, b.bid_amount, b.bid_date
FROM bids b
JOIN projects    p ON b.project_id    = p.project_id
JOIN contractors c ON b.contractor_id = c.contractor_id
ORDER BY p.name, b.bid_amount;

-- Q8. Number of bids each project received
SELECT p.name, COUNT(b.bid_id) AS num_bids
FROM projects p
LEFT JOIN bids b ON p.project_id = b.project_id   -- LEFT JOIN keeps projects with 0 bids
GROUP BY p.project_id
ORDER BY num_bids DESC;

-- Q9. The LOWEST (winning) bid for each project — a classic DOT report
SELECT p.name AS project, MIN(b.bid_amount) AS winning_bid
FROM projects p
JOIN bids b ON p.project_id = b.project_id
GROUP BY p.project_id
ORDER BY winning_bid DESC;

-- ============================================================
-- SUBQUERIES + CTEs (advanced reporting)
-- ============================================================

-- Q10. Show WHO submitted the lowest bid on each project (subquery)
SELECT p.name AS project, c.company_name AS low_bidder, b.bid_amount
FROM bids b
JOIN projects    p ON b.project_id = p.project_id
JOIN contractors c ON b.contractor_id = c.contractor_id
WHERE b.bid_amount = (
    SELECT MIN(b2.bid_amount)
    FROM bids b2
    WHERE b2.project_id = b.project_id
)
ORDER BY p.name;

-- Q11. Same thing using a CTE (WITH) — cleaner, more readable
WITH lowest AS (
    SELECT project_id, MIN(bid_amount) AS low_bid
    FROM bids
    GROUP BY project_id
)
SELECT p.name AS project, c.company_name AS winner, l.low_bid
FROM lowest l
JOIN projects    p ON l.project_id = p.project_id
JOIN bids        b ON b.project_id = l.project_id AND b.bid_amount = l.low_bid
JOIN contractors c ON b.contractor_id = c.contractor_id
ORDER BY l.low_bid DESC;

-- Q12. Contractors who have NEVER submitted a bid (subquery with NOT IN)
SELECT company_name, city
FROM contractors
WHERE contractor_id NOT IN (SELECT DISTINCT contractor_id FROM bids);

-- ============================================================
-- CASE statements (if/then logic) + cost analysis
-- ============================================================

-- Q13. Was the winning bid OVER or UNDER the project's budget?
WITH lowest AS (
    SELECT project_id, MIN(bid_amount) AS low_bid
    FROM bids GROUP BY project_id
)
SELECT
    p.name,
    p.budget,
    l.low_bid,
    (p.budget - l.low_bid) AS savings,
    CASE
        WHEN l.low_bid <= p.budget THEN 'Under budget'
        ELSE 'OVER budget'
    END AS budget_status
FROM projects p
JOIN lowest l ON p.project_id = l.project_id
ORDER BY savings DESC;

-- Q14. Categorize projects by size
SELECT name, budget,
    CASE
        WHEN budget >= 10000000 THEN 'Mega'
        WHEN budget >= 3000000  THEN 'Large'
        WHEN budget >= 1000000  THEN 'Medium'
        ELSE 'Small'
    END AS size_category
FROM projects
ORDER BY budget DESC;

-- ============================================================
-- MATERIALS: more JOINs + computed cost
-- ============================================================

-- Q15. Total material cost for each project (quantity x unit_cost)
SELECT
    p.name AS project,
    SUM(pm.quantity * m.unit_cost) AS total_material_cost
FROM project_materials pm
JOIN projects  p ON pm.project_id  = p.project_id
JOIN materials m ON pm.material_id = m.material_id
GROUP BY p.project_id
ORDER BY total_material_cost DESC;

-- Q16. Most-used material by total quantity across all projects
SELECT m.name, m.unit, SUM(pm.quantity) AS total_quantity
FROM project_materials pm
JOIN materials m ON pm.material_id = m.material_id
GROUP BY m.material_id
ORDER BY total_quantity DESC;

-- ============================================================
-- DATA VALIDATION / QUALITY CHECKS
-- (the JD literally says "data validation" — these are audits)
-- ============================================================

-- Q17. AUDIT: projects with a start_date but no end_date (incomplete data)
SELECT project_id, name, start_date, end_date
FROM projects
WHERE start_date IS NOT NULL AND end_date IS NULL;

-- Q18. AUDIT: any bid that is HIGHER than its project's budget (suspicious)
SELECT p.name, c.company_name, b.bid_amount, p.budget
FROM bids b
JOIN projects    p ON b.project_id = p.project_id
JOIN contractors c ON b.contractor_id = c.contractor_id
WHERE b.bid_amount > p.budget;

-- Q19. AUDIT: 'In Progress' or 'Complete' projects that never received a bid
SELECT p.name, p.status
FROM projects p
LEFT JOIN bids b ON p.project_id = b.project_id
WHERE b.bid_id IS NULL
  AND p.status IN ('In Progress','Complete');

-- Q20. MANAGEMENT SUMMARY: one-row dashboard snapshot
SELECT
    (SELECT COUNT(*) FROM projects)                          AS total_projects,
    (SELECT COUNT(*) FROM projects WHERE status='Bidding')   AS open_for_bidding,
    (SELECT COUNT(*) FROM contractors WHERE certified=1)     AS certified_contractors,
    (SELECT COUNT(*) FROM bids)                              AS total_bids,
    (SELECT ROUND(AVG(bid_amount),0) FROM bids)              AS avg_bid_amount;
