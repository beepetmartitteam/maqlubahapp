-- =====================================================
-- COMPANY MANAGEMENT TABLES RESTORE SCRIPT
-- =====================================================
-- Generated on: 2026-05-12
-- Database: maqlubah_db
-- Tables: companies, staff, plans, reports, tasks
-- Purpose: Restore data from backup tables
-- =====================================================

-- WARNING: This script will DELETE all existing data in the main tables
-- and restore from backup tables. Make sure you have recent backups!

-- SET FOREIGN_KEY_CHECKS=0 to avoid foreign key constraints during restore
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. CLEAR EXISTING DATA
-- =====================================================
-- Clear in correct order to respect foreign key dependencies
DELETE FROM task_dependencies;
DELETE FROM tasks;
DELETE FROM reports;
DELETE FROM plans;
DELETE FROM staff;
DELETE FROM companies;

-- =====================================================
-- 2. RESTORE DATA FROM BACKUP TABLES
-- =====================================================

-- Restore companies first (parent table)
INSERT INTO companies SELECT * FROM companies_backup;

-- Restore staff (depends on companies)
INSERT INTO staff SELECT * FROM staff_backup;

-- Restore plans (depends on companies)
INSERT INTO plans SELECT * FROM plans_backup;

-- Restore reports (depends on companies and staff)
INSERT INTO reports SELECT * FROM reports_backup;

-- Restore tasks (depends on companies and staff)
INSERT INTO tasks SELECT * FROM tasks_backup;

-- Restore task dependencies (depends on tasks)
INSERT INTO task_dependencies SELECT * FROM task_dependencies_backup;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- RESTORE VERIFICATION QUERIES
-- =====================================================
SELECT 'Companies Restored Count: ' || COUNT(*) as info FROM companies
UNION ALL
SELECT 'Staff Restored Count: ' || COUNT(*) as info FROM staff  
UNION ALL
SELECT 'Plans Restored Count: ' || COUNT(*) as info FROM plans
UNION ALL
SELECT 'Reports Restored Count: ' || COUNT(*) as info FROM reports
UNION ALL
SELECT 'Tasks Restored Count: ' || COUNT(*) as info FROM tasks
UNION ALL
SELECT 'Task Dependencies Restored Count: ' || COUNT(*) as info FROM task_dependencies;

-- =====================================================
-- RESTORE COMPLETION MESSAGE
-- =====================================================
SELECT 'Company Management Tables Restore Completed Successfully!' as message;
