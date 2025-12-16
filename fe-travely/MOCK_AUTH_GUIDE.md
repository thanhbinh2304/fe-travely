# Mock Authentication Guide

## Cách đăng nhập Admin không cần Backend

### Bước 1: Bật Mock Mode
Mở file `.env.local` và đảm bảo:
```env
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### Bước 2: Restart Dev Server
Nếu server đang chạy, dừng lại và chạy lại:
```bash
npm run dev
```

### Bước 3: Đăng nhập với tài khoản Mock

#### Tài khoản Admin:
- **Username/Email**: `admin` hoặc `admin@travely.com`
- **Password**: `123456`
- **Role**: Admin (có quyền truy cập Dashboard)

#### Tài khoản User thường:
- **Username/Email**: `user` hoặc `user@travely.com`
- **Password**: `123456`
- **Role**: User (không có quyền truy cập Dashboard)

### Bước 4: Kiểm tra Console
Khi mở ứng dụng, bạn sẽ thấy log trong console:
```
🔐 Auth Mode: ⚡ MOCK (No Backend Required)
📝 Mock Admin Login: username="admin", password="123456"
📝 Mock User Login: username="user", password="123456"
```

### Chuyển về Real Backend
Khi muốn sử dụng backend thật, đổi trong `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

## Cách hoạt động

- Mock mode lưu token và user vào localStorage và cookie giống như backend thật
- Tất cả auth flow (login, logout, get profile) đều hoạt động bình thường
- Middleware và AdminProtection component vẫn kiểm tra role_id như bình thường
- Không cần thay đổi code logic, chỉ cần đổi config

## Thêm Mock Users

Mở file `src/app/services/mockAuthService.ts` và thêm user vào `MOCK_USERS`:
```typescript
const MOCK_USERS: User[] = [
    {
        userID: '1',
        userName: 'admin',
        email: 'admin@travely.com',
        role_id: 1, // Admin
    },
    {
        userID: '3',
        userName: 'newuser',
        email: 'newuser@travely.com',
        role_id: 2, // Normal user
    }
];
```

Password mặc định cho tất cả mock users là: `123456`
