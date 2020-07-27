import React from 'react';
import './info-page.css';
import Visual from './EnergyFlowVisual.png';

export const InfoPage = () => {


  return (
    <div className="info-page">
      <h1>The Logic</h1>

      <img src={Visual} id="EnergyFlow"></img>

      <p>Firstly, the grid items <b>(batteries(b), solar panels(s), and buildings(b))</b> will be randomly placed in the town. 
      The grid items include the <b>grid(g)</b> itself as well. In case of small batteries, we will refer to them as <b>s_b</b>, and large batteries as <b>l_b</b>.
      </p>

      <p>Then they will be connected by a <b>directed graph G</b>, which connects the grid items from the grid to these items except the solar panels i.e <b>G(g, b), G(g, b)</b>. 
      Also the grid items are connected to one another. For instance the small batteries are connected to the buildings <b>G(s_b, b)</b>, the buildings are connected to one another <b>G(b_0, b_1)</b>. 
      The batteries, and solar panels are connected to the grid i.e <b>G(b, g), G(s, g)</b>.
      </p>

      <p>We then calculate the shortest distances between the grid items if we are to transfer power from supplier to receiver of that power using <b>Djiskra’s algorithm</b>. 
      Power is then transferred and the changes are made to the receiver and supplier. In this version, we are not considering the priorities of sending power. 
      We are considering the supplier which is close to the receiver. We are also implementing the process of giving power to houses as one where a house is given all the power it requires 
      or zero if there is not enough for it.
      </p>
    
    </div>
    );
};

export default InfoPage;
