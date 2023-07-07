import React, { FC, ChangeEvent } from 'react';

interface FilterProps {
  setDistanceFilter: (value: number) => void;
  setTypesFilter: (value: string[]) => void;
  setDateFilter: (value: Date) => void;
  setTimeFilter: (value: number) => void;
}

export const FilterEvents: FC<FilterProps> = ({ setDistanceFilter, setTypesFilter, setDateFilter, setTimeFilter }) => {
  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistanceFilter(e.target.valueAsNumber);
  };

  const handleTypesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTypesFilter(e.target.value.split(','));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateFilter(new Date(e.target.value));
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeFilter(e.target.valueAsNumber);
  };

  return (
    <div className="block mt-[20px] flex justify-center">
      <input className=' rounded-xl p-[5px] m-[5px] outline-none' type='number' placeholder='Distance' onChange={handleDistanceChange}></input>
      <input className='rounded-xl p-[5px] m-[5px] outline-none' type='text' placeholder='Type' onChange={handleTypesChange}></input>
      <input className='rounded-xl p-[5px] m-[5px] outline-none' type='date' placeholder='Date' onChange={handleDateChange}></input>
      <input className='rounded-xl p-[5px] m-[5px] outline-none hover:shadow-white' type='number' placeholder='Time' onChange={handleTimeChange}></input>
    </div>
  );
};