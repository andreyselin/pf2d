import {Bounds, Coords, IterationStep} from "../types/coords";
import {prepareMapToRender, renderMap} from "./misc";

export function renderPath(mapBounds: Bounds, iterationStep: IterationStep) {
  let mapArray: string[][] = prepareMapToRender(mapBounds);

  const pathCoords = getPathCoordsList(iterationStep);

  pathCoords.forEach(({ x, y }) => {
    mapArray[x][y] = 'x ';
  });

  renderMap(mapArray);
}

function getPathCoordsList(iterationStep: IterationStep): Coords[] {
  let coords: Coords[] = [iterationStep.coords];
  if (iterationStep.parent) {
    coords = [ ...coords, ...getPathCoordsList(iterationStep.parent) ];
  }
  return coords;
}