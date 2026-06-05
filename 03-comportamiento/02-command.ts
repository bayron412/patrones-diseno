/**
 * ! Patrón Command
 * Este patrón encapsula una solicitud como un objeto,
 * lo que le permite parametrizar otros objetos con diferentes solicitudes,
 * encolar solicitudes, o registrar solicitudes, y soporta operaciones que pueden deshacerse.
 *
 * Me gustó mucho la explicación de Refactoring Guru
 * https://refactoring.guru/es/design-patterns/command
 *
 * * Es útil cuando se necesita desacoplar el objeto que invoca
 * * la operación del objeto que sabe cómo realizarla.
 *
 *
 */

import { COLORS } from '../helpers/colors.ts';

interface Command {
  execute(): void;
}

class Light {

  turnOn() {
    console.log('%cLight: Turned On', COLORS.yellow);
  }

  turnOff() {
    console.log('%cLight: Turned Off', COLORS.yellow);
  }

}

class Fan {

  on() {
    console.log('%cFan: Turned On', COLORS.green);
  }

  off() {
    console.log('%cFan: Turned Off', COLORS.green);
  }

}

// comando para encender la luz
class LightOnCommand implements Command {

  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn();
  }

}

class LightOffCommand implements Command {

  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOff();
  }

}

// comando para encender el ventilador
class FanOnCommand implements Command {

  constructor(private fan: Fan) {}

  execute(): void {
    this.fan.on();
  }

}

class FanOffCommand implements Command {

  constructor(private fan: Fan) {}

  execute(): void {
    this.fan.off();
  }

}

class RemoteControl {

  private commands: Record<string, Command> = {};

  setCommand(button: string, command: Command) {
    this.commands[button] = command;
  }

  pressButton(button: string) {

    const command = this.commands[button];

    if (command) {
      command.execute();
    }
    else {
      console.log(`No command assigned to button ${button}`, COLORS.red);
    }

  }

}

function main() {

  const remoteControl = new RemoteControl();

  const light = new Light();
  const fan = new Fan();

  const lightOnCommand = new LightOnCommand(light);
  const lightOffCommand = new LightOffCommand(light);

  const fanOnCommand = new FanOnCommand(fan);
  const fanOffCommand = new FanOffCommand(fan);

  remoteControl.setCommand('1', lightOnCommand);
  remoteControl.setCommand('2', lightOffCommand);
  remoteControl.setCommand('3', fanOnCommand);
  remoteControl.setCommand('4', fanOffCommand);

  let continueProgram = true;

  do {

    const pressedButton = prompt(`
      press button:
      1: Light On
      2: Light Off
      3: Fan On
      4: Fan Off
      q: Quit
    `) ?? '';

    console.clear();

    if (pressedButton === 'q') {
      continueProgram = false;
    }
    else {
      remoteControl.pressButton(pressedButton || '');
    }

  } while (continueProgram);

}

main();
