-- =================================================================
-- 用户表重构 - 添加邮箱密码登录功能
-- 创建时间: 2025-09-02
-- =================================================================

-- 添加新的字段到用户表
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS salt VARCHAR(255),
ADD COLUMN IF NOT EXISTS province VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS district VARCHAR(100),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'wechat' CHECK (auth_provider IN ('wechat', 'email', 'phone')),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);

-- 添加检查约束
ALTER TABLE users 
ADD CONSTRAINT IF NOT EXISTS chk_users_email_password CHECK (
  (email IS NULL AND password_hash IS NULL) OR 
  (email IS NOT NULL AND password_hash IS NOT NULL)
);

-- 更新现有记录的auth_provider
UPDATE users SET auth_provider = 'wechat' WHERE auth_provider IS NULL;

-- 添加用户登录日志表
CREATE TABLE IF NOT EXISTS user_login_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    login_type VARCHAR(50) NOT NULL CHECK (login_type IN ('wechat', 'email', 'phone')),
    ip_address INET,
    user_agent TEXT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_status VARCHAR(20) DEFAULT 'success' CHECK (login_status IN ('success', 'failed'))
);

-- 添加登录日志索引
CREATE INDEX IF NOT EXISTS idx_user_login_logs_user_id ON user_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_login_time ON user_login_logs(login_time);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_status ON user_login_logs(login_status);

-- 添加用户会话表
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 添加会话索引
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);

-- 更新updated_at触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 添加注释
COMMENT ON COLUMN users.email IS '用户邮箱地址，唯一';
COMMENT ON COLUMN users.password_hash IS '密码哈希值';
COMMENT ON COLUMN users.salt IS '密码加密盐值';
COMMENT ON COLUMN users.province IS '省份';
COMMENT ON COLUMN users.city IS '城市';
COMMENT ON COLUMN users.district IS '区县';
COMMENT ON COLUMN users.address IS '详细地址';
COMMENT ON COLUMN users.is_active IS '用户是否激活';
COMMENT ON COLUMN users.last_login_at IS '最后登录时间';
COMMENT ON COLUMN users.login_count IS '登录次数';
COMMENT ON COLUMN users.auth_provider IS '认证提供者';
COMMENT ON COLUMN users.email_verified IS '邮箱是否验证';
COMMENT ON COLUMN users.phone_verified IS '手机是否验证';

COMMENT ON TABLE user_login_logs IS '用户登录日志表';
COMMENT ON TABLE user_sessions IS '用户会话表';