// Export tất cả API modules
export * from './tourApi';
export * from './authApi';
export * from './bookingApi';

// Import và re-export để dễ sử dụng
import { tourApi } from './tourApi';
import  authApi  from './authApi';
import { bookingApi } from './bookingApi';

export const api = {
    tours: tourApi,
    auth: authApi,
    bookings: bookingApi,
};

export default api;
