// Export tất cả API modules
export * from './tourService';
export * from './authService';
export * from './bookingApi';

// Import và re-export để dễ sử dụng
import  {tourService } from './tourService';
import authService from './authService';
import { bookingApi } from './bookingApi';

export const api = {
    tours: tourService,
    auth: authService,
    bookings: bookingApi,
};

export default api;
