import {Coords} from "../types/coords";

export function generateWall(x1, y1, x2, y2): Coords[] {
  const coordsList: Coords[] = [];
  for (let x = x1; x <= x2; x ++) {
    for (let y = y1; y <= y2; y ++) {
      coordsList.push({ x, y });
    }
  }
  return coordsList;
}
