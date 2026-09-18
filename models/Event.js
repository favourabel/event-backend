const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: String,
    description: String,
    category: { type: String, default: 'Technology' },
    
    // Branding
    coverImage: String,
    themeColor: { type: String, default: '#2563eb' },
    
    // Date & Location
    date: { type: Date, required: true },
    endDate: Date,
    time: String,
    endTime: String,
    isVirtual: { type: Boolean, default: false },
    isHybrid: { type: Boolean, default: false },
    virtualLink: String,
    venue: String,
    address: String,
    city: String,
    state: String,

    // Rich Micro-Site Content
    agenda: [
      {
        time: String,
        title: String,
        description: String,
      },
    ],
    speakers: [
      {
        name: String,
        role: String,
        company: String,
        image: String,
      },
    ],
    sponsors: [
      {
        name: String,
        logo: String,
        tier: { type: String, default: 'Gold' },
      },
    ],

    // Multi-Tier Tickets
    tickets: [
      {
        name: { type: String, required: true }, // e.g. "Early Bird", "VIP"
        price: { type: Number, default: 0 },
        currency: { type: String, default: 'NGN' },
        quantity: { type: Number, default: 100 },
        description: String,
      },
    ],

    // Feature Toggles
    hasExam: { type: Boolean, default: false },
    hasCertificate: { type: Boolean, default: false },

    // Meta
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    organizerName: String,
    status: { type: String, enum: ['draft', 'published', 'ended'], default: 'published' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);