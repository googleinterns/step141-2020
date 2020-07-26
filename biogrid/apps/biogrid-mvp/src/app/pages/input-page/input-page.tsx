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
  const [townSize, townSizeInput] = useInput({
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
      townSize,

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
      <p>This website will simulate how a <a href="https://www.sciencedirect.com/science/article/pii/S136403211830128X" target="_blank">microgrid</a> can 
        optimize energy use in a community by using <a href="https://biomimicry.org/what-is-biomimicry/" target="_blank">biomimicry</a> to 
        mimic the natural energy storage of the human body given a range of sunlight data, number of small and large 
        battery cells, buildings, solar panels, and town size. In the <b>visual</b> above, the <b>large battery cells</b> are 
        centered in the <b>middle of the town</b> so our grid can take energy from it in the event that
        no energy is coming from our renewable sources. Outside of our large battery cells, we have <b>small 
        battery cells</b> spread <b>throughout the town</b> so that our buildings can have an
        immediate energy source when they have a spike in energy consumption.</p>

        <p> Click <a href="" onClick={redirectToInfo}>here</a> to learn more about how we constructed this project. </p>
          
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
          <span className="tooltiptextLBC">LBC's are used as backup energy sources to our solar panels</span>
          <div className="largeBatteryCells">
            <label>Large Battery Cells</label>
            {largeBatteryCellInput}
          </div>
        </div>

        <br></br>

        <div className="tooltipBuild">
          <span className="tooltiptextBuild">Buildings are reperesented as energy consumers in our grid</span>
          <div className="buildings">
            <label>Buildings</label>
            {numBuildingsInput}
          </div>
        </div>

        <div className="tooltipSolar">
          <span className="tooltiptextSolar">Solar Panels are the main energy source in our grid</span>
          <div className="solarPanels">
            <label>Solar Panels</label>
            {numSolarPanelsInput}
          </div>
        </div>

          <br></br>

          <div className="townSize">
            <label>Town Size (Kilometers)</label>
            {townSizeInput}
          </div>


        <div className="submitButton">
          <input type="submit" className="submitButton" value="Run the Simulation!"/>
        </div>
      </form>
    </div>
  );
};

export default InputPage;
