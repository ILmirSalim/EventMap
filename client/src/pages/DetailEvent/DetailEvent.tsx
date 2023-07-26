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
    <div className='h-screen '>
      <div className='pb-[20px] flex justify-center  items-center'>
        <button className='mr-[40px] p-[5px] rounded-xl outline-none bg-gradient-to-r from-green-400 to-cyan-400 
        hover:scale-110 transform transition-all duration-200 ' 
        onClick={() => handleTabChange('visited')}>Посещаемые мероприятия</button>

        <button className=' p-[5px] rounded-xl outline-none bg-gradient-to-r from-green-400 to-cyan-400 
        hover:scale-110 transform transition-all duration-200 ' 
        onClick={() => handleTabChange('organized')}>Организуемые мероприятия</button>
      </div>
      {activeTab === 'visited' && <VisitedEvents/>}
      {activeTab === 'organized' && <OrganizedEvents />}
    </div>
  );
};

export default EventsTabs;