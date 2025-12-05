# React Frontend cho NestJS PostgreSQL Backend

Đây là ứng dụng frontend được xây dựng với React và Vite cho hệ thống quản lý người dùng.

## Tính năng

### Xác thực (Authentication)
- **Đăng nhập**: Đăng nhập bằng email và mật khẩu
- **Đăng ký**: Tạo tài khoản mới với xác thực email
- **Xác thực email**: Nhập mã xác thực được gửi qua email
- **Quên mật khẩu**: Đặt lại mật khẩu thông qua email
- **Đổi mật khẩu**: Thay đổi mật khẩu với mã xác thực

### Quản lý người dùng (User Management)
- **Danh sách người dùng**: Xem tất cả người dùng với phân trang
- **Tìm kiếm**: Tìm kiếm người dùng theo tên, email
- **Thêm mới**: Tạo người dùng mới
- **Cập nhật**: Chỉnh sửa thông tin người dùng
- **Xóa**: Xóa người dùng khỏi hệ thống
- **Migrate Elasticsearch**: Đồng bộ dữ liệu với Elasticsearch

## Công nghệ sử dụng

- **React 19**: Framework JavaScript
- **Vite**: Build tool và dev server
- **React Router**: Routing
- **Ant Design**: Thư viện UI components
- **Axios**: HTTP client
- **Day.js**: Xử lý ngày tháng

## Cài đặt

### Yêu cầu
- Node.js v20.14.0 hoặc mới hơn
- Backend NestJS đang chạy trên http://localhost:8000

### Các bước cài đặt

1. **Di chuyển vào thư mục frontend**
```bash
cd frontend
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình môi trường**
   
   Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

   Cập nhật file `.env` nếu cần:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

4. **Chạy ứng dụng ở chế độ development**
```bash
npm run dev
```

   Ứng dụng sẽ chạy tại: http://localhost:5173

5. **Build cho production**
```bash
npm run build
```

6. **Preview bản build**
```bash
npm run preview
```

## Cấu trúc thư mục

```
frontend/
├── src/
│   ├── api/              # API services và axios config
│   │   ├── axios.js      # Axios instance với interceptors
│   │   └── services.js   # API endpoints
│   ├── components/       # Reusable components
│   │   └── ProtectedRoute.jsx
│   ├── config/           # Configuration files
│   │   └── api.js        # API configuration
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── UserManagement.jsx
│   ├── App.jsx           # Main app component với routes
│   └── main.jsx          # Entry point
├── .env                  # Environment variables
├── .env.example          # Environment variables template
└── package.json
```

## Sử dụng

### 1. Đăng ký tài khoản mới
- Truy cập trang đăng ký tại `/register`
- Điền thông tin: tên, email, mật khẩu
- Nhấn "Đăng ký"
- Kiểm tra email để lấy mã xác thực
- Nhập mã xác thực để kích hoạt tài khoản

### 2. Đăng nhập
- Truy cập trang đăng nhập tại `/login`
- Nhập email và mật khẩu
- Nhấn "Đăng nhập"

### 3. Quên mật khẩu
- Truy cập trang quên mật khẩu tại `/forgot-password`
- Nhập email
- Kiểm tra email để lấy mã xác thực
- Nhập mã xác thực và mật khẩu mới

### 4. Quản lý người dùng
- Sau khi đăng nhập, bạn sẽ được chuyển đến trang quản lý người dùng
- Sử dụng các chức năng:
  - **Tìm kiếm**: Nhập từ khóa và nhấn tìm kiếm
  - **Thêm mới**: Nhấn nút "Thêm mới"
  - **Sửa**: Nhấn nút "Sửa" trên mỗi dòng
  - **Xóa**: Nhấn nút "Xóa" và xác nhận
  - **Migrate ES**: Nhấn nút "Migrate ES" để đồng bộ với Elasticsearch

## API Backend

Frontend này kết nối với các API endpoints sau:

### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/check-code` - Xác thực mã
- `POST /auth/retry-active` - Gửi lại mã kích hoạt
- `POST /auth/retry-password` - Gửi mã đặt lại mật khẩu
- `POST /auth/change-password` - Đổi mật khẩu

### Users
- `GET /users` - Lấy danh sách người dùng
- `GET /users/search` - Tìm kiếm người dùng
- `GET /users/:id` - Lấy thông tin người dùng
- `POST /users` - Tạo người dùng mới
- `PATCH /users` - Cập nhật người dùng
- `DELETE /users/:id` - Xóa người dùng
- `POST /users/migrate-to-elasticsearch` - Migrate dữ liệu

## Lưu ý

- Đảm bảo backend đang chạy trước khi khởi động frontend
- Token được lưu trong localStorage
- CORS đã được cấu hình trong backend
- Mật khẩu phải có ít nhất 6 ký tự

## Tác giả

Website: https://hoidanit.vn/
