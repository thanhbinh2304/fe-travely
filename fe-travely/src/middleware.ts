import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Kiểm tra nếu request đến dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Lấy token từ cookie hoặc header
    const token = request.cookies.get('access_token')?.value;
    
    // Nếu không có token, redirect về trang chủ
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // TODO: Có thể verify token với backend ở đây để check role
    // Nhưng sẽ tốn performance, nên chỉ check cơ bản ở middleware
    // Và check chi tiết hơn ở client component
  }

  return NextResponse.next();
}

// Cấu hình route cần áp dụng middleware
export const config = {
  matcher: '/dashboard/:path*',
};
