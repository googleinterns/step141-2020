import React, { useState } from 'react';
import './input-page.css';
import './input-page.scss';
import DatePicker from 'react-datepicker';
import { Client } from '../../client';
import { NewBiogridBody } from '../../build';
import { useHistory } from 'react-router-dom';

function useInput(opts: { type: string }) {
  const [value, setValue] = useState('');
  const input = (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={opts.type}
    />
  );
  return [value, input];
}

export const InputPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [smallBatteryCells, smallBatteryCellInput] = useInput({
    type: 'number',
  });
  const [largeBatteryCells, largeBatteryCellInput] = useInput({
    type: 'number',
  });
  const history = useHistory();

  const onSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    const body: NewBiogridBody = {
      startDate,
      endDate,
      smallBatteryCells: parseInt(smallBatteryCells as string),
      largeBatteryCells: parseInt(largeBatteryCells as string),
    };
    const client = Client.getInstance();
    await client.api.newBiogrid({ body });
    history.push('/simulate');
  };
  return (
    <div className="input-page">
      <form onSubmit={(e: React.SyntheticEvent<EventTarget>) => onSubmit(e)}>
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
        {smallBatteryCellInput}
        {largeBatteryCellInput}

        <input type="submit" />
      </form>
    </div>
  );
};

export default InputPage;
