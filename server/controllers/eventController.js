const Event = require('../models/Event');
const responseHandler = require('../utils/responseHandler');

exports.getEvents = async (req, res, next) => {
  try {
    let query;

    if (req.query.categoryId) {
      query = Event.find({ category: req.query.categoryId });
    } else {
      query = Event.find();
    }

    const events = await query.populate({
      path: 'category',
      select: 'name description',
    });

    responseHandler(res, 200, 'Events retrieved successfully', events);
  } catch (err) {
    next(err);
  }
};


exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate({
      path: 'category',
      select: 'name description',
    });

    if (!event) {
      res.status(404);
      throw new Error(`Event not found with id of ${req.params.id}`);
    }

    responseHandler(res, 200, 'Event retrieved successfully', event);
  } catch (err) {
    next(err);
  }
};


exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    responseHandler(res, 201, 'Event created successfully', event);
  } catch (err) {
    next(err);
  }
};


exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error(`Event not found with id of ${req.params.id}`);
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    responseHandler(res, 200, 'Event updated successfully', event);
  } catch (err) {
    next(err);
  }
};


exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error(`Event not found with id of ${req.params.id}`);
    }

    await event.deleteOne();

    responseHandler(res, 200, 'Event deleted successfully', {});
  } catch (err) {
    next(err);
  }
};
