/**
 * ! Singleton:
 * Es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia y proporciona un punto de acceso global a ella.
 *
 * * Es útil cuando necesitas controlar el acceso a una única instancia
 * * de una clase, como por ejemplo, en un objeto de base de datos o en un
 * * objeto de configuración.
 *
 * https://refactoring.guru/es/design-patterns/singleton
 */

class DragonBalls {
  static instance: DragonBalls;

  private ballsCollected: number = 0;

  private constructor() {
    this.ballsCollected = 0;
  }

  public static getInstance(): DragonBalls {
    if (!DragonBalls.instance) {
      DragonBalls.instance = new DragonBalls();
    }

    return DragonBalls.instance;
  }

  collectBall(): void {
    if (this.ballsCollected < 7) {
      this.ballsCollected++;
      console.log(
        `¡Has recogido la bola del dragón número ${this.ballsCollected}!`,
      );
      return;
    }

    console.log(
      "¡Ya has recogido las 7 bolas del dragón! Invoca a Shenlong para pedir tu deseo.",
    );
  }

  summonShenlong(): void {
    if (this.ballsCollected === 7) {
      console.log("¡Has invocado a Shenlong! ¿Cuál es tu deseo?");
      this.ballsCollected = 0; // Reiniciar las bolas después de invocar a Shenlong
      return;
    }

    console.log(
      `Aún te faltan ${
        7 - this.ballsCollected
      } bolas del dragón para invocar a Shenlong.`,
    );
  }
}

function main() {
  const gokuDragonBalls = DragonBalls.getInstance();

  gokuDragonBalls.collectBall();
  gokuDragonBalls.collectBall();
  gokuDragonBalls.collectBall();

  gokuDragonBalls.summonShenlong();

  const vegetaDragonBalls = DragonBalls.getInstance();

  vegetaDragonBalls.collectBall();
  vegetaDragonBalls.collectBall();
  vegetaDragonBalls.collectBall();
  vegetaDragonBalls.collectBall();

  gokuDragonBalls.summonShenlong();
  vegetaDragonBalls.summonShenlong();
}

main();
