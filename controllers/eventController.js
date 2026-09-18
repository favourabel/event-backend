const Event = require('../models/Event');

// 1. GET ALL EVENTS (Shows all created organizer events)
exports.getAll = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // ✅ Allow all events to show, or filter by status only if explicitly passed
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch all events sorted by newest first
    const events = await Event.find(query).sort('-createdAt');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getByOrganizer = async (req, res) => {
  try {
    // Support searching by either organizerId or organizer
    const events = await Event.find({
      $or: [
        { organizerId: req.params.organizerId },
        { organizer: req.params.organizerId },
      ],
    }).sort('-createdAt');

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. CREATE EVENT (Updated to support Wizard arrays & generate slug)
exports.create = async (req, res) => {
  try {
    // Auto-generate a URL-friendly slug to prevent MongoDB duplicate key crash
    const baseSlug = (req.body.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const generatedSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const eventData = {
      ...req.body,
      slug: req.body.slug || generatedSlug,
      organizerId: req.user._id || req.user.id,
      organizerName: req.user.organization || req.user.name,
      status: req.body.status || 'published', // ✅ Defaults to 'published' so it shows everywhere
      
      // ✅ Safely handle the arrays sent from the new Frontend Wizard
      agenda: req.body.agenda || [],
      speakers: req.body.speakers || [],
      sponsors: req.body.sponsors || [],
      tickets: req.body.tickets && req.body.tickets.length > 0 
        ? req.body.tickets 
        : [{ name: 'General Admission', price: 0, quantity: 100 }],
    };

    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};