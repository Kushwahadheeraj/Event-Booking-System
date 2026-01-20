const Booking = require('../models/Booking');
const Event = require('../models/Event');
const responseHandler = require('../utils/responseHandler');

exports.createBooking = async (req, res, next) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

   
    const existingBooking = await Booking.findOne({ user: userId, event: eventId });
    if (existingBooking) {
      res.status(400);
      throw new Error('You have already booked this event');
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -1 } },
      { new: true }
    );

    if (!event) {
      const eventExists = await Event.findById(eventId);
      if (!eventExists) {
        res.status(404);
        throw new Error('Event not found');
      } else {
        res.status(400);
        throw new Error('No seats available');
      }
    }

    try {
      const booking = await Booking.create({
        user: userId,
        event: eventId,
      });

      responseHandler(res, 201, 'Event booked successfully', booking);
    } catch (err) {
      await Event.findByIdAndUpdate(eventId, { $inc: { availableSeats: 1 } });
      throw err;
    }

  } catch (err) {
    next(err);
  }
};


exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate({
      path: 'event',
      populate: {
        path: 'category',
        select: 'name',
      },
    });

    responseHandler(res, 200, 'My bookings retrieved successfully', bookings);
  } catch (err) {
    next(err);
  }
};


exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('event', 'title date');
    responseHandler(res, 200, 'All bookings retrieved', bookings);
  } catch (err) {
    next(err);
  }
};
