import {Coords} from "../types/coords";

export function isSameCoords(a: Coords, b: Coords): boolean {
  return a.x === b.x && a.y === b.y;
}