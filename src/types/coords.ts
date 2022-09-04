export type Coords = {
  x: number;
  y: number;
}

export type Bounds = {
  w: number;
  h: number;
}

export type Polygon = {
  coords: Coords[];
}

export type IterationStep = {
  length: number;
  coords: Coords;
}