/**
 * ! Patrón decorador
 * Es un patrón de diseño estructural que permite añadir
 * funcionalidades a objetos, colocando estos objetos dentro de
 * objetos encapsuladores especiales que contienen estas funcionalidades.
 *
 * No confundirlo con los decoradores de TypeScript que son anotaciones.
 *
 * * Es útil cuando necesitas añadir funcionalidades a objetos
 *  * de manera dinámica y flexible.
 *
 * https://refactoring.guru/es/design-patterns/decorator
 */

import { COLORS } from '../helpers/colors.ts';

interface Notification {
  send(message: string): void;
}

class BasicNotification implements Notification {

  send(message: string): void {
    console.log(`Send Basic Notification: %c${message}`, COLORS.blue);
  }

}

// Clase decoradora abstracta

abstract class NotificationDecorator implements Notification {

  protected notification: Notification;

  constructor(notification: Notification) {
    this.notification = notification;
  }

  send(message: string): void {
    this.notification.send(message);
  }

}


// Decoradores concretos
class EmailDecorator extends NotificationDecorator {

  private sendEmail(message: string): void {
    console.log(`Send Email Notification: %c${message}`, COLORS.orange);
  }

  override send(message: string): void {
    super.send(message);
    this.sendEmail(message);
  }

}

class SMSDecorator extends NotificationDecorator {

  private sendSMS(message: string): void {
    console.log(`Send SMS Notification: %c${message}`, COLORS.green);
  }

  override send(message: string): void {
    super.send(message);
    this.sendSMS(message);
  }

}

function main() {

  let notification: Notification = new BasicNotification();

  notification = new EmailDecorator(notification);
  notification = new SMSDecorator(notification);

  notification.send('Message to Basic Notification');
  
}

main();
