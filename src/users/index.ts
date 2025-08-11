import db, { type User } from "../db";
import { createHash } from "node:crypto";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest('hex');
}

export function findUser(email: string, password: string) {
  const hashedPassword = hashPassword(password);
  const user = db.users.find((u) => u.email === email && u.password === hashedPassword);
  
  return user ?? null;
}

type DataReturn<T> = {
  data?: T;
  error?: string;
}

export function createUser(user: User): DataReturn<User> {
  const emailExists = db.users.find((u) => user.email === u.email);

  if (emailExists) return { error: "email already in use" };

  const id = "new generated Id";
  const hashedPassword = hashPassword(user.password);

  const newUser: User = {
    ...user,
    id,
    password: hashedPassword,
    roles: [],
    verified: false,
  };

  db.users.push(newUser);

  return {
    data: newUser,
  };
}
