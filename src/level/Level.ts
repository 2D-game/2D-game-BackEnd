import { GrayGround, GreenGround, Ground, WhiteGround } from "./Ground";
import { Player, PurplePlayer, RedPlayer, YellowPlayer } from "./Player";
import { BlackWall, BlueWall, BrownWall, Wall } from "./Wall";

export interface Level {
  createGround(): Ground;
  createWall(): Wall;
  createPlayer(): Player;
}

class FirstLevel implements Level {
  public createGround(): Ground {
    return new WhiteGround();
  }

  public createWall(): Wall {
    return new BlackWall();
  }

  public createPlayer(): Player {
    return new RedPlayer();
  }
}

class SecondLevel implements Level {
  public createGround(): Ground {
    return new GrayGround();
  }

  public createWall(): Wall {
    return new BrownWall();
  }

  public createPlayer(): Player {
    return new YellowPlayer();
  }
}

class ThirdLevel implements Level {
  public createGround(): Ground {
    return new GreenGround();
  }

  public createWall(): Wall {
    return new BlueWall();
  }

  public createPlayer(): Player {
    return new PurplePlayer();
  }
}

function clientCode(factory: Level) {
  const ground = factory.createGround();
  const wall = factory.createWall();
  const player = factory.createPlayer();

  console.log("Ground color: ", ground.getColor());
  console.log("Wall color: ", wall.getColor());
  console.log("Player color: ", player.getColor());
}
