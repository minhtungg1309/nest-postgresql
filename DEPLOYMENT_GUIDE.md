# Hướng dẫn triển khai Full-stack: NestJS Backend + React Frontend

## Tổng quan

Dự án này là một hệ thống quản lý người dùng full-stack với:
- **Backend**: NestJS + PostgreSQL + Prisma + Elasticsearch
- **Frontend**: React + Vite + Ant Design

## Kiến trúc hệ thống

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │  HTTP   │                 │  Prisma │                 │
│  React Frontend ├────────►│  NestJS Backend ├────────►│   PostgreSQL    │
│  (Port 5173)    │         │  (Port 8000)    │         │                 │
│                 │         │                 │         │                 │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     │ Index
                                     ▼
                            ┌─────────────────┐
                            │                 │
                            │  Elasticsearch  │
                            │                 │
                            └─────────────────┘
```

## Cài đặt từ đầu

### Bước 1: Clone repository

```bash
git clone https://github.com/minhtungg1309/nest-postgresql.git
cd nest-postgresql
```

### Bước 2: Cài đặt Backend

```bash
# Cài đặt dependencies
npm install

# Cấu hình database
cp .env.example .env
# Sửa file .env với thông tin PostgreSQL của bạn:
# DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
# PORT=8000
# JWT_SECRET=your-secret-key
# JWT_ACCESS_TOKEN_EXPIRED=1d

# Chạy migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Khởi động backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:8000/api/v1`

### Bước 3: Cài đặt Frontend

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Cấu hình (file .env đã được tạo sẵn)
# VITE_API_BASE_URL=http://localhost:8000/api/v1

# Khởi động frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## Sử dụng hệ thống

### 1. Đăng ký tài khoản

1. Truy cập: `http://localhost:5173/register`
2. Điền thông tin:
   - Họ và tên
   - Email
   - Mật khẩu (tối thiểu 6 ký tự)
   - Xác nhận mật khẩu
3. Click "Đăng ký"
4. Kiểm tra email để lấy mã xác thực
5. Nhập mã xác thực để kích hoạt tài khoản

### 2. Đăng nhập

1. Truy cập: `http://localhost:5173/login`
2. Nhập email và mật khẩu
3. Click "Đăng nhập"
4. Hệ thống sẽ chuyển đến trang quản lý người dùng

### 3. Quên mật khẩu

1. Truy cập: `http://localhost:5173/forgot-password`
2. Nhập email
3. Kiểm tra email để lấy mã xác thực
4. Nhập mã và mật khẩu mới
5. Đăng nhập với mật khẩu mới

### 4. Quản lý người dùng

Sau khi đăng nhập, bạn có thể:

- **Xem danh sách**: Tất cả người dùng với phân trang
- **Tìm kiếm**: Nhập từ khóa và click tìm kiếm
- **Thêm mới**: Click "Thêm mới" và điền form
- **Sửa**: Click nút "Sửa" trên mỗi dòng
- **Xóa**: Click nút "Xóa" và xác nhận
- **Migrate ES**: Đồng bộ dữ liệu sang Elasticsearch

## API Documentation

Backend cung cấp Swagger UI tại: `http://localhost:8000/api/docs`

### Các endpoint chính:

#### Authentication
```
POST   /api/v1/auth/login              - Đăng nhập
POST   /api/v1/auth/register           - Đăng ký
POST   /api/v1/auth/check-code         - Xác thực mã
POST   /api/v1/auth/retry-active       - Gửi lại mã kích hoạt
POST   /api/v1/auth/retry-password     - Gửi mã reset password
POST   /api/v1/auth/change-password    - Đổi mật khẩu
```

#### Users
```
GET    /api/v1/users                   - Danh sách người dùng
GET    /api/v1/users/search            - Tìm kiếm (Elasticsearch)
GET    /api/v1/users/:id               - Chi tiết người dùng
POST   /api/v1/users                   - Tạo người dùng
PATCH  /api/v1/users                   - Cập nhật người dùng
DELETE /api/v1/users/:id               - Xóa người dùng
POST   /api/v1/users/migrate-to-elasticsearch - Migrate dữ liệu
```

## Cấu trúc Database (Prisma Schema)

```prisma
model User {
  id          String    @id @default(uuid())
  name        String
  email       String    @unique
  password    String
  phone       String?
  address     String?
  image       String?
  role        String    @default("USERS")
  accountType String    @default("LOCAL")
  isActive    Boolean   @default(false)
  codeId      String?
  codeExpired DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Xử lý lỗi thường gặp

### Backend không chạy được

```bash
# Kiểm tra PostgreSQL đã chạy chưa
# Kiểm tra DATABASE_URL trong .env
# Chạy lại migrations
npx prisma migrate dev
```

### Frontend không kết nối được backend

```bash
# Kiểm tra backend đã chạy chưa
# Kiểm tra VITE_API_BASE_URL trong frontend/.env
# Kiểm tra CORS trong backend (đã được cấu hình sẵn)
```

### Lỗi CORS

Backend đã được cấu hình CORS trong `src/main.ts`:
```typescript
app.enableCors({
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
});
```

## Build cho Production

### Backend

```bash
# Build
npm run build

# Chạy production
npm run start:prod
```

### Frontend

```bash
cd frontend

# Build
npm run build

# Preview
npm run preview

# Deploy: upload thư mục dist/ lên server
```

## Elasticsearch (Tùy chọn)

Nếu muốn sử dụng tính năng tìm kiếm Elasticsearch:

1. Cài đặt Elasticsearch
2. Cập nhật cấu hình trong backend
3. Sử dụng endpoint `/api/v1/users/search`
4. Migrate dữ liệu với nút "Migrate ES"

## Scripts hữu ích

### Backend
```bash
npm run dev          # Development mode
npm run build        # Build production
npm run start:prod   # Run production
npm run lint         # Lint code
npm run test         # Run tests
```

### Frontend
```bash
npm run dev          # Development mode
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Lint code
```

## Bảo mật

- JWT tokens được lưu trong localStorage
- Passwords được hash với bcrypt
- Email verification bắt buộc
- Protected routes cho các trang yêu cầu authentication
- CORS được cấu hình đúng

## Tính năng nổi bật

✅ Full authentication flow với email verification
✅ JWT-based authentication
✅ Password reset functionality
✅ User CRUD operations
✅ Elasticsearch integration
✅ Pagination support
✅ Form validation
✅ Responsive UI với Ant Design
✅ Vietnamese language support
✅ Professional gradient design

## Liên hệ & Hỗ trợ

**Tác giả**: Hỏi Dân IT (Eric)
- Website: https://hoidanit.vn/
- Youtube: https://www.youtube.com/@hoidanit

## License

UNLICENSED - For educational purposes
