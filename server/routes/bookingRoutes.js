const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); 

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/', authorize('admin'), getAllBookings);

module.exports = router;
