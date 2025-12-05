# React Frontend - Hệ thống Quản lý Người dùng

Dự án này bao gồm:
- **Backend**: NestJS với PostgreSQL, Prisma, và Elasticsearch
- **Frontend**: React với Vite, Ant Design, và React Router

## Tổng quan

Đây là một hệ thống quản lý người dùng full-stack với các tính năng:
- Xác thực người dùng (đăng nhập, đăng ký, quên mật khẩu)
- Quản lý người dùng (CRUD operations)
- Tìm kiếm với Elasticsearch
- Xác thực email với mã code
- JWT authentication

## Yêu cầu hệ thống

- Node.js v20.14.0 hoặc mới hơn
- PostgreSQL
- Elasticsearch (tùy chọn, cho tính năng tìm kiếm)

## Cài đặt

### 1. Backend (NestJS)

```bash
# Cài đặt dependencies
npm install

# Cấu hình môi trường
cp .env.example .env
# Cập nhật các biến môi trường trong file .env

# Chạy migrations
npx prisma migrate dev

# Khởi động backend
npm run dev
```

Backend sẽ chạy tại: http://localhost:8000/api/v1
Swagger Docs: http://localhost:8000/api/docs

### 2. Frontend (React)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Cấu hình môi trường
cp .env.example .env
# Cập nhật VITE_API_BASE_URL nếu cần

# Khởi động frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## Cấu trúc dự án

```
nest-postgresql/
├── backend (root)
│   ├── src/
│   │   ├── auth/              # Xác thực
│   │   ├── modules/users/     # Quản lý người dùng
│   │   ├── prisma/            # Prisma service
│   │   └── ...
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/               # API services
    │   ├── components/        # React components
    │   ├── contexts/          # React contexts
    │   ├── pages/             # Page components
    │   └── ...
    └── package.json
```

## Tính năng chính

### Backend APIs

#### Authentication
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/check-code` - Xác thực mã
- `POST /api/v1/auth/retry-active` - Gửi lại mã kích hoạt
- `POST /api/v1/auth/retry-password` - Gửi mã đặt lại mật khẩu
- `POST /api/v1/auth/change-password` - Đổi mật khẩu

#### Users
- `GET /api/v1/users` - Lấy danh sách người dùng (có phân trang)
- `GET /api/v1/users/search` - Tìm kiếm với Elasticsearch
- `GET /api/v1/users/:id` - Lấy thông tin người dùng
- `POST /api/v1/users` - Tạo người dùng mới
- `PATCH /api/v1/users` - Cập nhật người dùng
- `DELETE /api/v1/users/:id` - Xóa người dùng
- `POST /api/v1/users/migrate-to-elasticsearch` - Migrate dữ liệu

### Frontend Pages

- **/login** - Trang đăng nhập
- **/register** - Trang đăng ký (2 bước: thông tin + xác thực email)
- **/forgot-password** - Trang quên mật khẩu (2 bước: email + đặt lại mật khẩu)
- **/** - Trang quản lý người dùng (protected route)

## Scripts

### Backend
```bash
npm run dev        # Chạy development mode
npm run build      # Build production
npm run start:prod # Chạy production
npm run lint       # Lint code
npm run test       # Run tests
```

### Frontend
```bash
npm run dev        # Chạy development mode
npm run build      # Build production
npm run preview    # Preview production build
npm run lint       # Lint code
```

## Biến môi trường

### Backend (.env)
```
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
JWT_ACCESS_TOKEN_EXPIRED=1d
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Công nghệ sử dụng

### Backend
- NestJS 10
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Elasticsearch
- Nodemailer
- Swagger/OpenAPI

### Frontend
- React 19
- Vite
- React Router 6
- Ant Design
- Axios
- Day.js

## Hướng dẫn sử dụng

1. **Đăng ký tài khoản**:
   - Truy cập `/register`
   - Điền thông tin và nhấn "Đăng ký"
   - Kiểm tra email để lấy mã xác thực
   - Nhập mã để kích hoạt tài khoản

2. **Đăng nhập**:
   - Truy cập `/login`
   - Nhập email và mật khẩu
   - Đăng nhập thành công sẽ chuyển đến trang quản lý

3. **Quản lý người dùng**:
   - Xem danh sách người dùng với phân trang
   - Tìm kiếm người dùng
   - Thêm/Sửa/Xóa người dùng
   - Migrate dữ liệu sang Elasticsearch

## Tác giả

**Hỏi Dân IT (Eric)**
- Website: https://hoidanit.vn/
- Youtube: https://www.youtube.com/@hoidanit
- Tiktok: https://www.tiktok.com/@hoidanit
- Facebook: https://www.facebook.com/askITwithERIC/

## License

UNLICENSED
