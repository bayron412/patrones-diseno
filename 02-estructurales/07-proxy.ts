/**
 * ! Patrón Proxy
 * Este patrón se utiliza para controlar el acceso a un objeto, es decir,
 * se crea un objeto que actúa como intermediario entre el cliente y el objeto real.
 *
 * * Es útil cuando necesitamos controlar el acceso a un objeto,
 * * por ejemplo, para verificar si el cliente tiene permiso
 * * para acceder a ciertos métodos o propiedades.
 *
 * https://refactoring.guru/es/design-patterns/proxy
 *
 */

import { COLORS } from '../helpers/colors.ts';

class Player {

  name: string;
  level: number;

  constructor(name: string, level: number) {
    this.name = name;
    this.level = level;
  }

}

interface Room {
  enter(player: Player): void;
}

class SecretRoom implements Room {

  enter(player: Player): void {
    console.log(`%cWelcome ${player.name} to the secret room`, COLORS.blue);
    console.log(`%cA Great Enemy Awaits You`, COLORS.red);
  }

}

// Proxy
class MagicPortal implements Room {

  private secretRoom: Room;

  constructor(room: Room) {
    this.secretRoom = room;
  }

  enter(player: Player): void {

    if (player.level < 10) {
      console.log(`%cYou can't enter the secret room`, COLORS.red);
      return;
    }

    this.secretRoom.enter(player);

  }

}

function main() {

  const portal = new MagicPortal(new SecretRoom());

  const player1 = new Player('Bayron', 5);
  const player2 = new Player('Laura', 12);

  console.log(`1. ${player1.name} (${player1.level}) tries to enter the secret room`);
  portal.enter(player1);

  console.log(`---------------`);

  console.log(`2. ${player2.name} (${player2.level}) tries to enter the secret room`);
  portal.enter(player2);

}


main();