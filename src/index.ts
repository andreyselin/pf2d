import {Bounds, Coords, IterationStep, PathFinderConfig, Polygon, StepIterationResult} from "./types/coords";
import {isSameCoords} from "./utilities/misc";

export class PF2D {

  constructor({ mapBounds, obstacles }: PathFinderConfig) {
    this.mapBounds = mapBounds;
    this.processed = [];
    this.obstacles = obstacles;
  }

  processed: boolean[][];
  isProcessed(coords: Coords): boolean | undefined {
    return this.processed[coords.x]?.[coords.y];
  }

  targetCoords: Coords;

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

  obstacles: Coords[];
  checkIfHas2dObstacle(coords: Coords): boolean {
    for (let i = 0; i < this.obstacles.length; i ++) {
      if (isSameCoords(this.obstacles[i], coords)) {
        return true;
      }
    }
    return false;
  }

  // Todo:
  checkIfHasVectorObstacle(): boolean {
    return false;
  }

  checkIfCanMakeStep(sourceCoords: Coords, targetCoords: Coords): boolean {
    // Try to intersect polygons

    let canMakeStep = true;

    if (this.checkIfHas2dObstacle(targetCoords)) {
      console.log('obstacle:', targetCoords)
      canMakeStep = false;
    }

    return canMakeStep;
  }


  iterateGeneration(): IterationStep {
    let foundPathOnGenerationLevel: IterationStep;

    const newGeneration: IterationStep[] = this.lastGeneration
      .reduce((acc, iterationStep) => {
        const { foundPath, generatedSteps } = this.iterateSingleCell(iterationStep);

        if (foundPath) {
          foundPathOnGenerationLevel = foundPath;
        }

        return [ ...acc, ...generatedSteps ];
      }, [] as IterationStep[]);

    this.lastGeneration = newGeneration;

    return foundPathOnGenerationLevel;
  }

  onPathFound(iterationStep: IterationStep) {
    console.log('!!! Found path !!!\n', iterationStep.length);
  }

  maxGenerations = 5;
  currentGeneration = 0;
  iterateGenerationRecursively() {
    // Logic:
    const foundPath = this.iterateGeneration();
    pathFinder.renderLastGeneration();

    if (foundPath) {
      this.processed.length = 0;
      this.onPathFound(foundPath);
      return;
    }

    // Todo: onUnableToFindPath

    // Recursive logic
    this.currentGeneration ++;
    const shouldStopRecursion = this.currentGeneration === this.maxGenerations;
    if (shouldStopRecursion) {
      return;
    }

    this.iterateGenerationRecursively();
  }

  // debug1() {
  //   this.lastGeneration = [
  //     { length: 1, coords: { x: 5, y: 5 } },
  //     { length: 1, coords: { x: 6, y: 5 } },
  //   ];
  //   this.iterateGeneration();
  //   this.iterateGeneration();
  //   this.iterateGeneration();
  //   this.iterateGeneration();
  // }

  findPath(startCoords: Coords, targetCoords: Coords) {
    this.targetCoords = targetCoords;
    this.lastGeneration = [{
      length: 0,
      coords: startCoords
    }];
    this.iterateGenerationRecursively();
  }

  iterateSingleCell(iterationStep: IterationStep): StepIterationResult {
    const { coords, length } = iterationStep;
    const newLength = length + 1;

    // Get next coords to try to iterate on
    const rawCoords = this.getCoordsForNextIteration(coords);

    const unprocessedCoords = rawCoords
      .filter(rawCoords => !this.isProcessed(rawCoords));

    // Try to step on coords
    const succeededCoordsList = unprocessedCoords
      .filter(targetCoords => this.checkIfCanMakeStep(coords, targetCoords))

    // Check if any of new coords reached
      console.log('Step starts', coords);
    for (let i = 0; i < succeededCoordsList.length; i ++) {
      // Todo: optimizable here
      console.log('>', i, '/', succeededCoordsList[i]);
      if (isSameCoords(succeededCoordsList[i], this.targetCoords)) {
        console.log('Found');
        return {
          foundPath: this.createIterationStep(succeededCoordsList[i], newLength, iterationStep),
          generatedSteps: [],
        }
      }
    }

    this.markProcessed(coords);
    succeededCoordsList.forEach(succeededCoords => this.markProcessed(succeededCoords));

    // const generatedSteps: IterationStep[] = succeededCoordsList.map(succeededCoords => ({
    //   coords: succeededCoords,
    //   parent: iterationStep,
    //   length: newLength,
    // }));

    const generatedSteps: IterationStep[] = succeededCoordsList
      .map(succeededCoords => this.createIterationStep(succeededCoords, newLength, iterationStep));

    return {
      generatedSteps,
    }
  }

  createIterationStep(coords: Coords, length: number, parent?: IterationStep): IterationStep {
    return { coords, parent, length };
  }

  renderLastGeneration() {
    let result = '';
    for (let x = 0; x < this.mapBounds.w; x ++) {
      for (let y = 0; y < this.mapBounds.h; y ++) {
        const iterationCoords = { x, y };

        const lastGenerationCount = this.lastGeneration
          .filter(({ coords }) => isSameCoords(coords, iterationCoords))
          .length;

        const isTargetCoords = isSameCoords(this.targetCoords, iterationCoords);

        const isObstacleCoords = this.checkIfHas2dObstacle(iterationCoords);

        let toRender = '-';

        if (lastGenerationCount > 0) {
          toRender = '0'
        }

        if (isTargetCoords) {
          toRender = 't'
        }

        if (isObstacleCoords) {
          toRender = '^'
        }

        result += toRender;
      }
      result += '\n';
    }
    console.log(result);
  }
}

const pathFinderConfig: PathFinderConfig = {
  mapBounds: { w: 10, h: 10 },
  obstacles: [
    { x: 2, y: 5 },
    { x: 3, y: 5 },
    { x: 4, y: 5 },
    { x: 5, y: 5 },
    { x: 6, y: 5 },
    { x: 7, y: 5 },
    { x: 8, y: 5 },
  ]
}

const pathFinder = new PF2D(pathFinderConfig);

pathFinder.findPath({ x: 4, y: 3 }, { x: 5, y: 6 });
// pathFinder.debug1();
