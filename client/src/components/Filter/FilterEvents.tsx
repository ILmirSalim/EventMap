import React, { FC, ChangeEvent } from 'react';
import IFilterProps from './interface/IFilterProps';

const FilterEvents: FC<IFilterProps> = ({ setDistanceFilter, setTypesFilter, setDateFilter, setTimeFilter }) => {
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
      <input className=' rounded-xl p-[5px] m-[5px] outline-none text-center' type='number' placeholder='Введите дистанцию' onChange={handleDistanceChange}></input>
      <input className='rounded-xl p-[5px] m-[5px] outline-none text-center' type='text' placeholder='Тип события' onChange={handleTypesChange}></input>
      <input className='rounded-xl p-[5px] m-[5px] outline-none text-center' type='date' placeholder='Дата события' onChange={handleDateChange}></input>
      <input className='rounded-xl p-[5px] m-[5px] outline-none hover:shadow-white text-center' type='number' placeholder='Время события' onChange={handleTimeChange}></input>
    </div>
  );
};

export default React.memo(FilterEvents)