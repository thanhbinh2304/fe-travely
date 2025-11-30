import realAuthService from './authService';
import mockAuthService from './mockAuthService';

// Cấu hình: đặt USE_MOCK_AUTH = true để dùng mock mode (không cần backend)
// Đặt USE_MOCK_AUTH = false để dùng real backend
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

// Export service dựa theo config
const authServiceInstance = USE_MOCK_AUTH ? mockAuthService : realAuthService;

// Log để biết đang dùng mode nào
if (typeof window !== 'undefined') {
    console.log(`🔐 Auth Mode: ${USE_MOCK_AUTH ? '⚡ MOCK (No Backend Required)' : '🌐 REAL BACKEND'}`);
    if (USE_MOCK_AUTH) {
        console.log('📝 Mock Admin Login: username="admin", password="123456"');
        console.log('📝 Mock User Login: username="user", password="123456"');
    }
}

export default authServiceInstance;
