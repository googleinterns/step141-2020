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
import ReactSlider from 'react-slider';
import { Client } from '../../client';
import { useHistory } from 'react-router-dom';
import { Slider } from '@material-ui/core';

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
  const LATEST_DATE = new Date();
  LATEST_DATE.setHours(0);
  const EARLIEST_DATE = new Date();
  EARLIEST_DATE.setDate(LATEST_DATE.getDate() - 6);
  const [startDate, setStartDate] = useState(EARLIEST_DATE);
  const [smallBatteryCells, smallBatteryCellInput] = useInput({
    default: 5,
  });
  const [largeBatteryCells, largeBatteryCellInput] = useInput({
    default: 5,
  });
  const [numBuildings, numBuildingsInput] = useInput({
    default: 5,
  });
  const [numSolarPanels, numSolarPanelsInput] = useInput({
    default: 5,
  });
  const [townWidth, townWidthInput] = useInput({
    default: 5,
  });
  const [townHeight, townHeightInput] = useInput({
    default: 5,
  });

  const history = useHistory();

  const redirectToInfo = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    history.push('/info');
  };

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
      smallBatteryCells,
      largeBatteryCells,
      numBuildings,
      numSolarPanels,
      townWidth,
      townHeight,
    };
    history.push(`/simulate?${serialize(params)}`);
  };

  function formatDate() {
    return `${
      startDate.getMonth() + 1
    }/${startDate.getDate()}/${startDate.getFullYear()}`;
  }

  return (
    <div className="input-page">
      <form onSubmit={(e: React.SyntheticEvent<EventTarget>) => onSubmit(e)}>
        <h1>Welcome to the Biogrid Simulator!</h1>

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
          to imitate the human body's glucose regulation procedures.{' '}
        </p>

        <p>
          Hover over the inputs to learn how they're used in the simulation!
        </p>

        <p>
          If you would like to learn more about how we designed this project
          click{' '}
          <a href="" onClick={redirectToInfo}>
            here
          </a>
          .
        </p>

        {/* TODO add an end date option so that simulations can span over multiple days
            See issue:
        */}
        <div className="tooltip dateSlider">
          <span className="tooltiptext">
            The date where we will start collecting sunlight data from
          </span>
          <div className="inputBox">
            <label>Select a Simulation Date</label>
            <div className="slider-wrapper">
              <Slider
                defaultValue={0}
                onChange={(e, val) => {
                  // Days from today last week. So if daysFromLastWeek = 1 and today is Sunday
                  // Then daysFromLastWeek signifies last Monday
                  const daysFromLastWeek = (val as unknown) as number;
                  const newDate = new Date(EARLIEST_DATE);
                  newDate.setDate(EARLIEST_DATE.getDate() + daysFromLastWeek);
                  setStartDate(newDate);
                }}
                getAriaValueText={formatDate}
                aria-labelledby="discrete-slider-small-steps"
                step={1}
                marks
                min={0}
                valueLabelFormat={formatDate}
                max={6}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
        </div>

        <br />

        <div className="tooltip">
          <span className="tooltiptext">
            SBC's are used for quick sources of energy
          </span>
          <div className="inputBox">
            <label>Small Battery Cells</label>
            {smallBatteryCellInput}
          </div>
        </div>

        <div className="tooltip">
          <span className="tooltiptext">
            LBC's are used as backup energy sources to the solar panels
          </span>
          <div className="inputBox">
            <label>Large Battery Cells</label>
            {largeBatteryCellInput}
          </div>
        </div>

        <br />

        <div className="tooltip">
          <span className="tooltiptext">
            Buildings are reperesented as energy consumers in the grid
          </span>
          <div className="inputBox">
            <label>Buildings</label>
            {numBuildingsInput}
          </div>
        </div>

        <div className="tooltip">
          <span className="tooltiptext">
            Solar Panels are the main energy source in the grid
          </span>
          <div className="inputBox">
            <label>Solar Panels</label>
            {numSolarPanelsInput}
          </div>
        </div>

        <br />

        <div className="tooltip">
          <span className="tooltiptext">
            Used for even distribution of objects on the grid
          </span>
          <div className="inputBox">
            <label>Town Width (Kilometers)</label>
            {townWidthInput}
          </div>
        </div>

        <div className="tooltip">
          <span className="tooltiptext">
            Used for even distribution of objects on the grid
          </span>
          <div className="inputBox">
            <label>Town Height (Kilometers)</label>
            {townHeightInput}
          </div>
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
