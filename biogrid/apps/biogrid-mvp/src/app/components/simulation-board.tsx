import React, { useState } from 'react';
import { Distance, ItemPosition } from '@biogrid/grid-simulator';
import { ReactComponent as SmallBatterySvg } from '../../assets/icons/battery-small.svg';
import { ReactComponent as LargeBatterySvg } from '../../assets/icons/battery-large.svg';
import { ReactComponent as HouseSvg } from '../../assets/icons/house.svg';
import { ReactComponent as SolarPanelSvg } from '../../assets/icons/solar-panel.svg';
import './simulate-board.css';

interface GridItemRet {
  gridItemName: string;
  relativePosition: ItemPosition;
}

interface SimBoardProps {
  height: Distance;
  width: Distance;
  items: GridItemRet[];
}

const LargeBattery = () => {
  return (
    <div className="grid-item">
      <LargeBatterySvg />
    </div>
  );
};
const SmallBattery = () => {
  return (
    <div className="grid-item">
      <SmallBatterySvg />
    </div>
  );
};
const House = () => {
  return (
    <div className="grid-item">
      <HouseSvg />
    </div>
  );
};
const SolarPanel = () => {
  return (
    <div className="grid-item">
      <SolarPanelSvg />
    </div>
  );
};

export const SimulationBoard = (props: SimBoardProps) => {
  return (
    <div className="simulation-board" style={{}}>
      {props.items.map((item, i) => (
        <div
          className="grid-item-wrapper"
          style={{
            top: item.relativePosition.y,
            left: item.relativePosition.x,
          }}
        >
          {item.gridItemName.includes('small_battery') ? (
            <SmallBattery />
          ) : item.gridItemName.includes('large_battery') ? (
            <LargeBattery />
          ) : item.gridItemName.includes('solar_panel') ? (
            <SolarPanel />
          ) : (
            <House />
          )}
        </div>
      ))}
    </div>
  );
};

export default SimulationBoard;
