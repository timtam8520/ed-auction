import { users } from "../resources/data";
import { User } from "../models/user";

export function getUserByEmail(email: string): User {
  return users.find(u => u.userEmail === email);
}

export function validateUserCredentials(email: string, password: string): User {
  return users.find(u => u.userEmail === email && u.password === password);
}
