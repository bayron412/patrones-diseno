/**
 * ! Factory Function
 * Es un patrón de diseño que nos permite crear objetos o funciones de manera dinámica que serán
 * usados posteriormente en el código.
 *
 * * Es útil cuando necesitamos crear objetos o funciones de manera dinámica,
 * * es decir, en tiempo de ejecución y no en tiempo de compilación.
 */

// types.ts
interface User {
  id: number;
  name: string;
  role: "admin" | "driver" | "operator";
  active: boolean;
  getDisplayName(): string;
}

function createUser(
  id: number,
  name: string,
  role: "admin" | "driver" | "operator"
): User {
  return {
    id,
    name,
    role,
    active: true,
    getDisplayName() {
      return `${name} (${role})`;
    },
  };
}

function createAdminUser(id: number, name: string): User {
  return {
    ...createUser(id, name, "admin"),
    active: true,
  };
}

function createDriverUser(id: number, name: string): User {
  return {
    ...createUser(id, name, "driver"),
    active: false, // drivers start inactive until verified
  };
}

const admin  = createAdminUser(1, "Carlos");
const driver = createDriverUser(2, "Ana");
const op = createUser(3, "Luis", "operator");

console.log(admin.getDisplayName());  // Carlos (admin)
console.log(driver.getDisplayName()); // Ana (driver)
console.log(op.getDisplayName());     // Luis (operator)

console.log(`Admin Is Active: `, admin.active);  // true
console.log(`Driver Is Active: `, driver.active); // false ← drivers start inactive
