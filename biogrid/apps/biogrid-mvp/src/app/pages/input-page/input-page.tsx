/**
 * @summary Designs the page where user will enter inputs to run simulation.
 * @author Awad Osman <awado@google.com>
 * @author Lev Stambler <levst@google.com>
 * @author Roland Naijuka <rnaijuka@google.com>
 * 
 * Created at    : 2020-07-01 11:53:16
 * Last modified : 2020-07-28 11:27:22
 */

import React, { useState } from 'react';
import './input-page.css';
import './input-page.scss';
import DatePicker from 'react-datepicker';
import { Client } from '../../client';
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
  const [numBuildings, numBuildingsInput] = useInput({
    type: 'number',
  });
  const [numSolarPanels, numSolarPanelsInput] = useInput({
    type: 'number',
  });
  const [townWidth, townWidthInput] = useInput({
    type: 'number',
  });
  const [townHeight, townHeightInput] = useInput({
    type: 'number',
  });

  const history = useHistory();

  const redirectToInfo = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    history.push('/info');
  }

  const onSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    const body = {
      startDate,
      endDate,
      smallBatteryCells,
      largeBatteryCells,
      numBuildings,
      numSolarPanels,
      townWidth,
      townHeight,

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
        imitate the human body's glucose regulation procedures. </p>

        <p>Hover over the inputs to learn how they're used in the simulation!</p>

        <p>If you would like to learn more about how we designed this project click <a href="" onClick={redirectToInfo}>here</a>.</p>
          
        <div className="tooltip">
          <span className="tooltiptext">The date where we will start collecting sunlight data from</span>
          <div className="inputBox">
            <label>Start Date</label>
            <DatePicker
              showPopperArrow={false}
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
            />
          </div>
        </div>

        <div className="tooltip">
          <span className="tooltiptext">The date where we will stop collecting sunlight data</span>
          <div className="inputBox">
            <label>End Date</label>
            <DatePicker
              showPopperArrow={false}
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
            />
          </div>
        </div>

        <br/>

        <div className="tooltip">
          <span className="tooltiptext">SBC's are used for quick sources of energy</span>
          <div className="inputBox">
            <label>Small Battery Cells</label>
            {smallBatteryCellInput}
          </div>
        </div>

        <div className="tooltip">
          <span className="tooltiptext">LBC's are used as backup energy sources to the solar panels</span>
          <div className="inputBox">
            <label>Large Battery Cells</label>
            {largeBatteryCellInput}
          </div>
        </div>

        <br/>

        <div className="tooltip">
          <span className="tooltiptext">Buildings are reperesented as energy consumers in the grid</span>
          <div className="inputBox">
            <label>Buildings</label>
            {numBuildingsInput}
          </div>
        </div>

        <div className="tooltip">
          <span className="tooltiptext">Solar Panels are the main energy source in the grid</span>
          <div className="inputBox">
            <label>Solar Panels</label>
            {numSolarPanelsInput}
          </div>
        </div>

        <br/>

        <div className="tooltip">
          <span className="tooltiptext">Used for even distribution of objects on the grid</span>
          <div className="inputBox">
            <label>Town Width (Kilometers)</label>
            {townWidthInput}
          </div>
        </div>

        <div className="tooltip">
          <span className="tooltiptext">Used for even distribution of objects on the grid</span>
          <div className="inputBox">
            <label>Town Height (Kilometers)</label>
            {townHeightInput}
          </div>
        </div>

        <div className="submitButton">
          <input type="submit" className="submitButton" value="Run the Simulation!"/>
        </div>
      </form>
    </div>
  );
};

export default InputPage;
