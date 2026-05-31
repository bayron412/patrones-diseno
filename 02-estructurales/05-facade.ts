/**
 * ! Patrón Facade
 * Este patrón proporciona una interfaz unificada para un conjunto de interfaces
 * en un subsistema.
 *
 * Facade define una interfaz de nivel más alto que hace que el subsistema
 * sea más fácil de usar.
 *
 * * Es útil cuando un subsistema es complejo o difícil de entender para
 * * proporcionar una interfaz simplificada para el cliente.
 *
 * https://refactoring.guru/es/design-patterns/facade
 */

import { COLORS } from '../helpers/colors.ts';

class Projector {
  turnOn() {
    console.log('Projector is turned on');
  }

  turnOff() {
    console.log('Projector is turned off');
  }

}

class SoundSystem {
  on() {
    console.log('Sound system is on');
  }

  off() {
    console.log('Sound system is off');
  }

}

class VideoPlayer {

  on() {
    console.log('Video player is on');
  }

  play(movie: string) {
    console.log(`Playing movie: %c${movie}`, COLORS.green);
  }

  stop() {
    console.log('Movie is stopped');
  }

  off() {
    console.log('Video player is off');
  }

}

class PopcornMarker {

  poppingPopcorn() {
    console.log(`Makeing popcorn!`);
  }

  turnOffPopcorn() {
    console.log(`Popcorn maker is off!`);
  }

}

interface IHomeTheaterFacadeOptions {
  projector: Projector;
  soundSystem: SoundSystem;
  videoPlayer: VideoPlayer;
  popcornMarker: PopcornMarker;
}

class HomeTheaterFacade {
  
  private projector: Projector;
  private soundSystem: SoundSystem;
  private videoPlayer: VideoPlayer;
  private popcornMarker: PopcornMarker;

  constructor({
    projector,
    soundSystem,
    videoPlayer,
    popcornMarker
  }: IHomeTheaterFacadeOptions) {

    this.projector = projector;
    this.soundSystem = soundSystem;
    this.videoPlayer = videoPlayer;
    this.popcornMarker = popcornMarker;

  }

  watchMovie(movie: string): void {

    console.log(`%cGet ready to watch a movie!`, COLORS.blue);

    this.projector.turnOn();
    this.soundSystem.on();
    this.videoPlayer.on();
    this.popcornMarker.poppingPopcorn();
    this.videoPlayer.play(movie);

    console.log(`%cEnjoy the movie!`, COLORS.green);

  }

  endMovie(): void {

    console.log(`%cTime to turn off the theater!`, COLORS.red);

    this.projector.turnOff();
    this.soundSystem.off();
    this.videoPlayer.off();
    this.popcornMarker.turnOffPopcorn();
    this.videoPlayer.stop();

    console.log(`%cMovie ended!`, COLORS.red);

  }

}

function main() {

  const homeTheaterFacade = new HomeTheaterFacade({
    projector: new Projector(),
    soundSystem: new SoundSystem(),
    videoPlayer: new VideoPlayer(),
    popcornMarker: new PopcornMarker()
  });

  homeTheaterFacade.watchMovie('The Matrix');

  setTimeout(() => {
    homeTheaterFacade.endMovie();
  }, 3000);

}


main();