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
  parent?: IterationStep; // Undefined for tree top only, which is start position
  coords: Coords;
}

export type StepIterationResult = {
  foundPath?: IterationStep;
  generatedSteps: IterationStep[];
}

export type PathFinderConfig = {
  mapBounds: Bounds;
  obstacles: Coords[]
}