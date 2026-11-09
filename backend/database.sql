-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS bank_portal;
USE bank_portal;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    internet_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    reward_points INT DEFAULT 0,
    investments DECIMAL(15, 2) DEFAULT 0.00,
    total_spends DECIMAL(15, 2) DEFAULT 0.00,
    credit_limit DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS `transactions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `transaction_id` VARCHAR(20) NOT NULL UNIQUE,
    `sender_id` INT NOT NULL,
    `receiver_account` VARCHAR(20) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `mode` VARCHAR(10) NOT NULL,
    `comments` TEXT,
    `status` VARCHAR(20) DEFAULT 'SUCCESS',
    `balance_after` DECIMAL(15, 2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`)
);

-- Insert dummy user (Password is 'password123')
-- The hash below is generated using password_hash('password123', PASSWORD_DEFAULT)
INSERT INTO users (internet_id, password, full_name, account_number, balance, reward_points, investments, total_spends, credit_limit)
VALUES (
    'aditya123', 
    '$2y$10$QIo68OmOsAkpl8RFYtY5hunWxz7Cy/CoMY0Y/LY263RDrIBml9o0G', 
    'Aditya Bahl', 
    '123456789012', 
    24500.75, 
    1250, 
    15000.00, 
    3200.50, 
    50000.00
) ON DUPLICATE KEY UPDATE internet_id=internet_id;