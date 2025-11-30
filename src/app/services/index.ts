// Export tất cả API modules
export * from './tourService';
export * from './bookingApi';

// Import và re-export để dễ sử dụng
import  {tourService } from './tourService';
import authService from './authServiceProvider'; // Sử dụng provider để auto switch giữa mock và real
import { bookingApi } from './bookingApi';

export const api = {
    tours: tourService,
    auth: authService,
    bookings: bookingApi,
};

export default api;
