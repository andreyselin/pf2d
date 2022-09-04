import {
  Bounds,
  Coords,
  IterationStep,
  PathFinderConfig,
  Polygon,
  PrioritizedCoords,
  StepIterationResult
} from "./types/coords";
import {checkIfIsInListOfCoords, isSameCoords} from "./utilities/misc";
import {renderObstacles} from "./utilities/renderObstacles";

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

  startCoords: Coords;
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

  getCoordsForNextIteration({ x, y }: Coords): PrioritizedCoords[] {
    const coords: PrioritizedCoords[] = [];
    const maxX = this.mapBounds.w - 1;
    const maxY = this.mapBounds.h - 1;

    if (x > 0) {
      if (y > 0) {
        coords.push({ x: x - 1, y: y - 1 });
      }
      coords.push({ x: x - 1, y, prior: true });
      if (y < maxY - 1) {
        coords.push({ x: x - 1, y: y + 1 });
      }
    }

    if (x < maxX) {
      if (y > 0) {
        coords.push({ x: x + 1, y: y - 1 });
      }
      coords.push({ x: x + 1, y, prior: true });
      if (y < maxY - 1) {
        coords.push({ x: x + 1, y: y + 1 });
      }
    }

    if (y > 0) {
      coords.push({ x, y: y - 1, prior: true });
    }
    if (y < maxY - 1) {
      coords.push({ x, y: y + 1, prior: true });
    }

    return coords;
  }

  obstacles: Coords[];
  checkIfHas2dObstacle(coords: Coords): boolean {
    return checkIfIsInListOfCoords(coords, this.obstacles);
  }

  // Todo:
  checkIfHasVectorObstacle(): boolean {
    return false;
  }

  checkIfCanMakeStep(sourceCoords: Coords, targetCoords: Coords): boolean {
    // Try to intersect polygons

    let canMakeStep = true;

    if (this.checkIfHas2dObstacle(targetCoords)) {
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
    renderObstacles(this, iterationStep);
  }

  maxGenerations = 20;
  currentGeneration = 0;
  iterateGenerationRecursively() {
    // Logic:
    const foundPath = this.iterateGeneration();

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

  findPath(startCoords: Coords, targetCoords: Coords, stepByStepMode: boolean = false) {
    this.targetCoords = targetCoords;
    this.startCoords = startCoords;
    this.lastGeneration = [{
      length: 0,
      coords: this.startCoords
    }];

    if (stepByStepMode) {
      // Allow go in manual mode allowing to do
      // whatever the developer would like to
      return;
    }

    this.iterateGenerationRecursively();
  }

  iterateSingleCell(iterationStep: IterationStep): StepIterationResult {
    const { coords, length } = iterationStep;
    const newLength = length + 1;

    // Get next coords to try to iterate on
    const rawCoords = this.getCoordsForNextIteration(coords);

    const unprocessedCoords = rawCoords
      .filter(rawCoords => !this.isProcessed(rawCoords));

    const sortedUnprocessedCoords = unprocessedCoords.sort((a, b) => {
      if (a.prior && !b.prior) {
        return -1;
      }
      if (!a.prior && b.prior) {
        return 1;
      }
      return 0;
    })

    // Try to step on coords
    const succeededCoordsList = sortedUnprocessedCoords
      .filter(targetCoords => this.checkIfCanMakeStep(coords, targetCoords))

    // Check if any of new coords reached
    for (let i = 0; i < succeededCoordsList.length; i ++) {
      // Todo: optimizable here
      if (isSameCoords(succeededCoordsList[i], this.targetCoords)) {
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
}