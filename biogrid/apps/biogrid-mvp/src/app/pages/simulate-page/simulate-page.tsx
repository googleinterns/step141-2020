/**
 * @summary Designs page where user sees results from the simulation.
 * @author Awad Osman <awado@google.com>
 * @author Lev Stambler <levst@google.com>
 * 
 * Created at    : 2020-07-07 09:31:49
 * Last modified : 2020-07-21 16:34:17
 */


import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './simulate-page.css';
import { Client } from '../../client';
import { BiogridSimulationResults } from '../../build';

export const SimulatePage = () => {
  const [simulationResults, setSimulationResults] = useState<
    BiogridSimulationResults
  >();
  
  const client = Client.getInstance();
  
  async function getSimulationResults() {
    await client.api.runBiogridSimulation();
    const results = await client.api.getBiogridSimulationResults();
    setSimulationResults(results);
  }

  const history = useHistory();

  const redirectToHome = () => {  
    history.push('/');
  }

  useEffect(() => {
    getSimulationResults();
  }, []);


  return (
    <div className="simulation">
      {simulationResults && (
        <div className="results">
          <table>
            <tr>
              <td>Time without energy</td>
              <td>{simulationResults.timeWithoutEnoughEnergy}</td>
            </tr>
            <tr>
              <td>Energy wasted from source</td>
              <td>{simulationResults.energyWastedFromSource}</td>
            </tr>
            <tr>
              <td>Energy wasted in transport</td>
              <td>{simulationResults.energyWastedInTransportation}</td>
            </tr>
          </table>
        </div>
      )}
      <button onClick={redirectToHome} className="redirect">Change your Inputs!</button>
    </div>
  );
};

export default SimulatePage;
