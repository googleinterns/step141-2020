import React, { useState } from 'react';
import './input-page.css';
import './input-page.scss';
import DatePicker from 'react-datepicker';
import { Client } from '../../client';
import { useHistory } from 'react-router-dom';
import Visual from './BioGridVisual.jpg';

function useInput<T>(opts: { default: T }) {
  const [value, setValue] = useState(opts.default);
  function valueToType(value: string): T {
    if (typeof opts.default === 'number') {
      return (parseInt(value) as unknown) as T;
    } else if (typeof opts.default === 'boolean') {
      return (Boolean(value) as unknown) as T;
    }
    return (JSON.stringify(value) as unknown) as T;
  }
  const input = (
    <input
      value={JSON.stringify(value)}
      onChange={(e) => setValue(valueToType(e.target.value))}
      type={typeof opts.default}
    />
  );
  return [value, input];
}

export const InputPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [smallBatteryCells, smallBatteryCellInput] = useInput({
    default: 0,
  });
  const [largeBatteryCells, largeBatteryCellInput] = useInput({
    default: 0,
  });
  const [numBuildings, numBuildingsInput] = useInput({
    default: 0,
  });
  const [numSolarPanels, numSolarPanelsInput] = useInput({
    default: 0,
  });
  const [townWidth, townWidthInput] = useInput({
    default: 0,
  });
  const [townHeight, townHeightInput] = useInput({
    default: 0,
  });
  const history = useHistory();

  const onSubmit = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    function serialize(obj: { [k: string]: unknown }) {
      const str = [];
      for (const p in obj)
        str.push(
          encodeURIComponent(p) +
            '=' +
            encodeURIComponent(
              (obj[p] as { toString: () => string }).toString()
            )
        );
      return str.join('&');
    }

    const params = {
      startDate,
      endDate,
      smallBatteryCells,
      largeBatteryCells,
      numBuildings,
      numSolarPanels,
      townHeight,
      townWidth,
    };
    history.push(`/simulate?${serialize(params)}`);
  };
  return (
    <div className="input-page">
      <form onSubmit={(e: React.SyntheticEvent<EventTarget>) => onSubmit(e)}>
        <h1>Welcome to the Biogrid Simulator!</h1>
        <img src={Visual} id="biogridVisual"></img>
        <p>
          This website will simulate how a{' '}
          <a
            href="https://www.sciencedirect.com/science/article/pii/S136403211830128X"
            target="_blank"
          >
            microgrid
          </a>{' '}
          can optimize energy use in a community by using{' '}
          <a href="https://biomimicry.org/what-is-biomimicry/" target="_blank">
            biomimicry
          </a>{' '}
          to mimic the natural energy storage of the human body given a range of
          sunlight data, number of small and large battery cells, buildings,
          solar panels, and town size. In the <b>visual</b> above, the{' '}
          <b>large battery cells</b> are centered in the{' '}
          <b>middle of the town</b> so our grid can take energy from it in the
          event that no energy is coming from our renewable sources. Outside of
          our large battery cells, we have <b>small battery cells</b> spread{' '}
          <b>throughout the town</b> so that our buildings can have an immediate
          energy source when they have a spike in energy consumption.
        </p>
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
        <div className="buildings">
          <label>Buildings</label>
          {numBuildingsInput}
        </div>
        <div className="solarPanels">
          <label>Solar Panels</label>
          {numSolarPanelsInput}
        </div>
        <br></br>
        <div className="townWidth">
          <label>Town Width (Kilometers)</label>
          {townWidthInput}
        </div>
        <div className="townHeight">
          <label>Town Height (Kilometers)</label>
          {townHeightInput}
        </div>
        <div className="submitButton">
          <input
            type="submit"
            className="submitButton"
            value="Run the Simulation!"
          />
        </div>
      </form>
    </div>
  );
};

export default InputPage;
