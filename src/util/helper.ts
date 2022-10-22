import { Map } from "../map";
import * as dto from "../game";

export const formatMap = (map: Map): dto.Map => {
  const height = map.getHeight();
  const width = map.getWidth();
  const objects = new Array(height);
  for (let i = 0; i < height; i++) {
    objects[i] = new Array(width);
    for (let j = 0; j < width; j++) {
      const obj = map.getObjectAt({ x: j, y: i });
      if (obj === null) {
        continue;
      }
      objects[i][j] = obj.getType();
    }
  }

  return {
    height: map.getHeight(),
    width: map.getWidth(),
    spawnPoint: map.getSpawnPoint(),
    objects: objects,
  };
};
