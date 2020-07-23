import React from 'react';
import './info-page.css';
import Visual from './EnergyFlowVisual.png';

export const InfoPage = () => {


  return (
    <div className="info-page">
      <h1>The Logic</h1>

      <img src={Visual} id="EnergyFlow"></img>

      <p>Firstly, the grid items (batteries(b), solar panels(s), and buildings(b)) will be randomly placed in the town. 
      The grid items include the grid(g) itself as well. In case of small batteries, we will refer to them as s_b, and large batteries as l_b
      </p>

      <p>Then they will be connected with a directed graph, G which connects the grid items from the grid to these items except the solar panels i.e G(g, b), G(g, b). 
      Also the grid items are connected to one another. For instance the small batteries are connected to the buildings G(s_b, b), the buildings are connected to one another G(b_0, b_1). 
      The batteries, and solar panels are connected to the grid i.e G(b, g), G(s, g).
      </p>

      <p>We then calculate the shortest distances between the grid items if we are to transfer power from supplier to receiver of that power using Djiskra’s algorithm. 
      Power is then transferred and the changes are made to the receiver and supplier. In this version, we are not considering the priorities of sending power. 
      We are considering the supplier which is close to the receiver. We are also implementing the process of giving power to houses as one where a house is given all the power it requires 
      or zero if there is not enough for it.
      </p>
    
    
    
    
    
    
    
    
    
    
    
    
    </div>
    );
};

export default InfoPage;
