import React, { useState } from 'react';
import OrganizedEvents from './components/OrganizedEvents/OrganizedEvents';
import VisitedEvents from './components/VisitedEvents';

type TabNameType = 'visited' | 'organized';

const EventsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabNameType>('visited');

  const handleTabChange = (tabName: TabNameType): void => {
    setActiveTab(tabName);
  }

  return (
    <div className='h-full'>
      <div className='pb-[20px] '>
        <button className='pr-[10px]' onClick={() => handleTabChange('visited')}>Посещаемые мероприятия</button>
        <button onClick={() => handleTabChange('organized')}>Организуемые мероприятия</button>
      </div>
      {activeTab === 'visited' && <VisitedEvents/>}
      {activeTab === 'organized' && <OrganizedEvents />}
    </div>
  );
};

export default EventsTabs;