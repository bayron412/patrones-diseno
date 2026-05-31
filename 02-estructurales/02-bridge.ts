/**
 * ! Patrón Bridge
 * Este patrón nos permite desacoplar una abstracción de su implementación,
 * de tal forma que ambas puedan variar independientemente.
 *
 * * Es útil cuando se tienen múltiples implementaciones de una abstracción
 * * Se puede utilizar para separar la lógica de negocio de la lógica de presentación
 * * Se puede utilizar para separar la lógica de la interfaz de usuario también.
 *
 * https://refactoring.guru/es/design-patterns/bridge
 */

import { COLORS } from "../helpers/colors.ts";


interface Ablity {
  use(): void
}

class SwordAttack implements Ablity {

  use(): void {
    console.log(`%cSword Attack`, COLORS.blue)
  }

}

class AxeAttack implements Ablity {

  use(): void {
    console.log(`%cAxe Attack`, COLORS.blue)
  }

}


class MagicSpell implements Ablity {

  use(): void {
    console.log(`%cMagic Spell`, COLORS.green)
  }

}

class FireballSpell implements Ablity {

  use(): void {
    console.log(`%cFireball Spell`, COLORS.red)
  }

}

abstract class Character {

  protected ability: Ablity;

  constructor(ability: Ablity) {
    this.ability = ability;
  }

  setAbility(ability: Ablity): void {
    this.ability = ability;
  }

  abstract performAbility(): void;

}

class Warrior extends Character {

  override performAbility(): void {
    console.log(`\n%cWarrior is ready to fight...`, COLORS.red)
    this.ability.use();
  }

}

class Mage extends Character {

  override performAbility(): void {
    console.log(`\n%cMage preparing a magic spell...`, COLORS.yellow)
    this.ability.use();
  }

}

function main() {

  const warrior = new Warrior(new SwordAttack());
  warrior.performAbility();

  warrior.setAbility(new AxeAttack());
  warrior.performAbility();

  const mage = new Mage(new MagicSpell());
  mage.performAbility();

  mage.setAbility(new FireballSpell());
  mage.performAbility();

}

main();

