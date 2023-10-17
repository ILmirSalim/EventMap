const EventModel = require('../models/newEvent-model')
import { Request, Response, Express, ErrorRequestHandler } from 'express';
import { Multer } from 'multer'
type RegistrationRequestBody = {
  _id?: string,
  email: string;
  password: string;
  userName: string;
  userAge: number;
  interestsAndPreferences: string[];
 
};
interface ErrorMessage {
  message:string
}
interface existingUser {
  userId: string;
}

type EventBody = {
  title: string;
  description?: string;
  locationType?: string;
  location?: {
    type:  {
      type: string;
    }
    coordinates: string;
  };
  address?: string;
  day?: Date;
  time?: string;
  category?: string;
  users?: {
    userId: string;
    userName: string;
  };
  userCreatedEvent?: string;
  rating?: number;
  feedbackUser?: {
    user: string;
    feedback: string;
  };
  image?: string;
};

type ReqFile = Express.Multer.File & { path: string };

export interface TypedRequestBody<T> extends Express.Request {
  body: T
  file: ReqFile
  query?: any
  cookies: string
  
}
class EventsController {

  async getAllEvents(req: Request, res: Response) {
    try {
      const eventsData = await EventModel.find({})
      res.status(200).json(eventsData)
    } catch (e) {
      console.log('this is error')
      
    }
  };

  // async addUserToEvent(req, res) {
  //   try {
  //     const eventId = req.body.eventId;
  //     const userId = req.body.userId;
  //     const userName = req.body.userName;

  //     const eventt = await EventModel.findById(eventId);
  //     if (eventt.users.includes(userId)) {
  //       return res.status(400).json({ message: 'User is already added to the event' });
  //     }
  //     const event = await EventModel.findByIdAndUpdate(eventId, { $push: { users: {userId, userName }} }, { new: true });
  //     res.status(200).json(event);

  //   } catch (e) {
  //     console.log('This is error', e.message);
  //     res.status(400).json({ message: e.message });
  //   }
  // };
  async addUserToEvent(req: Request, res: Response) {
    try {
      const eventId = req.body.eventId;
      const user = { userId: req.body.userId, userName: req.body.userName };

      const event = await EventModel.findById(eventId);
      if (event.users.some((existingUser: existingUser) => existingUser.userId === user.userId)) {
        return res.status(400).json({ message: 'User is already added to the event' });
      }

      event.users.push(user);
      const updatedEvent = await event.save();
      res.status(200).json(updatedEvent);
    } catch (error:any) {
      console.log('Error: Ошибка в добавлении пользователя в событие!');
      
    }
  };
  async addFeedbackToEvent(req: Request, res: Response) {
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
    } catch (error:any) {
      console.error('This is error', error.message);
      res.status(400).json({ message: error.message });
    }
  }

  async updateEvent(req: Request, res: Response) {

    try {
      const event = await EventModel.findByIdAndUpdate(req.body.id, {
        title: req.body.title,
        description: req.body.description,
        locationType: req.body.locationType,
        location: {
          type: req.body.location.type,
          coordinates: req.body.location.coordinates
        },
        address: req.body.address,
        day: req.body.day,
        time: req.body.time,
        category: req.body.category,
        userCreatedEvent: req.body.userCreatedEvent
      }, { new: true })

      if (!event) {
        return res.status(404).json({ message: 'Событие не найдено' })
      }

      res.status(200).json({ message: 'Событие успешно обновлено!', event })
    } catch (error:any) {
      res.status(400).json({ message: 'Произошла ошибка при обновлении события!', error })
    }
  };

  async removeUserFromEvent(req: Request, res: Response) {
    try {
      const eventId = req.body.eventId;
      const userId = req.body.userId;

      await EventModel.findByIdAndUpdate(
        eventId,
        { $pull: { users: { userId } } },
        { new: true }
      );

      res.status(200).json({ message: 'User remove in event' });

    } catch (e:any) {
      console.log('This is error');
      
    }
  }

  async deleteEvents(req: Request, res: Response) {
    try {
      const { eventId } = req.body;
      console.log('number', eventId);
      await EventModel.findByIdAndDelete(eventId);

      res.status(200).json({ message: 'Event delete!' });

    } catch (e) {
      console.log('This is error');
     
    }
  }

  async getEventsByUserId(req: Request, res: Response) {
    try {
      const userId = req.body.userId;

      // const events = await EventModel.find({ users: userId });
      const events = await EventModel.find({
        users: { $elemMatch: { userId } }
      });

      res.status(200).json(events);

    } catch (e) {
      console.log('This is error');
      
    }
  }

  async searchEvents(req: Request, res: Response) {
    const title = req.body.title;
    const category = req.body.category;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const { longitude, latitude, distance } = req.body;
    
    try {
      const searchEvent: any = {};

      if (title) {
        searchEvent.title = title;
      }

      if (category) {
        searchEvent.category = category;
      }

      if (startDate) {
        searchEvent.day = { $gte: startDate };
      }

      if (endDate) {
        searchEvent.day = { ...searchEvent.day, $lte: endDate };
      }

      if (longitude && latitude && distance) {

        searchEvent.location = {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: distance
          }
        };
      }
      console.log('searchMain', searchEvent);
      let events = await EventModel.find(searchEvent);
      res.json(events);

    } catch (err:any) {
      res.json({ message: err });
    }
  }

  // async addEvent(req, res) {
  //   try {
  //     const eventModel = new EventModel({
  //       title: req.body.title,
  //       description: req.body.description,
  //       locationType: req.body.locationType,
  //       location: {
  //         type: req.body.location.type.type,
  //         coordinates: req.body.location.coordinates
  //       },
  //       address: req.body.address,
  //       day: req.body.day,
  //       time: req.body.time,
  //       category: req.body.category,
  //       userCreatedEvent: req.body.userCreatedEvent
  //     })

  //     await eventModel.save()
  //     res.status(200).json({ message: 'Событие успешно добавлено' })
  //   } catch (error) {
  //     res.status(400).json({ message: 'Произошла ошибка при добавлении', error })
  //   }
  // };
  async addEvent(req: TypedRequestBody<EventBody>, res: Response) {
    
    const file = req.file
    
    const { path } = file;
   
    try {
      const eventModel = new EventModel({
        title: req.body.title,
        description: req.body.description,
        locationType: req.body.locationType,
        location: {
          type: req.body.location?.type?.type,
          coordinates: JSON.parse(req.body.location!.coordinates)
        },
        address: req.body.address,
        day: req.body.day,
        time: req.body.time,
        category: req.body.category,
        userCreatedEvent: req.body.userCreatedEvent,
        image: path
      });
      
      await eventModel.save();
      res.status(200).json({ message: 'Событие успешно добавлено' });
    } catch (error:any) {
      res.status(400).json({ message: 'Произошла ошибка при добавлении', error });
    }
  }
}

module.exports = new EventsController()