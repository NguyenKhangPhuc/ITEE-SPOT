-- Cấp quyền đọc cho người dùng đã đăng nhập:
GRANT SELECT ON projects_with_priority TO authenticated;

-- Nếu view này cho phép cả khách chưa đăng nhập xem (public API):
GRANT SELECT ON projects_with_priority TO anon;