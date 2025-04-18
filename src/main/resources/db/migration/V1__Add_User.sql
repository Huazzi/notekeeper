--
-- 添加用户系统
--

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(50) NOT NULL UNIQUE,
                                     email VARCHAR(100) NOT NULL UNIQUE,
                                     password VARCHAR(255) NOT NULL,
                                     full_name VARCHAR(100),
                                     is_active BOOLEAN DEFAULT TRUE,
                                     role VARCHAR(20) DEFAULT 'ROLE_USER',
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     last_login_at TIMESTAMP,
                                     login_attempts INT DEFAULT 0,
                                     INDEX idx_username (username),
                                     INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入管理员用户（密码为：admin123）
INSERT INTO users (username, email, password, full_name, role) VALUES 
('admin', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBpwTTkat3i/vO', '系统管理员', 'ROLE_ADMIN');

-- 1. 先添加 user_id 列，但暂时允许为空
ALTER TABLE notes
    ADD COLUMN user_id BIGINT NULL AFTER id;

-- 2. 将现有便签关联到管理员用户
UPDATE notes SET user_id = (SELECT id FROM users WHERE username = 'admin');

-- 3. 添加外键约束和索引
ALTER TABLE notes
    MODIFY COLUMN user_id BIGINT NOT NULL,
    ADD CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    ADD INDEX idx_user_notes (user_id, is_pinned, updated_at);

-- 创建用户会话表
CREATE TABLE IF NOT EXISTS persistent_logins (
                                                 username VARCHAR(50) NOT NULL,
                                                 series VARCHAR(64) PRIMARY KEY,
                                                 token VARCHAR(64) NOT NULL,
                                                 last_used TIMESTAMP NOT NULL,
                                                 INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建密码重置令牌表
CREATE TABLE IF NOT EXISTS password_reset_tokens (
                                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                     user_id BIGINT NOT NULL,
                                                     token VARCHAR(100) NOT NULL,
                                                     expiry_date TIMESTAMP NOT NULL,
                                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                     CONSTRAINT fk_reset_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                                     INDEX idx_token (token),
                                                     INDEX idx_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
