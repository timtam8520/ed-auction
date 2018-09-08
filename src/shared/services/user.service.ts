import { User } from "../models/user";
import { getUsers } from "../resources/data";

export function getUserByEmail(email: string): User {
  const users = getUsers();
  return users.find(u => u.userEmail === email);
}

export function validateUserCredentials(email: string, password: string): User {
  const users = getUsers();
  return users.find(u => u.userEmail === email && u.password === password);
}
