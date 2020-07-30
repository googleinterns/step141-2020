import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import './simulate-page.css';
import { Client } from '../../client';
import { BiogridSimulationResults } from '../../build';
import SimulationBoard, {
  GridItemRet,
  GridItemLines,
} from '../../components/simulation-board';

export const SimulatePage = () => {
  const [simulationResults, setSimulationResults] = useState<
    BiogridSimulationResults
  >();
  const [currentStateFrame, setCurrentStateFrame] = useState(0);

  const client = Client.getInstance();

  async function getSimulationResults() {
    const params = queryString.parse(window.location.hash.split('?')[1]);
    const body = {
      startDate: new Date(params.startDate as string),
      endDate: new Date(params.endDate as string),
      smallBatteryCells: parseInt(params.smallBatteryCells as string),
      largeBatteryCells: parseInt(params.largeBatteryCells as string),
      numBuildings: parseInt(params.numBuildings as string),
      numSolarPanels: parseInt(params.numSolarPanels as string),
      townHeight: parseInt(params.townHeight as string),
      townWidth: parseInt(params.townWidth as string),
    };
    const results = await client.api.simulateNewBiogrid({ body });
    setSimulationResults(results);
  }

  const history = useHistory();

  const redirectToHome = () => {
    history.push('/');
  };

  const stateToGridItemRet = (state: any): GridItemRet[] => {
    return state.nodes.map((node: any) => {
      return {
        gridItemName: node.value.gridItemName,
        relativePosition: node.value.position ||
          node.value.relativePosition || { x: 0, y: 0 },
      };
    });
  };
  const stateToGridItemLines = (state: any): GridItemLines[] => {
    return state.edges.map((edge: any) => {
      return {
        fromItem: edge.v,
        toItem: edge.w,
        // TODO this is not a correct value
        powerThroughLinesKiloWatts: edge.value.power,
      };
    });
  };

  const playSimulation = async () => {
    const simResultsStateLen = simulationResults?.states.length || 0;
    if (currentStateFrame >= simResultsStateLen) {
      return;
    }
    const simResultsLen = simulationResults?.states.length || 0;
    for (let i = 0; i < simResultsStateLen; i++) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          setCurrentStateFrame(i);
          resolve();
        }, 1000);
      });
    }
  };

  useEffect(() => {
    getSimulationResults();
  }, []);

  return (
    <div className="simulation">
      <button onClick={redirectToHome} className="redirect">
        Change your Inputs!
      </button>
      {simulationResults && (
        <div className="results">
          <div className="table-results-container">
            <div className="metrics-container">
              <h2>Metrics</h2>
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
            <div className="states-container">
              <h2>States Table</h2>
              {simulationResults.states.map((stateGraph) => (
                <table className="state-graph">
                  {((stateGraph as any).nodes as any[]).map((node: any) => (
                    <tr className="gridItem">
                      <td>{node.v}</td>
                      <table className="grid-item-values">
                        {Object.keys(node.value).map((key: string) => (
                          <>
                            <tr>
                              <td>{key}</td>
                              <td>{JSON.stringify(node.value[key])}</td>
                            </tr>
                          </>
                        ))}
                      </table>
                    </tr>
                  ))}
                </table>
              ))}
            </div>
          </div>

          <div className="simboard-container">
            <h2>Simulation Board</h2>
            <div className="simboard-controls">
              <button onClick={() => playSimulation()}>Play</button>
              <button onClick={() => setCurrentStateFrame(0)}>Reset</button>
            </div>
            <SimulationBoard
              grid_height_km={simulationResults.townSize.height}
              grid_width_km={simulationResults.townSize.width}
              // TODO add changing indices to show the progression of time for each subsequent state
              // Find the GitHub issue: https://github.com/googleinterns/step141-2020/issues/64
              items={stateToGridItemRet(
                simulationResults.states[
                  currentStateFrame < simulationResults.states.length
                    ? currentStateFrame
                    : 0
                ]
              )}
              lines={stateToGridItemLines(
                simulationResults.states[
                  currentStateFrame < simulationResults.states.length
                    ? currentStateFrame
                    : 0
                ]
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulatePage;
