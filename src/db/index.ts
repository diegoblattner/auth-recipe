// Simulation of a database

export type Role = "admin" | "finance" | "marketing" | "hr";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verified: boolean;
  roles: Role[];
};

export type Group = {
  id: string;
  name: string;
};

export type GroupUsers = {
  groupId: string;
  userId: string;
  timestamp: string;
  roles: Role[];
};

type DB = {
  users: User[];
  groups: Group[];
  groupUsers: GroupUsers[];
};

const db: DB = {
  users: [
    { id: "1", firstName: "Test", lastName: "Login", email: "test@login.com", password: "1234", verified: true, roles: ["admin"] },
    { id: "2", firstName: "Test", lastName: "Login", email: "test2@login.com", password: "1234", verified: true, roles: ["marketing"] },
    { id: "3", firstName: "Test", lastName: "Login", email: "test3@login.com", password: "1234", verified: true, roles: ["finance"] },
    { id: "3", firstName: "Test", lastName: "Login", email: "test4@login.com", password: "1234", verified: true, roles: ["finance"] },
  ],
  groups: [],
  groupUsers: [],
};

export default db;
