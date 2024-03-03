-- Insert sample departments
INSERT INTO department (name) VALUES
('Engineering'),
('Marketing'),
('Sales');

-- Insert sample roles
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 80000, 1), -- Engineering department
('Marketing Manager', 70000, 2),  -- Marketing department
('Sales Representative', 60000, 3); -- Sales department

-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL), -- Software Engineer, no manager
('Jane', 'Smith', 2, 1),  -- Marketing Manager, managed by John Doe
('Mike', 'Johnson', 3, 1); -- Sales Representative, managed by John Doe