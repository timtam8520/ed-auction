import { User } from "../models/user";
import { getUsers } from "../resources/data";

export function validateUserCredentials(email: string, password: string): User {
  const users = getUsers();
  if (users) {
    return users.find(u => u.userEmail === email && u.password === password);
  }
  return null;
}
