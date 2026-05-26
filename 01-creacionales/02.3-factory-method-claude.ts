/**
 * ! Factory Method:
 * El patrón Factory Method permite crear objetos sin especificar
 * la clase exacta del objeto que se creará.
 *
 * En lugar de eso, delegamos la creación de objetos a subclases o métodos
 * que encapsulan esta lógica.
 *
 * * Es útil cuando una clase no puede anticipar la clase
 * * de objetos que debe crear.
 *
 * https://refactoring.guru/es/design-patterns/factory-method
 */

type NotifierType = "email" | "sms" | "push" | "whatsapp";

// 1. Interfaz común — todos los notifiers hablan el mismo idioma
interface Notifier {
  send(to: string, message: string): void;
}

// 2. Implementaciones concretas
class EmailNotifier implements Notifier {
  send(to: string, message: string): void {
    console.log(`📧 Email a ${to}: ${message}`);
  }
}

class SmsNotifier implements Notifier {
  send(to: string, message: string): void {
    console.log(`📱 SMS a ${to}: ${message}`);
  }
}

class PushNotifier implements Notifier {
  send(to: string, message: string): void {
    console.log(`🔔 Push a ${to}: ${message}`);
  }
}

class WhatsAppNotifier implements Notifier {
  send(to: string, message: string): void {
    console.log(`💬 WhatsApp a ${to}: ${message}`);
  }
}

// 3. La Factory — un solo lugar donde se decide qué crear
class NotifierFactory {
  static create(type: NotifierType): Notifier {
    const notifiers: Record<NotifierType, Notifier> = {
      email: new EmailNotifier(),
      sms: new SmsNotifier(),
      push: new PushNotifier(),
      whatsapp: new WhatsAppNotifier(),
    };

    const notifier = notifiers[type];

    if (!notifier) throw new Error(`Notifier desconocido: ${type}`);

    return notifier;
  }
}

// 4. Uso — el cliente no sabe qué clase se instancia
const emailNotifier = NotifierFactory.create("email");
emailNotifier.send("user@example.com", "Tu pedido llegó");

const smsNotifier = NotifierFactory.create("sms");
smsNotifier.send("+573001234567", "Tu pedido llegó");

const pushNotifier = NotifierFactory.create("push");
pushNotifier.send("user@example.com", "Tu pedido llegó");

const whatsappNotifier = NotifierFactory.create("whatsapp");
whatsappNotifier.send("+573001234567", "Tu pedido llegó");
