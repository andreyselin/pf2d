import {prepareMapToRender, renderMap} from "./misc";
import {PF2D} from "../index";
import {Coords, IterationStep} from "../types/coords";

export function renderObstacles(that: PF2D, iterationStep?: IterationStep) {
  let mapArray: string[][] = prepareMapToRender(that.mapBounds);

  if (iterationStep) {
    const pathCoords = getPathCoordsList(iterationStep);
    pathCoords.forEach(({ x, y }) => mapArray[x][y] = 'x ');
  }

  that.obstacles.forEach(({x, y}) => mapArray[x][y] = '# ');

  if (that.targetCoords) {
    mapArray[that.targetCoords.x][that.targetCoords.y] = 'T ';
  }

  if (Array.isArray(that.lastGeneration)) {
    const lastGenerationCoords: Coords[] = that.lastGeneration.map(el => el.coords);
    lastGenerationCoords.forEach(({x, y}) => mapArray[x][y] = '+ ');
  }

  if (that.startCoords) {
    mapArray[that.startCoords.x][that.startCoords.y] = 'S ';
  }

  console.log('->', that.lastGeneration?.length);
  renderMap(mapArray);
}


function getPathCoordsList(iterationStep: IterationStep): Coords[] {
  let coords: Coords[] = [iterationStep.coords];
  if (iterationStep.parent) {
    coords = [ ...coords, ...getPathCoordsList(iterationStep.parent) ];
  }
  return coords;
}