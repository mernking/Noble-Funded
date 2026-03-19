-- Seed admin users with password '123456'
-- Password hash generated with bcrypt, cost factor 12

INSERT INTO users (email, password_hash, full_name, role, status, email_verified, provider) 
VALUES 
  ('super_admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA8xCgxXzOa', 'Super Admin', 'super_admin', 'active', true, 'email'),
  ('compliance@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA8xCgxXzOa', 'Compliance Officer', 'compliance', 'active', true, 'email'),
  ('support@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA8xCgxXzOa', 'Support Agent', 'support', 'active', true, 'email'),
  ('marketing@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA8xCgxXzOa', 'Marketing Team', 'marketing', 'active', true, 'email'),
  ('developer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA8xCgxXzOa', 'Developer', 'developer', 'active', true, 'email')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  password_hash = EXCLUDED.password_hash,
  status = 'active',
  email_verified = true;
