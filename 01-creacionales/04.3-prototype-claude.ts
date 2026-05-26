/**
 * ! Patrón Prototype:
 */

interface Cloneable<T> {
  clone(): T;
}

interface ReportConfig {
  titulo: string;
  filtros: Record<string, unknown>;
  columnas: string[];
  formato: {
    moneda: string;
    timezone: string;
    decimales: number;
  };
}

class ReportTemplate implements Cloneable<ReportTemplate> {
  constructor(public config: ReportConfig) {}

  clone(): ReportTemplate {
    return new ReportTemplate(structuredClone(this.config));
  }

  setTitulo(titulo: string): this {
    this.config.titulo = titulo;
    return this;
  }

  addFiltro(key: string, value: unknown): this {
    this.config.filtros[key] = value;
    return this;
  }

  addColumna(columna: string): this {
    this.config.columnas.push(columna);
    return this;
  }

  getConfig(): ReportConfig {
    return structuredClone(this.config);
  }
}

class ReportRegistry {
  private templates = new Map<string, ReportTemplate>();

  register(name: string, template: ReportTemplate): void {
    this.templates.set(name, template);
  }

  get(name: string): ReportTemplate {
    const template = this.templates.get(name);
    if (!template) throw new Error(`Template "${name}" no existe`);
    return template.clone(); // siempre entrega una copia
  }
}

const registry = new ReportRegistry();

// prototipo base de ventas
const ventasBase = new ReportTemplate({
  titulo: "Reporte Base",
  filtros: { activo: true, moneda: "COP" },
  columnas: ["id", "fecha", "total", "estado"],
  formato: { moneda: "COP", timezone: "America/Bogota", decimales: 2 },
});

registry.register("ventas", ventasBase);

const reporteMensual = registry.get("ventas")
  .setTitulo("Ventas Mensual")
  .addFiltro("mes", "2024-01")
  .addColumna("vendedor");

const reporteAnual = registry.get("ventas")
  .setTitulo("Ventas Anual")
  .addFiltro("año", "2024")
  .addColumna("region")
  .addColumna("canal");

const reporteExportacion = registry.get("ventas")
  .setTitulo("Ventas Exportación")
  .addFiltro("tipo", "exportacion");

console.log(ventasBase.getConfig());
console.log(reporteMensual.getConfig());
console.log(reporteAnual.getConfig());
console.log(reporteExportacion.getConfig());
