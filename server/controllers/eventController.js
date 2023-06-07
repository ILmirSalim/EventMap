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
      const eventId = req.body;
      const user = req.body
      const userId = user._id;
      const event = await EventModel.findOne({ _id: eventId });
      event.users.push(userId);
      await event.save();
      res.status(200).json(event);
    } catch (e) {
      console.log('This is error', e.message);
      res.status(400).json({ message: e.message });
    }
  };
  
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

  async confirmParticipation(req, res) {
    try {
      const { userId } = req.body;
      const eventId = req.params.eventId;
      const event = await EventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      const existingParticipant = event.participants.find((participant) => participant.user.toString() === userId);
      if (existingParticipant) {
        return res.status(400).json({ message: "User has already confirmed or cancelled participation" });
      }
      event.participants.push({ user: userId, status: "confirmed" });
      await EventModel.updateOne({ _id: eventId }, event);
      res.status(200).json({ message: "User participation confirmed" });
    } catch (e) {
      console.log("this is error", e.message);
      res.status(400).json({ message: e.message });
    }
  };


  async filterEvents(req, res) {
    try {
      const { distance, type, date } = req.body;
      const { longitude, latitude } = req.user; // получаем координаты пользователя из объекта req.user

      const currentDate = new Date();
      const filteredEvents = await EventModel.find({
        locationType: type,
        date: { $gte: date },
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: longitude, latitude,
            },
            $maxDistance: distance,
          },
        },
      });

      const filteredEventsByTime = filteredEvents.filter(
        (event) => event.date.getTime() >= currentDate.getTime()
      );

      res.status(200).json(filteredEventsByTime);
    } catch (e) {
      console.log('this is error', e.message);
      res.status(400).json({ message: e.message });
    }
  }

  // async getAllEvents(req, res) {
  //     try {
  //       const eventsData = await EventModel.find({})
  //       res.status(200).json(eventsData)
  //     } catch (e) {
  //       console.log('this is error', e.message)
  //       res.status(400).json({ message: e.message })
  //     }
  //   };

  async addEvent(req, res) {
    try {
      if (!req.body.title) {
        res.status(400).json({ message: 'Пожалуйста добавьте заголовок события' })
      }

      const eventModel = new EventModel({
        title: req.body.title,
        description: req.body.description,
        locationType: req.body.locationType,
        // location: req.body.location,
        coordinates: req.body.coordinates,
        address: req.body.address,
        date: req.body.date,
        category: req.body.category



        //   coordinates: [Number],
        //   address: { type: String },
        //   date: { type: Date },
        //   category: { type: String },
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