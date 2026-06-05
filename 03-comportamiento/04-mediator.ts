/**
 * ! Patrón mediator
 * Es un patrón de diseño de comportamiento que ayuda a reducir
 * las dependencias desordenadas entre objetos.
 * Este patrón limita la comunicación directa entre ellos,
 * haciendo que solo interactúen a través de un objeto mediador.
 *
 * * Es útil reducir la complejidad de las relaciones entre objetos
 *
 * https://refactoring.guru/es/design-patterns/mediator
 */

import { COLORS } from "../helpers/colors.ts";

class ChatRoom {

  private users: User[] = [];
  public title: string;

  constructor(title: string) {
    this.title = title;
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  sendMessage(sender: User, message: string): void {

    const usersToSend = this.users.filter(user => user !== sender);

    for (const user of usersToSend) {
      user.receiveMessage(sender, message);
    }

  }

}

class User {

  private username: string;
  private chatRoom: ChatRoom;

  constructor(username: string, chatRoom: ChatRoom) {
    this.username = username;
    this.chatRoom = chatRoom;

    this.chatRoom.addUser(this);
  }

  sendMessage(message: string): void {
    console.log(`\n\n%c${this.username} sends: %c${message}`, COLORS.blue, COLORS.white);
    this.chatRoom.sendMessage(this, message);
  }

  receiveMessage(sender: User, message: string): void {
    console.log(`%c${this.username} receives from ${sender.username}: %c${message}`, COLORS.green, COLORS.white);
  }

}

function main() {

  const chatRoom = new ChatRoom("General");

  const user1 = new User("user1", chatRoom);
  const user2   = new User("user2", chatRoom);
  const user3 = new User("user3", chatRoom);

  user1.sendMessage("Hola a todos!");
  user2.sendMessage("¡Hola user1! ¿Cómo estás?");
  user3.sendMessage("¡Hola user1 y user2! ¿Qué tal?");

  console.log('\n\n');

}

main();
