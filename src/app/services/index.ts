// Export tất cả API modules
export * from './tourService';
export * from './bookingService';

// Import và re-export để dễ sử dụng
import { tourService } from './tourService';
import authService from './authServiceProvider'; // Sử dụng provider để auto switch giữa mock và real

import { bookingService } from './bookingService';

export const api = {
    tours: tourService,
    auth: authService,
    bookings: bookingService,
};

export default api;
