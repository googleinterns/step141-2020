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
      <h1>Welcome to the Biogrid Simulator!</h1>
      <p>This website will simulate how a <a href="https://www.sciencedirect.com/science/article/pii/S136403211830128X" target="_blank">microgrid</a> can 
        optimize energy use in a community by using <a href="https://biomimicry.org/what-is-biomimicry/" target="_blank">biomimicry</a> to 
        mimic the natural energy storage of the human body given a range of sunlight data and
        an amount of small and large battery cells.</p>  
        <h3>Select a Start Date:</h3>
        <DatePicker
          showPopperArrow={false}
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
        />
        <h3>Select a End Date:</h3>
        <DatePicker
          showPopperArrow={false}
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
        />
        <h3>Enter the amount of small battery cells:</h3>
        {smallBatteryCellInput}
        <h3>Enter the amount of large battery cells</h3>
        {largeBatteryCellInput}

        <input type="submit" />
      </form>
    </div>
  );
};

export default InputPage;
