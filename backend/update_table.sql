ALTER TABLE members
ADD COLUMN user_id INT NULL; 
ALTER TABLE users
ADD COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user';
ALTER TABLE members
CHANGE COLUMN userId user_id INT NOT NULL;