-- =====================================================
-- COMPANY MANAGEMENT TABLE SCHEMAS
-- =====================================================
-- Generated on: 2026-05-12
-- Database: maqlubah_db
-- Purpose: Complete table structures for company management
-- =====================================================

-- =====================================================
-- 1. COMPANIES TABLE SCHEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `employees` int DEFAULT NULL,
  `revenue` decimal(15,2) DEFAULT NULL,
  `growth` decimal(5,2) DEFAULT NULL,
  `status` enum('active','inactive','pending','suspended') DEFAULT 'active',
  `color` varchar(7) DEFAULT NULL,
  `ceo` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text,
  `website` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text,
  `foundedDate` date DEFAULT NULL,
  `registrationNumber` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `idx_industry` (`industry`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. STAFF TABLE SCHEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','on_leave','terminated') DEFAULT 'active',
  `hireDate` date DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `address` text,
  `emergencyContact` varchar(255) DEFAULT NULL,
  `skills` json DEFAULT NULL,
  `company_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_name` (`name`),
  KEY `idx_status` (`status`),
  KEY `idx_department` (`department`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. PLANS TABLE SCHEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS `plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('planning','in-progress','completed','cancelled','on_hold') DEFAULT 'planning',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `deadline` date DEFAULT NULL,
  `assigned_to` int DEFAULT NULL,
  `company_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_deadline` (`deadline`),
  KEY `idx_assigned_to` (`assigned_to`),
  CONSTRAINT `plans_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `plans_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. REPORTS TABLE SCHEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `status` enum('draft','submitted','reviewed','approved','rejected') DEFAULT 'draft',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `staff_id` int DEFAULT NULL,
  `reviewed_by` int DEFAULT NULL,
  `metrics` json DEFAULT NULL,
  `attachments` json DEFAULT NULL,
  `company_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_staff_id` (`staff_id`),
  KEY `idx_reviewed_by` (`reviewed_by`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`reviewed_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. TASKS TABLE SCHEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('todo','in-progress','completed','cancelled') DEFAULT 'todo',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `assigned_to` int DEFAULT NULL,
  `plan_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `taskDependencies` json DEFAULT NULL,
  `company_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_assigned_to` (`assigned_to`),
  KEY `idx_plan_id` (`plan_id`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `staff` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. TASK_DEPENDENCIES JUNCTION TABLE SCHEMA
-- =====================================================
CREATE TABLE IF NOT EXISTS `task_dependencies` (
  `task_id` int NOT NULL,
  `dependency_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`,`dependency_id`),
  KEY `fk_task_dependency` (`dependency_id`),
  CONSTRAINT `fk_task_dependencies_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_task_dependency` FOREIGN KEY (`dependency_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE RELATIONSHIPS SUMMARY
-- =====================================================
SELECT 'Table Relationships:' as info
UNION ALL
SELECT 'companies (1) -> staff (many)' as info
UNION ALL
SELECT 'companies (1) -> plans (many)' as info  
UNION ALL
SELECT 'companies (1) -> reports (many)' as info
UNION ALL
SELECT 'companies (1) -> tasks (many)' as info
UNION ALL
SELECT 'staff (1) -> plans (many)' as info
UNION ALL
SELECT 'staff (1) -> reports (many, as creator)' as info
UNION ALL
SELECT 'staff (1) -> reports (many, as reviewer)' as info
UNION ALL
SELECT 'staff (1) -> tasks (many)' as info
UNION ALL
SELECT 'plans (1) -> tasks (many)' as info
UNION ALL
SELECT 'tasks (many) -> task_dependencies (many)' as info;
