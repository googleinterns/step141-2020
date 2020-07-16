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
          <div className="startDatePicker">
            <label>Start Date</label>
            <DatePicker
              showPopperArrow={false}
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
            />
          </div>
          <div className="endDatePicker">
            <label>End Date</label>
            <DatePicker
              showPopperArrow={false}
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
            />
          </div>
          <br></br>
          <div className="smallBatteryCells">
            <label>Small Battery Cells</label>
            {smallBatteryCellInput}
          </div>
          <div className="largeBatteryCells">
            <label>Large Battery Cells</label>
            {largeBatteryCellInput}
          </div>
          <br></br>
        <div className="submitButton">
          <input type="submit" className="submitButton"/>
        </div>
      </form>
    </div>
  );
};

export default InputPage;
