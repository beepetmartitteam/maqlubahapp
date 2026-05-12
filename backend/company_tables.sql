-- Company Management Database Schema
-- Generated for Company Management System

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    employees INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    growth DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
    color VARCHAR(7) NOT NULL DEFAULT '#1976d2',
    ceo VARCHAR(255) NOT NULL,
    logo VARCHAR(255),
    description TEXT,
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    founded_date DATE,
    registration_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_growth CHECK (growth >= -100 AND growth <= 1000),
    CONSTRAINT chk_employees CHECK (employees >= 0),
    CONSTRAINT chk_revenue CHECK (revenue >= 0),
    CONSTRAINT chk_color CHECK (color REGEXP '^#[0-9A-Fa-f]{6}$')
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    department VARCHAR(255),
    hire_date DATE,
    salary DECIMAL(10,2),
    status ENUM('active', 'inactive', 'on_leave', 'terminated') NOT NULL DEFAULT 'active',
    avatar VARCHAR(255),
    address TEXT,
    emergency_contact VARCHAR(255),
    skills JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_staff_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_salary CHECK (salary >= 0)
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    company_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('planning', 'in-progress', 'completed', 'cancelled', 'on-hold') NOT NULL DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
    deadline DATE,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    actual_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    progress INTEGER NOT NULL DEFAULT 0,
    assigned_to INTEGER,
    tags JSON,
    attachments JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_plan_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_plan_assigned FOREIGN KEY (assigned_to) REFERENCES staff(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_progress CHECK (progress >= 0 AND progress <= 100),
    CONSTRAINT chk_budget CHECK (budget >= 0),
    CONSTRAINT chk_actual_cost CHECK (actual_cost >= 0)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    company_id INTEGER NOT NULL,
    staff_id INTEGER,
    title VARCHAR(255) NOT NULL,
    type ENUM('financial', 'performance', 'project', 'operational', 'compliance') NOT NULL DEFAULT 'performance',
    description TEXT,
    content JSON,
    period VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status ENUM('draft', 'submitted', 'reviewed', 'approved', 'rejected') NOT NULL DEFAULT 'draft',
    priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
    metrics JSON,
    attachments JSON,
    reviewed_by INTEGER,
    reviewed_at TIMESTAMP NULL,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_report_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_report_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_report_reviewer FOREIGN KEY (reviewed_by) REFERENCES staff(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tasks table (for plan sub-tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    plan_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('todo', 'in-progress', 'completed', 'cancelled', 'blocked') NOT NULL DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
    assigned_to INTEGER,
    due_date DATE,
    estimated_hours DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    actual_hours DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    progress INTEGER NOT NULL DEFAULT 0,
    tags JSON,
    attachments JSON,
    dependencies JSON,
    notes TEXT,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_task_plan FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_task_assigned FOREIGN KEY (assigned_to) REFERENCES staff(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_task_progress CHECK (progress >= 0 AND progress <= 100),
    CONSTRAINT chk_estimated_hours CHECK (estimated_hours >= 0),
    CONSTRAINT chk_actual_hours CHECK (actual_hours >= 0)
);

-- Task dependencies junction table
CREATE TABLE IF NOT EXISTS task_dependencies (
    task_id INTEGER NOT NULL,
    dependency_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (task_id, dependency_id),
    CONSTRAINT fk_task_dep_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_task_dep_dependency FOREIGN KEY (dependency_id) REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_no_self_dependency CHECK (task_id != dependency_id)
);

-- Indexes for better performance
CREATE INDEX idx_staff_company ON staff(company_id);
CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_plan_company ON plans(company_id);
CREATE INDEX idx_plan_status ON plans(status);
CREATE INDEX idx_plan_deadline ON plans(deadline);
CREATE INDEX idx_report_company ON reports(company_id);
CREATE INDEX idx_report_status ON reports(status);
CREATE INDEX idx_task_plan ON tasks(plan_id);
CREATE INDEX idx_task_status ON tasks(status);
CREATE INDEX idx_task_due_date ON tasks(due_date);
