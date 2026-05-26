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

/**
 * 	!Descripción:
  1.	Completen las clases SalesReport e InventoryReport para implementar
      la interfaz Report, generando el contenido de cada reporte en el método generate.

  2.	Implementen las clases SalesReportFactory e InventoryReportFactory
      para crear instancias de SalesReport y InventoryReport, respectivamente.

	3.	Prueben el programa generando diferentes tipos de reportes usando
      el prompt para seleccionar el tipo de reporte.
 */

type ReportType = "sales" | "inventory";

// 1. Definir la interfaz Report
interface Report {
  generate(): void;
}

// 2. Clases concretas de Reportes
// Implementar SalesReport e InventoryReport

class SalesReport implements Report {
  generate(): void {
    console.log("Generando reporte de ventas...");
  }
}

class InventoryReport implements Report {
  generate(): void {
    console.log("Generando reporte de inventario...");
  }
}

// 3. Clase Base ReportFactory con el Método Factory
class ReportFactory {
  static create(type: ReportType): Report {
    const reports: Record<ReportType, Report> = {
      sales: new SalesReport(),
      inventory: new InventoryReport(),
    };

    const report = reports[type];

    if (!report) throw new Error("Tipo de reporte no válido");

    return report;
  }
}

function main() {
  const reportType = prompt("¿Qué tipo de reporte deseas? %c(sales/inventory)");
  const report = ReportFactory.create(reportType as ReportType);

  report.generate();
}

main();
