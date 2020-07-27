import React, { useState } from 'react';
import './input-page.css';
import './input-page.scss';
import DatePicker from 'react-datepicker';
import { Client } from '../../client';
import { useHistory } from 'react-router-dom';
import Visual from "./BioGridVisual.jpg";

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
      <img src={Visual} id="biogridVisual"></img>
      <p id="intro">This website will simulate how a <a href="https://www.sciencedirect.com/science/article/pii/S136403211830128X" target="_blank">microgrid</a> can 
        optimize energy use in a community by using <a href="https://biomimicry.org/what-is-biomimicry/" target="_blank">biomimicry</a> to 
        imitate the human body's glucose regulation procedures. </p>

        <p>Hover over the inputs to learn how they're used in the simulation!</p>

        <p>If you would like to learn more about how we designed this project click <a href="" onClick={redirectToInfo}>here</a>.</p>
          
        <div className="tooltipStartDate">
          <span className="tooltiptextStartDate">The date where we will start collecting sunlight data from</span>
          <div className="startDatePicker">
            <label>Start Date</label>
            <DatePicker
              showPopperArrow={false}
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
            />
          </div>
        </div>

        <div className="tooltipEndDate">
          <span className="tooltiptextEndDate">The date where we will stop collecting sunlight data</span>
          <div className="endDatePicker">
            <label>End Date</label>
            <DatePicker
              showPopperArrow={false}
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
            />
          </div>
        </div>

        <br></br>

        <div className="tooltipSBC">
          <span className="tooltiptextSBC">SBC's are used for quick sources of energy</span>
          <div className="smallBatteryCells">
            <label>Small Battery Cells</label>
            {smallBatteryCellInput}
          </div>
        </div>

        <div className="tooltipLBC">
          <span className="tooltiptextLBC">LBC's are used as backup energy sources to the solar panels</span>
          <div className="largeBatteryCells">
            <label>Large Battery Cells</label>
            {largeBatteryCellInput}
          </div>
        </div>

        <br></br>

        <div className="tooltipBuild">
          <span className="tooltiptextBuild">Buildings are reperesented as energy consumers in the grid</span>
          <div className="buildings">
            <label>Buildings</label>
            {numBuildingsInput}
          </div>
        </div>

        <div className="tooltipSolar">
          <span className="tooltiptextSolar">Solar Panels are the main energy source in the grid</span>
          <div className="solarPanels">
            <label>Solar Panels</label>
            {numSolarPanelsInput}
          </div>
        </div>

        <br></br>

        <div className="tooltipWidth">
          <span className="tooltiptextWidth">Used for even distribution of objects on the grid</span>
          <div className="townWidth">
            <label>Town Width (Kilometers)</label>
            {townWidthInput}
          </div>
        </div>

        <div className="tooltipHeight">
          <span className="tooltiptextHeight">Used for even distribution of objects on the grid</span>
          <div className="townHeight">
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
