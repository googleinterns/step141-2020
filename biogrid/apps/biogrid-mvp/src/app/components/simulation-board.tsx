import React, { useState } from 'react';
import { Distance, ItemPosition } from '@biogrid/grid-simulator';
import { ReactComponent as SmallBatterySvg } from '../../assets/icons/battery-small.svg';
import { ReactComponent as LargeBatterySvg } from '../../assets/icons/battery-large.svg';
import { ReactComponent as HouseSvg } from '../../assets/icons/house.svg';
import { ReactComponent as GridSvg } from '../../assets/icons/grid.svg';
import { ReactComponent as SolarPanelSvg } from '../../assets/icons/solar-panel.svg';
import './simulate-board.css';

export interface GridItemRet {
  gridItemName: string;
  relativePosition: ItemPosition;
}

export interface GridItemLines {
  fromItem: string;
  toItem: string;
}

interface SimBoardProps {
  height: Distance;
  width: Distance;
  items: GridItemRet[];
  lines: GridItemLines[];
}

interface ItemsByName {
  [name: string]: ItemPosition;
}

const Grid = () => {
  return (
    <div className="grid-item">
      <GridSvg />
    </div>
  );
};
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
  const itemsByName: ItemsByName = props.items.reduce(
    (map: ItemsByName, item) => {
      map[item.gridItemName] = item.relativePosition;
      return map;
    },
    {}
  );
  const kilometersToCSSWidth = (distance: Distance) => {
    return `${Math.ceil((distance / props.width) * 100)}%`;
  };
  const kilometersToCSSHeight = (distance: Distance) => {
    return `${Math.ceil((distance / props.height) * 100)}%`;
  };
  const boardWidth = '50vw';
  const boardHeight = `${Math.ceil((props.height / props.width) * 50)}vw`;
  return (
    <div
      className="simulation-board"
      style={{
        width: boardWidth,
        height: boardHeight,
      }}
    >
      {props.items.map((item, i) => (
        <div
          className={`grid-item-wrapper ${item.gridItemName}`}
          style={{
            top: kilometersToCSSHeight(item.relativePosition.y),
            left: kilometersToCSSWidth(item.relativePosition.x),
          }}
        >
          {item.gridItemName.includes('small_battery') ? (
            <SmallBattery />
          ) : item.gridItemName.includes('large_battery') ? (
            <LargeBattery />
          ) : item.gridItemName.includes('solar_panel') ? (
            <SolarPanel />
          ) : item.gridItemName.includes('grid') ? (
            <Grid />
          ) : (
            <House />
          )}
        </div>
      ))}
      <div className="grid-line-wrapper">
        <svg width={boardWidth} height={boardHeight}>
          {props.lines.map((line) => (
            <line
              x1={`${kilometersToCSSWidth(itemsByName[line.fromItem].x)}`}
              y1={`${kilometersToCSSHeight(itemsByName[line.fromItem].y)}`}
              x2={`${kilometersToCSSWidth(itemsByName[line.toItem].x)}`}
              y2={`${kilometersToCSSHeight(itemsByName[line.toItem].y)}`}
              stroke="blue"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default SimulationBoard;
