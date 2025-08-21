-- Insert CEO first (no department, no manager)
INSERT INTO employees (
    employee_code, first_name, last_name, email, position, 
    is_ceo, hire_date, salary, department_id, manager_id
) VALUES (
    'EMP001', 'John', 'Smith', 'john.smith@company.com', 'Chief Executive Officer',
    TRUE, '2020-01-01', 200000.00, NULL, NULL
);

-- Insert departments
INSERT INTO departments (name, description) VALUES 
('Engineering', 'Software Development and Technical Operations'),
('Marketing', 'Marketing and Brand Management'),
('Finance', 'Financial Planning and Accounting');

-- Insert department heads (they report to CEO)
INSERT INTO employees (
    employee_code, first_name, last_name, email, position, 
    department_id, manager_id, hire_date, salary
) VALUES 
('EMP002', 'Alice', 'Johnson', 'alice.johnson@company.com', 'Engineering Manager', 
 1, 1, '2020-02-01', 120000.00),
('EMP003', 'Bob', 'Wilson', 'bob.wilson@company.com', 'Marketing Manager', 
 2, 1, '2020-02-15', 110000.00),
('EMP004', 'Carol', 'Brown', 'carol.brown@company.com', 'Finance Manager', 
 3, 1, '2020-03-01', 115000.00);

-- Update departments to set department heads
UPDATE departments SET dept_head_id = 2 WHERE name = 'Engineering';
UPDATE departments SET dept_head_id = 3 WHERE name = 'Marketing';
UPDATE departments SET dept_head_id = 4 WHERE name = 'Finance';

-- Insert additional employees
INSERT INTO employees (
    employee_code, first_name, last_name, email, position, 
    department_id, manager_id, hire_date, salary
) VALUES 
('EMP005', 'David', 'Davis', 'david.davis@company.com', 'Senior Developer', 
 1, 2, '2020-04-01', 95000.00),
('EMP006', 'Emma', 'Wilson', 'emma.wilson@company.com', 'Marketing Specialist', 
 2, 3, '2020-05-01', 75000.00),
('EMP007', 'Frank', 'Miller', 'frank.miller@company.com', 'Financial Analyst', 
 3, 4, '2020-06-01', 70000.00),
('EMP008', 'Grace', 'Taylor', 'grace.taylor@company.com', 'Junior Developer', 
 1, 2, '2021-01-15', 65000.00);
