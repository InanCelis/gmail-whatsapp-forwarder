-- Add role column to users table and create admin policies
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Set celisinan@gmail.com as admin
UPDATE users SET role = 'admin' WHERE email = 'celisinan@gmail.com';

-- Create RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own data
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);

-- Allow admins to view all users
CREATE POLICY "users_select_admin" ON users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to update user roles
CREATE POLICY "users_update_admin" ON users FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to delete users
CREATE POLICY "users_delete_admin" ON users FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
