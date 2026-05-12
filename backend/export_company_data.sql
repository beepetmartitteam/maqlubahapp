-- =====================================================
-- COMPANY MANAGEMENT DATA EXPORT SCRIPT
-- =====================================================
-- Generated on: 2026-05-12
-- Database: maqlubah_db
-- Purpose: Export all company-related data with relationships
-- =====================================================

-- Export companies with their staff and plans
SELECT 
    c.id as company_id,
    c.name as company_name,
    c.industry,
    c.employees,
    c.revenue,
    c.growth,
    c.status,
    c.color,
    c.ceo,
    c.logo,
    c.description,
    c.website,
    c.email,
    c.phone,
    c.address,
    c.foundedDate,
    c.registrationNumber,
    c.created_at as company_created_at,
    c.updated_at as company_updated_at,
    -- Staff information as JSON
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', s.id,
                'name', s.name,
                'position', s.position,
                'email', s.email,
                'phone', s.phone,
                'department', s.department,
                'status', s.status,
                'hireDate', s.hireDate,
                'salary', s.salary,
                'avatar', s.avatar,
                'address', s.address,
                'emergencyContact', s.emergencyContact,
                'skills', s.skills,
                'created_at', s.created_at,
                'updated_at', s.updated_at
            )
        )
        FROM staff s WHERE s.company_id = c.id
    ) as staff_data,
    -- Plans information as JSON
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', p.id,
                'title', p.title,
                'description', p.description,
                'status', p.status,
                'priority', p.priority,
                'deadline', p.deadline,
                'assigned_to', p.assigned_to,
                'created_at', p.created_at,
                'updated_at', p.updated_at
            )
        )
        FROM plans p WHERE p.company_id = c.id
    ) as plans_data,
    -- Reports information as JSON
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', r.id,
                'title', r.title,
                'type', r.type,
                'status', r.status,
                'priority', r.priority,
                'start_date', r.start_date,
                'end_date', r.end_date,
                'staff_id', r.staff_id,
                'reviewed_by', r.reviewed_by,
                'metrics', r.metrics,
                'attachments', r.attachments,
                'created_at', r.created_at,
                'updated_at', r.updated_at
            )
        )
        FROM reports r WHERE r.company_id = c.id
    ) as reports_data,
    -- Tasks information as JSON
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', t.id,
                'title', t.title,
                'description', t.description,
                'status', t.status,
                'priority', t.priority,
                'assigned_to', t.assigned_to,
                'plan_id', t.plan_id,
                'start_date', t.start_date,
                'end_date', t.end_date,
                'taskDependencies', t.taskDependencies,
                'created_at', t.created_at,
                'updated_at', t.updated_at
            )
        )
        FROM tasks t WHERE t.company_id = c.id
    ) as tasks_data
FROM companies c
ORDER BY c.id;

-- =====================================================
-- INDIVIDUAL TABLE EXPORTS
-- =====================================================

-- Companies table export
SELECT '=== COMPANIES TABLE ===' as section;
SELECT * FROM companies ORDER BY id;

-- Staff table export with company names
SELECT '=== STAFF TABLE ===' as section;
SELECT 
    s.*,
    c.name as company_name
FROM staff s
LEFT JOIN companies c ON s.company_id = c.id
ORDER BY s.company_id, s.id;

-- Plans table export with company names
SELECT '=== PLANS TABLE ===' as section;
SELECT 
    p.*,
    c.name as company_name
FROM plans p
LEFT JOIN companies c ON p.company_id = c.id
ORDER BY p.company_id, p.id;

-- Reports table export with company and staff names
SELECT '=== REPORTS TABLE ===' as section;
SELECT 
    r.*,
    c.name as company_name,
    st.name as staff_name,
    reviewer.name as reviewer_name
FROM reports r
LEFT JOIN companies c ON r.company_id = c.id
LEFT JOIN staff st ON r.staff_id = st.id
LEFT JOIN staff reviewer ON r.reviewed_by = reviewer.id
ORDER BY r.company_id, r.id;

-- Tasks table export with company names
SELECT '=== TASKS TABLE ===' as section;
SELECT 
    t.*,
    c.name as company_name
FROM tasks t
LEFT JOIN companies c ON t.company_id = c.id
ORDER BY t.company_id, t.id;

-- Task dependencies export
SELECT '=== TASK DEPENDENCIES TABLE ===' as section;
SELECT 
    td.*,
    t1.title as task_title,
    t2.title as dependency_title
FROM task_dependencies td
LEFT JOIN tasks t1 ON td.task_id = t1.id
LEFT JOIN tasks t2 ON td.dependency_id = t2.id
ORDER BY td.task_id, td.dependency_id;
