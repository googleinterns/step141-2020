import React, { useState } from 'react';
import './input-page.css';
import { useForm } from 'react-hook-form';
import { NewBiogridBody } from '@biogrid/api-interfaces';
import DatePicker from 'react-datepicker'

export const InputPage = () => {
  const { register, handleSubmit, errors } = useForm();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const onSubmit = async (data: {
    smallBatteryCells: number;
    largeBatteryCells: number;
  }) => {
    const body: NewBiogridBody = {
      startDate,
      endDate,
      smallBatteryCells: data.smallBatteryCells,
      largeBatteryCells: data.largeBatteryCells,
    };
    await fetch('url/api/biogrid/', {
      body,
      method: 'POST'
    })
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DatePicker
        showPopperArrow={false}
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
      />
      <DatePicker
        showPopperArrow={false}
        selected={endDate}
        onChange={(date: Date) => setEndDate(date)}
      />

      <input
        name="smallBatteryCells"
        type="number"
        ref={register({ required: true, pattern: /\d+/ })}
      />
      {errors.smallBatteryCells && 'This field is required.'}

      <input
        name="largeBatteryCells"
        type="number"
        ref={register({ pattern: /\d+/, required: true })}
      />
      {errors.largeBatteryCells && 'This field is required.'}

      <input type="submit" />


      <input type="submit" />
    </form>
  );
};

export default InputPage;
