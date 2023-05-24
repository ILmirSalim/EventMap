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
    
    async filterEvents(req, res) {
        try {
          const { distance, type, date } = req.body;
          const { longitude, latitude } = req.user; // получаем координаты пользователя из объекта req.user
      
          const currentDate = new Date();
          const filteredEvents = await Event.find({
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

            await TodosModel.findByIdAndUpdate({_id: req.body.id}, {title: req.body.titleTwo}, {new: true});
            
            res.status(200).json({ message: 'Элемент успешно изменен' })
            
        } catch (error) {
            res.status(400).json({ massege: 'Произошла ошибка при удалении' })
        }
    }
}

module.exports = new EventsController()