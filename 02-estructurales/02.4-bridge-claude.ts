/**
 * ! Patrón Bridge
 * Este patrón nos permite desacoplar una abstracción de su implementación,
 * de tal forma que ambas puedan variar independientemente.
 *
 * * Es útil cuando se tienen múltiples implementaciones de una abstracción
 * * Se puede utilizar para separar la lógica de negocio de la lógica de presentación
 * * Se puede utilizar para separar la lógica de la interfaz de usuario también.
 *
 */

import { COLORS } from '../helpers/colors.ts';


// types.ts
// dimensión 1 — cómo se exporta el reporte
interface ReportExporter {
  export(data: Record<string, unknown>[]): string;
}

// dimensión 2 — cómo se envía el reporte
interface ReportSender {
  send(to: string, content: string): Promise<void>;
}

// exporters/pdf.exporter.ts
class PdfExporter implements ReportExporter {
  export(data: Record<string, unknown>[]): string {
    return `PDF with ${data.length} rows generated`;
  }
}

// exporters/excel.exporter.ts
class ExcelExporter implements ReportExporter {
  export(data: Record<string, unknown>[]): string {
    return `Excel with ${data.length} rows generated`;
  }
}

// exporters/csv.exporter.ts
class CsvExporter implements ReportExporter {
  export(data: Record<string, unknown>[]): string {
    return `CSV with ${data.length} rows generated`;
  }
}

// senders/email.sender.ts
class EmailSender implements ReportSender {
  async send(to: string, content: string): Promise<void> {
    console.log(`📧 Email to ${to}: ${content}`);
  }
}

// senders/slack.sender.ts
class SlackSender implements ReportSender {
  async send(to: string, content: string): Promise<void> {
    console.log(`💬 Slack to ${to}: ${content}`);
  }
}

// senders/whatsapp.sender.ts
class WhatsAppSender implements ReportSender {
  async send(to: string, content: string): Promise<void> {
    console.log(`📱 WhatsApp to ${to}: ${content}`);
  }
}

// report.ts — el puente que conecta ambas dimensiones
class Report {

  constructor(
    public exporter: ReportExporter,
    public sender: ReportSender
  ) { }

  async generate(to: string, data: Record<string, unknown>[]): Promise<void> {
    const content = this.exporter.export(data);
    await this.sender.send(to, content);
  }
}

// usage.ts — combinas libremente sin nuevas clases
const data = [{ id: 1, total: 100 }, { id: 2, total: 200 }];

const pdfEmail = new Report(new PdfExporter(), new EmailSender());
const excelSlack = new Report(new ExcelExporter(), new SlackSender());
const csvWhatsApp = new Report(new CsvExporter(), new WhatsAppSender());

await pdfEmail.generate("user@company.com", data);
// 📧 Email to user@company.com: PDF with 2 rows generated

await excelSlack.generate("#reports-channel", data);
// 💬 Slack to #reports-channel: Excel with 2 rows generated

await csvWhatsApp.generate("+573001234567", data);
// 📱 WhatsApp to +573001234567: CSV with 2 rows generated

