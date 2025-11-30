import { cookies } from 'next/headers';

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API || 'http://localhost:8000/api';

export async function verifyAdminRole(): Promise<{
    isAdmin: boolean;
    user: any | null;
    error?: string;
}> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            return { isAdmin: false, user: null, error: 'No token found' };
        }

        // Gọi API để lấy thông tin user
        const response = await fetch(`${SERVER_API}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            cache: 'no-store', // Không cache để luôn lấy dữ liệu mới
        });

        if (!response.ok) {
            return { isAdmin: false, user: null, error: 'Invalid token' };
        }

        const data = await response.json();
        const user = data.data;

        // Kiểm tra role_id === 1 (admin)
        if (user.role_id !== 1) {
            return { isAdmin: false, user, error: 'Not an admin' };
        }

        return { isAdmin: true, user };
    } catch (error) {
        console.error('Admin verification error:', error);
        return { isAdmin: false, user: null, error: 'Verification failed' };
    }
}
