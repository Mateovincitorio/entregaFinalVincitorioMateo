import { faker } from "@faker-js/faker";
faker.locale = "es";

const createMockUser = () => {
  const roles = ["USER", "ADMIN", "PREM"];
  const first_name = faker.internet.username().toLowerCase();
  const last_name = faker.person.lastName;
  const email = first_name + "@coder.com.ar";
  const password = "hola1234";
  const age = faker.number.int({ min: 1, max: 50 });
  const rol = roles[faker.number.int({ min: 0, max: 2 })];
  return { first_name, email, password, rol, age, last_name };
};

export default createMockUser;
