import {IterationStep, PathFinderConfig} from "../types/coords";
import {PF2D} from "../index";
import {generateWall} from "../utilities/generateWall";
import {renderObstacles} from "../utilities/renderObstacles";
import {wait} from "../utilities/misc";
import {renderPath} from "../utilities/renderPath";

const pathFinderConfig: PathFinderConfig = {
  mapBounds: { w: 11, h: 15 },
  obstacles: [
    ...generateWall(3, 0, 3, 11),
    ...generateWall(7, 4, 7, 14),
  ]
}

async function runTest() {
  const pathFinder = new PF2D(pathFinderConfig);

  const ms = 300;

  await wait(1000);
  renderObstacles.bind(pathFinder)();

  await wait(1000);
  pathFinder.findPath({ x: 1, y: 1 }, { x: 9, y: 13 }, true);
  renderObstacles.bind(pathFinder)();

  //

  let foundPathOnGenerationLevel: IterationStep;

  for (let i = 0; i < 50; i ++) {
    await wait(ms);
    foundPathOnGenerationLevel = pathFinder.iterateGeneration();
    console.log('Iteration:', i, foundPathOnGenerationLevel ? '(Found)' : '');
    renderObstacles.bind(pathFinder)();
    if (foundPathOnGenerationLevel) {
      break;
    }
  }

  renderPath(pathFinder.mapBounds, foundPathOnGenerationLevel);

}

runTest();
