import React, { useState } from 'react';
import './simulate-page.css';
import { Client } from '../../client';
import { BiogridSimulationResults } from '../../build';

enum SimulationStatus {
  NOT_STARTED,
  RUNNING,
  RAN,
}

export const SimulatePage = () => {
  const [simulationResults, setSimulationResults] = useState<
    BiogridSimulationResults
  >();
  const [simulationStatus, setSimulationStatus] = useState(
    SimulationStatus.NOT_STARTED
  );

  const client = Client.getInstance();
  async function runSimulation() {
    setSimulationStatus(SimulationStatus.RUNNING);
    await client.api.runBiogridSimulation();
    setSimulationStatus(SimulationStatus.RAN);
  }
  async function getSimulationResults() {
    const results = await client.api.getBiogridSimulationResults();
    setSimulationResults(results);
  }

  return (
    <div className="simulation">
      <button onClick={() => runSimulation()}>Run the simulation</button>
      {simulationStatus === SimulationStatus.RUNNING && (
        <div>Loading your results...</div>
      )}
      {simulationStatus === SimulationStatus.RAN && (
        <button onClick={() => getSimulationResults()}>
          Get simulation results
        </button>
      )}
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
    </div>
  );
};

export default SimulatePage;
