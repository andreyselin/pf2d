import {prepareMapToRender, renderMap} from "./misc";
import {PF2D} from "../index";
import {Coords} from "../types/coords";

export function renderObstacles(this: PF2D) {
  let mapArray: string[][] = prepareMapToRender(this.mapBounds);

  this.obstacles.forEach(({x, y}) => {
    mapArray[x][y] = '# ';
  });

  if (this.targetCoords) {
    mapArray[this.targetCoords.x][this.targetCoords.y] = 'T ';
  }

  if (Array.isArray(this.lastGeneration)) {
    const lastGenerationCoords: Coords[] = this.lastGeneration.map(el => el.coords);
    lastGenerationCoords.forEach(({x, y}) => {
      mapArray[x][y] = '+ ';
    });
  }

  if (this.startCoords) {
    mapArray[this.startCoords.x][this.startCoords.y] = 'S ';
  }

  console.log('->', this.lastGeneration?.length);
  renderMap(mapArray);
}