import {Bounds, Coords} from "../types/coords";

export function isSameCoords(a: Coords, b: Coords): boolean {
  return a.x === b.x && a.y === b.y;
}

export const wait = (ms) => new Promise((resolve => setTimeout(() => resolve(true), ms)));

export function checkIfIsInListOfCoords(coords: Coords, coordsList: Coords[]): boolean {
  for (let i = 0; i < coordsList.length; i ++) {
    if (isSameCoords(coordsList[i], coords)) {
      return true;
    }
  }
  return false;
}

export function prepareMapToRender(mapBounds: Bounds) {
  let mapArray: string[][] = [];
  for (let x = 0; x < mapBounds.w; x ++) {
    mapArray[x] = [];
    for (let y = 0; y < mapBounds.h; y ++) {
      mapArray[x][y] = '  ';
    }
  }
  return mapArray;
}

function generateSymbols(symbol: string, amount: number) {
  if (amount < 0) {
    throw new Error('Amount is below 0');
  }
  if (amount > 100) {
    throw new Error('Amount is too big');
  }
  let result: string[] = [];
  for (let i = 0; i <= amount; i ++) {
    result.push(symbol);
  }
  return result;
}

function prettifyMap(mapArray: string[][]) {
  const rowLength = mapArray[0].length;
  const newMapArray: string[][] = [
    generateSymbols('# ', rowLength + 1),
      ...(mapArray.map(el => ['# ', ...el, '# '])),
    generateSymbols('# ', rowLength + 1),
  ];
  return newMapArray;
}

export function renderMap(mapArray: string[][]) {
  const prettifiedMap = prettifyMap(mapArray);
  console.log(
    prettifiedMap.map(x => x.join('')).join('\n'),
    '\n',
  );
}