/**
 * ! Singleton:
 * Es un patrón de diseño creacional que garantiza que una clase
 * tenga una única instancia y proporciona un punto de acceso global a ella.
 *
 * * Es útil cuando necesitas controlar el acceso a una única instancia
 * * de una clase, como por ejemplo, en un objeto de base de datos o en un
 * * objeto de configuración.
 *
 * https://refactoring.guru/es/design-patterns/singleton
 */

import { COLORS } from "../helpers/colors.ts";
import { configManager } from "./singleton/config-manager.ts";

configManager.setConfig("appName", "MyApp");
configManager.setConfig("version", "1.0.0");
configManager.setConfig("apiUrl", "https://api.myapp.com");

console.log(configManager.getConfig("appName"));

console.log(configManager.getAllConfigs());

