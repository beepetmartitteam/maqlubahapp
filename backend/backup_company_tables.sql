-- =====================================================
-- COMPANY MANAGEMENT TABLES BACKUP SCRIPT
-- =====================================================
-- Generated on: 2026-05-12
-- Database: maqlubah_db
-- Tables: companies, staff, plans, reports, tasks
-- =====================================================

-- SET FOREIGN_KEY_CHECKS=0 to avoid foreign key constraints during backup
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. COMPANIES TABLE BACKUP
-- =====================================================
CREATE TABLE IF NOT EXISTS companies_backup LIKE companies;
INSERT INTO companies_backup SELECT * FROM companies;

-- =====================================================
-- 2. STAFF TABLE BACKUP  
-- =====================================================
CREATE TABLE IF NOT EXISTS staff_backup LIKE staff;
INSERT INTO staff_backup SELECT * FROM staff;

-- =====================================================
-- 3. PLANS TABLE BACKUP
-- =====================================================
CREATE TABLE IF NOT EXISTS plans_backup LIKE plans;
INSERT INTO plans_backup SELECT * FROM plans;

-- =====================================================
-- 4. REPORTS TABLE BACKUP
-- =====================================================
CREATE TABLE IF NOT EXISTS reports_backup LIKE reports;
INSERT INTO reports_backup SELECT * FROM reports;

-- =====================================================
-- 5. TASKS TABLE BACKUP
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks_backup LIKE tasks;
INSERT INTO tasks_backup SELECT * FROM tasks;

-- =====================================================
-- 6. TASK_DEPENDENCIES TABLE BACKUP (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS task_dependencies_backup LIKE task_dependencies;
INSERT INTO task_dependencies_backup SELECT * FROM task_dependencies;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- BACKUP VERIFICATION QUERIES
-- =====================================================
SELECT 'Companies Backup Count: ' || COUNT(*) as info FROM companies_backup
UNION ALL
SELECT 'Staff Backup Count: ' || COUNT(*) as info FROM staff_backup  
UNION ALL
SELECT 'Plans Backup Count: ' || COUNT(*) as info FROM plans_backup
UNION ALL
SELECT 'Reports Backup Count: ' || COUNT(*) as info FROM reports_backup
UNION ALL
SELECT 'Tasks Backup Count: ' || COUNT(*) as info FROM tasks_backup
UNION ALL
SELECT 'Task Dependencies Backup Count: ' || COUNT(*) as info FROM task_dependencies_backup;

-- =====================================================
-- BACKUP COMPLETION MESSAGE
-- =====================================================
SELECT 'Company Management Tables Backup Completed Successfully!' as message;
