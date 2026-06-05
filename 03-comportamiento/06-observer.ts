/**
 * ! Patrón Observer
 * El patrón Observer es un patrón de diseño de comportamiento que establece
 * una relación de uno a muchos entre un objeto, llamado sujeto,
 * y otros objetos, llamados observadores, que son notificados
 * y actualizados automáticamente por el sujeto
 * cuando se producen cambios en su estado.
 *
 * * Es útil cuando necesitamos que varios objetos estén
 * * pendientes de los cambios
 *
 * !No confundirlo con RXJS Observables
 *
 * https://refactoring.guru/es/design-patterns/observer
 */

import { COLORS } from '../helpers/colors.ts';

interface Observer {
  notify(videoTitle: string): void;
}

class YouTubeChannel {

  private subscribers: Observer[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  subscribe(observer: Observer, name: string): void {
    this.subscribers.push(observer);
    console.log(`%c${name} Se ha suscrito a ${this.name}`, COLORS.green);
  }

  unsubscribe(observer: Observer, name: string): void {
    console.log(`%c${name} Se ha desuscrito de ${this.name}`, COLORS.red);
    this.subscribers = this.subscribers.filter(sub => sub !== observer);
  }

  uploadVideo(videoTitle: string): void {

    console.log(`%cNuevo video subido a ${this.name}: ${videoTitle}`, COLORS.blue);

    for (const subscriber of this.subscribers) {
      subscriber.notify(videoTitle);
    }

  }

}

class Subscriber implements Observer {

  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  notify(videoTitle: string): void {
    console.log(`%c${this.name} ha sido notificado de un nuevo video: ${videoTitle}`, COLORS.yellow);
  }

}

function main() {

  const channel = new YouTubeChannel('Tech Reviews');

  const subscriber1 = new Subscriber('Subscriber1');
  const subscriber2 = new Subscriber('Subscriber2');
  const subscriber3 = new Subscriber('Subscriber3');

  channel.subscribe(subscriber1, subscriber1.getName());
  channel.subscribe(subscriber2, subscriber2.getName());

  console.log('\n');
  channel.uploadVideo('Review del nuevo smartphone');

  channel.subscribe(subscriber3, subscriber3.getName());

  console.log('\n');
  channel.uploadVideo('Comparativa de laptops');

  console.log('\n');
  channel.unsubscribe(subscriber1, subscriber1.getName());

  console.log('\n');
  channel.uploadVideo('Unboxing de la nueva laptop');

  console.log('\n');

}

main();


