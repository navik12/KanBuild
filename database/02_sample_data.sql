-- ============================================================
-- KanBuild — FILE: 02_sample_data.sql
-- PURPOSE: Load realistic sample data to query against
-- SKILL DEMONSTRATED: SQL INSERT, data entry, referential integrity
-- ============================================================

PRAGMA foreign_keys = ON;

-- ---------- CONTRACTORS (10 companies) ----------
INSERT INTO contractors (contractor_id, company_name, city, state, certified, contact_email) VALUES
(1,  'Sunflower Paving Co.',      'Topeka',     'KS', 1, 'bids@sunflowerpaving.com'),
(2,  'Prairie Road Builders',     'Wichita',    'KS', 1, 'estimating@prairieroad.com'),
(3,  'Heartland Construction',    'Kansas City','KS', 1, 'office@heartlandcon.com'),
(4,  'Cornerstone Asphalt LLC',   'Lawrence',   'KS', 0, 'info@cornerstoneasphalt.com'),
(5,  'Midwest Bridge & Grade',    'Salina',     'KS', 1, 'bids@midwestbridge.com'),
(6,  'Flint Hills Excavating',    'Manhattan',  'KS', 1, 'contact@flinthillsexc.com'),
(7,  'Great Plains Paving',       'Hays',       'KS', 0, 'gp@greatplainspaving.com'),
(8,  'Liberty Civil Works',       'Olathe',     'KS', 1, 'bids@libertycivil.com'),
(9,  'Frontier Road Co.',         'Dodge City', 'KS', 1, 'frontier@frontierroad.com'),
(10, 'Capitol Infrastructure',    'Topeka',     'KS', 1, 'sales@capitolinfra.com');

-- ---------- PROJECTS (8 highway projects) ----------
INSERT INTO projects (project_id, name, county, budget, start_date, end_date, status) VALUES
(1, 'I-70 Resurfacing — Mile 350-365',   'Shawnee',  4200000, '2026-04-01', '2026-09-30', 'In Progress'),
(2, 'US-75 Bridge Replacement',          'Jackson',  6800000, '2026-05-15', '2027-01-15', 'Awarded'),
(3, 'K-10 Shoulder Widening',            'Douglas',  1500000, '2026-06-01', '2026-10-01', 'Bidding'),
(4, 'I-35 Interchange Upgrade',          'Johnson', 12500000, '2026-08-01', '2027-12-01', 'Bidding'),
(5, 'US-54 Pavement Repair',             'Sedgwick', 2300000, '2026-03-01', '2026-07-01', 'Complete'),
(6, 'K-18 Culvert Replacement',          'Riley',     850000, '2026-07-01', '2026-09-15', 'Planned'),
(7, 'I-135 Lane Addition',               'Saline',   9750000, NULL,         NULL,         'Planned'),
(8, 'US-50 Intersection Safety Project', 'Ford',     1750000, '2026-05-01', NULL,         'In Progress');
-- Note: project 8's end_date is intentionally left blank (NULL) so the
-- data-validation audit in 03_queries.sql (Q17) has something real to catch.

-- ---------- BIDS (contractors bidding on projects) ----------
INSERT INTO bids (bid_id, project_id, contractor_id, bid_amount, bid_date) VALUES
-- Project 1 (I-70) bids
(1, 1, 1, 4100000, '2026-02-10'),
(2, 1, 3, 4350000, '2026-02-11'),
(3, 1, 7, 3980000, '2026-02-12'),
-- Project 2 (US-75 Bridge) bids
(4, 2, 5, 6600000, '2026-03-20'),
(5, 2, 8, 6950000, '2026-03-21'),
(6, 2, 3, 6720000, '2026-03-22'),
-- Project 3 (K-10) bids — currently bidding
(7, 3, 4, 1480000, '2026-05-05'),
(8, 3, 1, 1525000, '2026-05-06'),
-- Project 4 (I-35) bids — currently bidding
(9,  4, 8, 12200000, '2026-06-15'),
(10, 4, 5, 12800000, '2026-06-16'),
(11, 4, 10, 11950000, '2026-06-17'),
-- Project 5 (US-54) — completed, was awarded
(12, 5, 2, 2250000, '2026-01-15'),
(13, 5, 7, 2400000, '2026-01-16'),
-- Project 8 (US-50) bids
(14, 8, 9, 1700000, '2026-03-10'),
(15, 8, 6, 1680000, '2026-03-11');

-- ---------- MATERIALS ----------
INSERT INTO materials (material_id, name, unit, unit_cost) VALUES
(1, 'Hot Mix Asphalt',     'ton',         85.00),
(2, 'Concrete',            'cubic yard',  145.00),
(3, 'Crushed Aggregate',   'ton',         22.50),
(4, 'Rebar (Steel)',       'ton',        950.00),
(5, 'Guardrail',           'linear foot', 32.00),
(6, 'Pavement Marking',    'linear foot',  1.75);

-- ---------- PROJECT_MATERIALS (what each project uses) ----------
INSERT INTO project_materials (project_id, material_id, quantity) VALUES
(1, 1, 18000),   (1, 3, 9000),  (1, 6, 52000),     -- I-70 resurfacing
(2, 2, 4200),    (2, 4, 320),   (2, 5, 1800),      -- US-75 bridge
(5, 1, 9500),    (5, 3, 4000),  (5, 6, 21000),     -- US-54 repair
(8, 1, 6500),    (8, 5, 2400),  (8, 6, 15000);     -- US-50 safety
