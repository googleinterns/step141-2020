/**
 * @summary Designs the page where user can learn more about the backend algorithms.
 * @author Awad Osman <awado@google.com>
 * @author Lev Stambler <levst@google.com>
 * 
 * Created at    : 2020-06-23 15:45:11
 * Last modified : 2020-07-28 11:15:32
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import './info-page.css';
import Visual from './EnergyFlowVisual.png';

export const InfoPage = () => {

  const history = useHistory();

  const redirectToHome = () => {
    history.push('/');
  };

  return (
    <div className="info-page">

    <div className="navbar">
      <a href="" onClick={redirectToHome}>Home</a>
      <a className="active">Info</a>
    </div>

      <h1>The Logic</h1>

      <img src={Visual} id="EnergyFlow"></img>

      <p>Firstly, the grid items <b>(small batteries(s_b), large batteries(l_b) solar panels(s), and buildings(B))</b> will be randomly placed in the town. 
      The grid items include the <b>grid(g)</b> itself as well.
      </p>

      <p>Each grid item except the solar panels is connected to grid <b>g</b> by a <b>directed graph G</b>, i.e <b>G(g, s_b), G(g, l_b), G(g, B)</b>. 
      Also some of the grid items are connected to one another. For instance the small batteries are connected to the buildings <b>G(s_b, B)</b>, the buildings are connected to one another <b>G(B_0, B_1)</b>. 
      The batteries, and solar panels are connected to the grid i.e <b>G(s_b, g), G(l_b, g), G(s, g)</b>.
      </p>

      <p>We then calculate the shortest distances between the grid items if we are to transfer power from supplier to receiver of that power using <b>Djisktra’s algorithm</b>. 
      Power is then transferred and the changes are made to the receiver and supplier. In this version, we are not considering the priorities of sending power. 
      We are considering the supplier which is close to the receiver. We are also implementing the process of giving power to houses as one where a house is given all the power it requires 
      or zero if there is not enough for it.
      </p>
    
    </div>
    );
};

export default InfoPage;
