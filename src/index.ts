import {Bounds, Coords, IterationStep, Polygon} from "./types/coords";

export class PF2D {

  constructor(mapBounds: Bounds) {
    this.mapBounds = mapBounds;
    this.processed = [];
  }

  processed: boolean[][];
  isProcessed(coords: Coords): boolean | undefined {
    return this.processed[coords.x]?.[coords.y];
  }

  // Only these steps are used to check achievement:
  lastGeneration: IterationStep[];

  markProcessed(coords: Coords) {
    if (!Array.isArray(this.processed[coords.x])) {
      this.processed[coords.x] = [];
    }
    this.processed[coords.x][coords.y] = true;
  }

  mapBounds: Bounds;

  init(
    start: Coords,
    finish: Coords,
    polygons: Polygon,
    stepSize: number,
  ) {
    // Prepare 2d array according to stepSize
    // Prepare array for marking processed coords

    // Initiate iteration
    //
  }

  getCoordsForNextIteration({ x, y }: Coords): Coords[] {
    const coords: Coords[] = [];
    if (x > 0) {
      if (y > 0) {
        coords.push({ x: x - 1, y: y - 1 })
      }
      coords.push({ x: x - 1, y })
      if (y < this.mapBounds.h) {
        coords.push({ x: x - 1, y: y + 1 })
      }
    }

    if (x < this.mapBounds.w) {
      if (y > 0) {
        coords.push({ x: x + 1, y: y - 1 })
      }
      coords.push({ x: x + 1, y })
      if (y < this.mapBounds.h) {
        coords.push({ x: x + 1, y: y + 1 })
      }
    }

    if (y > 0) {
      coords.push({ x, y: y - 1 })
    }
    if (y < this.mapBounds.h) {
      coords.push({ x, y: y + 1 })
    }

    return coords;
  }

  checkIfCanMakeStep(sourceCoords: Coords, targetCoords: Coords): boolean {
    // Try to intersect polygons
     return true;
  }


  iterateGeneration() {
    const newGeneration: IterationStep[] = this.lastGeneration
      .reduce((acc, iterationStep) => {
        const stepIterationResult = this.iterateSingleCell(iterationStep);
        return [ ...acc, ...stepIterationResult ];
      }, [] as IterationStep[]);

    this.lastGeneration = newGeneration;

    // Is it correct place to mark processed?
    // this.lastGeneration.forEach(el => this.markProcessed(el.coords));
  }

  maxGenerations = 5;
  currentGeneration = 0;
  iterateGenerationRecursively() {
    //
  }

  debug1() {
    this.lastGeneration = [
      { length: 1, coords: { x: 5, y: 5 } },
      { length: 1, coords: { x: 6, y: 5 } },
    ];
    this.iterateGeneration();
    this.iterateGeneration();
    this.iterateGeneration();
    pathFinder.renderLastGeneration();
  }

  findPath(startCoords: Coords /* Todo */) {
    this.lastGeneration = [{
      length: 0,
      coords: startCoords
    }];
    this.iterateGeneration();
    console.log('1)', this.lastGeneration.length);
    this.iterateGeneration();
    console.log('2)', this.lastGeneration.length);
    // this.iterateGeneration();
    // console.log('3)', this.lastGeneration.length);
    // this.iterateGeneration();
    // console.log('4)', this.lastGeneration.length);
    // this.iterateGeneration();
    // console.log('5)', this.lastGeneration.length);
    // this.iterateGeneration();
    // console.log('6)', this.lastGeneration.length);
  }

  iterateSingleCell({ coords, length }: IterationStep): IterationStep[] {
    // Get next coords to try to iterate on
    const rawCoords = this.getCoordsForNextIteration(coords);

    const unprocessedCoords = rawCoords
      .filter(rawCoords => !this.isProcessed(rawCoords));

    // console.log('unprocessedCoords', unprocessedCoords);

    // Try to step on coords
    const succeededCoordsList = unprocessedCoords
      .filter(targetCoords => this.checkIfCanMakeStep(coords, targetCoords))

    this.markProcessed(coords);
    succeededCoordsList.forEach(succeededCoords => this.markProcessed(succeededCoords));

    const newLength = length + 1;

    return succeededCoordsList.map(succeededCoords => ({
      coords: succeededCoords,
      length: newLength,
    }));
  }

  renderLastGeneration() {
    // console.log('this.lastGeneration', this.lastGeneration);

    let result = '';
    for (let x = 0; x < this.mapBounds.w; x ++) {
      for (let y = 0; y < this.mapBounds.h; y ++) {
        const lastGenerationCount = this.lastGeneration
          .filter(({ coords }) => coords.x === x && coords.y === y)
          .length;
        result += lastGenerationCount > 0 ? `${lastGenerationCount}` : '-';
      }
      result += '\n';
    }
    console.log(result);
  }
}

const pathFinder = new PF2D({ w: 10, h: 10 });

// pathFinder.findPath({ x: 5, y: 5 });
pathFinder.debug1();
