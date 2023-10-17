import React from "react";
import { Event } from "../../Root/interfaces/iEventState";

interface EventNotificationProps {
    eventType: string;
    newEvent: Event | undefined;
    newUpdateEvent: Event | undefined;
}

export const EventNotification: React.FC<EventNotificationProps> = ({
    eventType,
    newEvent,
    newUpdateEvent
}) => {
  return (
    <div className="fixed bottom-10 left-20 
    p-[10px] bg-green-500 text-white flex flex-col rounded-xl">
      {eventType === 'newEvent' && (
        <div>
          Добавлено новое событие!
        </div>
      )}
      {eventType === 'updateEvent' && (
        <div>
          Обновлено событие!
        </div>
      )}
      <div>
        Название события: {eventType === 'newEvent' && newEvent!.title}
        {eventType === 'updateEvent' && newUpdateEvent!.title}
      </div>
    </div>
  );
};

export default EventNotification;