const EventModel = require('../models/newEvent-model')

class EventsController {

  async getAllEvents(req, res) {
    try {
      const eventsData = await EventModel.find({})
      res.status(200).json(eventsData)
    } catch (e) {
      console.log('this is error', e.message)
      res.status(400).json({ message: e.message })
    }
  };

  async addUserToEvent(req, res) {
    try {
      const eventId = req.body.eventId;
      const userId = req.body.userId;

      const eventt = await EventModel.findById(eventId);
      if (eventt.users.includes(userId)) {
        return res.status(400).json({ message: 'User is already added to the event' });
      }
      const event = await EventModel.findByIdAndUpdate(eventId, { $push: { users: userId } }, { new: true });
      res.status(200).json(event);

    } catch (e) {
      console.log('This is error', e.message);
      res.status(400).json({ message: e.message });
    }
  };

  async addFeedbackToEvent(req, res) {
    try {
      const eventId = req.body.eventId;
      const user = req.body.user;
      const feedback = req.body.feedback
      const rating = req.body.rating

      const updatedEvent = await EventModel.findByIdAndUpdate(
        eventId,
        {
          $push: {
            feedbackUser: {
              user: user,
              feedback: feedback
            },
            rating: rating
          },

        },
        { new: true }
      );

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error('This is error', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  async removeUserFromEvent(req, res) {
    try {
      const eventId = req.body.eventId;
      const userId = req.body.userId;

      await EventModel.findByIdAndUpdate(eventId, { $pull: { users: userId } }, { new: true });

      // if (!event.users.includes(userId)) {
      //     return res.status(400).json({ message: 'User is not part of the event' });
      // }

      res.status(200).json({ message: 'User remove in event' });

    } catch (e) {
      console.log('This is error', e.message);
      res.status(400).json({ message: e.message });
    }
  }

  async getEventsByUserId(req, res) {
    try {
      const userId = req.body.userId;

      const events = await EventModel.find({ users: userId });

      res.status(200).json(events);

    } catch (e) {
      console.log('This is error', e.message);
      res.status(400).json({ message: e.message });
    }
  }

  async searchEventsByCategory(req, res) {
    const title = req.body.title;
    const category = req.body.category;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    try {
      let searchEvent = {};

      if (title && category && startDate && endDate) {
        searchEvent = {
          title: title,
          category: category,
          date: { $gte: startDate, $lte: endDate },
        };
      } else if (title && category && startDate) {
        searchEvent = {
          title: title,
          category: category,
          date: { $gte: startDate },
        };
      } else if (title && category && endDate) {
        searchEvent = {
          title: title,
          category: category,
          date: { $lte: endDate },
        };
      } else if (title && startDate) {
        searchEvent = {
          title: title,
          date: { $gte: startDate },
        };
      } else if (title && endDate) {
        searchEvent = {
          title: title,
          date: { $lte: endDate },
        };
      } else if (category && startDate) {
        searchEvent = {
          category: category,
          date: { $gte: startDate },
        };
      } else if (category && endDate) {
        searchEvent = {
          category: category,
          date: { $lte: endDate },
        };
      } else if (category) {
        searchEvent = {
          category: category,
        }
      } else if (startDate && endDate) {
        searchEvent = {
          date: { $gte: startDate, $lte: endDate },
        };
      } else if (startDate) {
        searchEvent = {
          date: { $gte: startDate }
        }
      } else if (endDate) {
        searchEvent = {
          date: { $lte: endDate }
        }
      } else if (title) {
        searchEvent = {
          title: title,
        };
      } else if (title, category) {
        searchEvent = {
          title: title,
          category: category,
        };
      }

      const events = await EventModel.find(searchEvent);
      res.json(events);
    } catch (err) {
      res.json({ message: err });
    }
  }

  async filterEvents(req, res) {
    try {
      const { longitude, latitude, distance } = req.body;
    
      const events = await EventModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            distanceField: "distance",
            maxDistance: distance,
            spherical: true
          }
        }
      ]);
    
      res.status(200).json(events);
    
    } catch (e) {
      console.log('this is error', e.message);
      res.status(400).json({ message: e.message });
    }
  }

  async addEvent(req, res) {
    try {
      const eventModel = new EventModel({
        title: req.body.title,
        description: req.body.description,
        locationType: req.body.locationType,
        location: {
          type: req.body.location.type.type,
          coordinates: req.body.location.coordinates
        },
        address: req.body.address,
        day: req.body.day,
        time: req.body.time,
        category: req.body.category,
        userCreatedEvent: req.body.userCreatedEvent
      })
      
      await eventModel.save()
      res.status(200).json({ message: 'Событие успешно добавлено' })
    } catch (error) {
      res.status(400).json({ message: 'Произошла ошибка при добавлении', error })
    }
  };

  async deleteTodo(req, res) {
    try {
      if (!req.body.id) {
        res.status(400).json({ message: 'Пожалуйста укажите id заголовка' })
      }

      const { deletedCount } = await TodosModel.findByIdAndDelete({ _id: req.body.id })

      if (deletedCount === 0) {
        res.status(400).json({ massege: 'Удаление не произошло, пожалуйста проверьте id заголовка' })
      }

      res.status(200).json({ message: 'Элемент успешно удален' })

    } catch (error) {
      res.status(400).json({ massege: 'Произошла ошибка при удалении' })
    }
  }

  async updateTodo(req, res) {
    try {
      if (!req.body.id) {
        res.status(400).json({ message: 'Пожалуйста укажите id заголовка' })
      }

      await TodosModel.findByIdAndUpdate({ _id: req.body.id }, { title: req.body.titleTwo }, { new: true });

      res.status(200).json({ message: 'Элемент успешно изменен' })

    } catch (error) {
      res.status(400).json({ massege: 'Произошла ошибка при удалении' })
    }
  }
}

module.exports = new EventsController()