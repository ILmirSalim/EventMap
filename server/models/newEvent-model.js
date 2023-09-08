const { Schema, model } = require('mongoose')

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  locationType: { type: String },
  location: {
    type: {
      type: String, 
      enum: ['Point'],    
    },
    coordinates: {
      type: [Number],
    }
  },
  address: { type: String },
  day: { type: Date },
  time: { type: String },
  category: { type: String },
  users: [{
    userId: { type: String },
    userName: { type: String }
  }],
  userCreatedEvent: { type: String },
  rating: [Number],
  feedbackUser: [{
    user: { type: String },
    feedback: { type: String }
  }],
  image: {type: String}
});

eventSchema.index({ location: '2dsphere' });

module.exports = model('Event', eventSchema);
