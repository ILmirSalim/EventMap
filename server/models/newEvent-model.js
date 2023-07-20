const { Schema, model } = require('mongoose')

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  locationType: { type: String },
  // location: {type:['Point']},
  location: {
    type: {
      type: String, 
      enum: ['Point'],
      
    },
    coordinates: {
      type: [Number],
      
    }
  },
  // coordinates: [Number],
  address: { type: String },
  day: { type: Date },
  time: { type: String },
  category: { type: String },
  users: [String],
  userCreatedEvent: { type: String },
  rating: [Number],
  feedbackUser: [{
    user: { type: String },
    feedback: { type: String }
  }]
});

eventSchema.index({ location: '2dsphere' });

module.exports = model('Event', eventSchema);
