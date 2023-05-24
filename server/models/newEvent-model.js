const { Schema, model } = require('mongoose')

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  locationType: { type: String },
  coordinates: [Number],
  address: { type: String },
  date: { type: Date },
  category: { type: String },
});

// eventSchema.index({ location: '2dsphere' });

module.exports = model('Event', eventSchema);