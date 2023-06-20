const { Schema, model } = require('mongoose')

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  locationType: { type: String },
  coordinates: [Number],
  address: { type: String },
  date: { type: Date },
  category: { type: String },
  users:[String],
  userCreatedEvent: {type: String },
  rating: [Number],
  feedbackUser: [{
    user: { type: String },
    feedback: { type: String }
  }]
});

module.exports = model('Event', eventSchema);
