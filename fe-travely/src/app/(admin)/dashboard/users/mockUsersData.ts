// Type definition cho User trong admin dashboard
export interface UserManagement {
    userID: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    role_id: number;
    roleName: string; // 'Admin', 'User', 'Tour Guide'
    status: 'active' | 'inactive' | 'banned';
    totalBookings: number;
    totalSpent: number;
    createdAt: string;
    lastLogin?: string;
    verified: boolean;
}

// Mock data cho user management
export const mockUsersData: UserManagement[] = [
    {
        userID: '1',
        userName: 'admin',
        email: 'admin@travely.com',
        phoneNumber: '0123456789',
        address: 'Hà Nội, Việt Nam',
        role_id: 1,
        roleName: 'Admin',
        status: 'active',
        totalBookings: 0,
        totalSpent: 0,
        createdAt: '2024-01-15T08:00:00Z',
        lastLogin: '2024-03-20T14:30:00Z',
        verified: true,
    },
    {
        userID: '2',
        userName: 'nguyenvana',
        email: 'nguyenvana@gmail.com',
        phoneNumber: '0987654321',
        address: 'TP. Hồ Chí Minh, Việt Nam',
        role_id: 2,
        roleName: 'User',
        status: 'active',
        totalBookings: 12,
        totalSpent: 45000000,
        createdAt: '2024-02-01T10:00:00Z',
        lastLogin: '2024-03-19T09:15:00Z',
        verified: true,
    },
    {
        userID: '3',
        userName: 'tranthib',
        email: 'tranthib@gmail.com',
        phoneNumber: '0901234567',
        address: 'Đà Nẵng, Việt Nam',
        role_id: 2,
        roleName: 'User',
        status: 'active',
        totalBookings: 8,
        totalSpent: 32000000,
        createdAt: '2024-02-10T11:30:00Z',
        lastLogin: '2024-03-18T16:45:00Z',
        verified: true,
    },
    {
        userID: '4',
        userName: 'lethic',
        email: 'lethic@yahoo.com',
        phoneNumber: '0912345678',
        address: 'Huế, Việt Nam',
        role_id: 2,
        roleName: 'User',
        status: 'inactive',
        totalBookings: 3,
        totalSpent: 8500000,
        createdAt: '2024-02-15T14:20:00Z',
        lastLogin: '2024-03-01T10:00:00Z',
        verified: false,
    },
    {
        userID: '5',
        userName: 'phamvand',
        email: 'phamvand@gmail.com',
        phoneNumber: '0923456789',
        address: 'Cần Thơ, Việt Nam',
        role_id: 3,
        roleName: 'Tour Guide',
        status: 'active',
        totalBookings: 45,
        totalSpent: 0,
        createdAt: '2024-01-20T09:00:00Z',
        lastLogin: '2024-03-20T08:30:00Z',
        verified: true,
    },
    {
        userID: '6',
        userName: 'hoangthie',
        email: 'hoangthie@gmail.com',
        phoneNumber: '0934567890',
        address: 'Nha Trang, Việt Nam',
        role_id: 2,
        roleName: 'User',
        status: 'banned',
        totalBookings: 2,
        totalSpent: 5000000,
        createdAt: '2024-03-01T15:00:00Z',
        lastLogin: '2024-03-10T12:00:00Z',
        verified: true,
    },
    {
        userID: '7',
        userName: 'vuthif',
        email: 'vuthif@gmail.com',
        phoneNumber: '0945678901',
        address: 'Hội An, Việt Nam',
        role_id: 2,
        roleName: 'User',
        status: 'active',
        totalBookings: 15,
        totalSpent: 52000000,
        createdAt: '2024-01-25T13:00:00Z',
        lastLogin: '2024-03-19T18:20:00Z',
        verified: true,
    },
    {
        userID: '8',
        userName: 'doanvang',
        email: 'doanvang@outlook.com',
        phoneNumber: '0956789012',
        address: 'Phú Quốc, Việt Nam',
        role_id: 2,
        roleName: 'User',
        status: 'active',
        totalBookings: 6,
        totalSpent: 18000000,
        createdAt: '2024-02-20T16:30:00Z',
        lastLogin: '2024-03-17T11:10:00Z',
        verified: true,
    },
];
