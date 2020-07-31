import React, { useState } from 'react';
import { Distance, ItemPosition } from '@biogrid/grid-simulator';
import { GRID_ITEM_NAMES } from '@biogrid/biogrid-simulator';
import { ReactComponent as SmallBatterySvg } from '../../assets/icons/battery-small.svg';
import { ReactComponent as LargeBatterySvg } from '../../assets/icons/battery-large.svg';
import { ReactComponent as HouseSvg } from '../../assets/icons/house.svg';
import { ReactComponent as GridSvg } from '../../assets/icons/grid.svg';
import { ReactComponent as SolarPanelSvg } from '../../assets/icons/solar-panel.svg';
import './simulate-board.css';
import { SIZES } from './simulation-board-constants';

export interface GridItemRet {
  gridItemName: string;
  relativePosition: ItemPosition;
}

export interface GridItemLines {
  fromItem: string;
  toItem: string;
  powerThroughLinesKiloWatts?: number;
}

interface SimBoardProps {
  grid_height_km: Distance;
  grid_width_km: Distance;
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

// TODO: elements overlap and this needs to be fixed. Issue found on: https://github.com/googleinterns/step141-2020/issues/65
export const SimulationBoard = (props: SimBoardProps) => {
  const itemsByName: ItemsByName = props.items.reduce(
    (map: ItemsByName, item) => {
      map[item.gridItemName] = item.relativePosition;
      return map;
    },
    {}
  );
  const kilometersToCSSWidth = (distance: Distance, offset = 0) => {
    return `${Math.ceil(
      (distance / props.grid_width_km) * SIZES.KM_TO_PERCENTAGE_SCALE + offset
    )}%`;
  };
  const kilometersToCSSHeight = (distance: Distance, offset = 0) => {
    return `${Math.ceil(
      (distance / props.grid_height_km) * SIZES.KM_TO_PERCENTAGE_SCALE + offset
    )}%`;
  };
  const boardWidth = `${SIZES.BOARD_WIDTH_VW}vw`;
  const boardHeight = `${Math.ceil(
    (props.grid_height_km / props.grid_width_km) * SIZES.BOARD_WIDTH_VW
  )}vw`;

  const kiloWattToThickness = (kilowatts: number) => {
    return Math.ceil(kilowatts * SIZES.KILOWATT_TO_PIXELS);
  };

  return (
    <div
      className="simulation-board"
      style={{
        width: boardWidth,
        height: boardHeight,
      }}
    >
      {/* TODO: Overlapping elements will be accounted for with the issue: https://github.com/googleinterns/step141-2020/issues/65*/}
      {props.items.map((item, i) => (
        <div
          className={`grid-item-wrapper ${item.gridItemName}`}
          style={{
            top: kilometersToCSSHeight(item.relativePosition.y),
            left: kilometersToCSSWidth(item.relativePosition.x),
          }}
        >
          {item.gridItemName.includes(GRID_ITEM_NAMES.SMALL_BATTERY) ? (
            <SmallBattery />
          ) : item.gridItemName.includes(GRID_ITEM_NAMES.LARGE_BATTERY) ? (
            <LargeBattery />
          ) : item.gridItemName.includes(GRID_ITEM_NAMES.SOLAR_PANEL) ? (
            <SolarPanel />
          ) : item.gridItemName.includes(GRID_ITEM_NAMES.GRID) ? (
            <Grid />
          ) : (
            <House />
          )}
        </div>
      ))}
      <div className="grid-line-wrapper">
        <svg width={boardWidth} height={boardHeight}>
          {props.lines.map((line) => {
            const lineThickness = kiloWattToThickness(
              line.powerThroughLinesKiloWatts || 1
            );
            return (
              <>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" />
                  </marker>
                </defs>
                <line
                  // Add half of the icon width in order to center the lines
                  x1={`${kilometersToCSSWidth(
                    itemsByName[line.fromItem].x,
                    SIZES.ICON_WIDTH_PERCENT / 2 - lineThickness
                  )}`}
                  y1={`${kilometersToCSSHeight(
                    itemsByName[line.fromItem].y,
                    SIZES.ICON_WIDTH_PERCENT / 2 - lineThickness
                  )}`}
                  x2={`${kilometersToCSSWidth(
                    itemsByName[line.toItem].x,
                    SIZES.ICON_WIDTH_PERCENT / 2 - lineThickness
                  )}`}
                  y2={`${kilometersToCSSHeight(
                    itemsByName[line.toItem].y,
                    SIZES.ICON_WIDTH_PERCENT / 2 - lineThickness
                  )}`}
                  markerEnd="url(#arrowhead)"
                  stroke={
                    (line.powerThroughLinesKiloWatts || 0) > 0 ? 'blue' : 'grey'
                  }
                  strokeWidth={`${lineThickness}px`}
                />
              </>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default SimulationBoard;
