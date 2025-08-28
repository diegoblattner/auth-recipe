import db, {} from "../db";
import { createHash } from "node:crypto";
function hashPassword(password) {
    return createHash("sha256").update(password).digest('hex');
}
export function findUser(email, password) {
    const hashedPassword = hashPassword(password);
    const user = db.users.find((u) => u.email === email && u.password === hashedPassword);
    return user ?? null;
}
export function findUserByEmail(email) {
    const user = db.users.find((u) => u.email === email);
    return user ?? null;
}
export function createUser(user) {
    const emailExists = db.users.find((u) => user.email === u.email);
    if (emailExists)
        return { error: "email already in use" };
    const id = "new generated Id";
    const hashedPassword = hashPassword(user.password);
    const newUser = {
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
export function updatePassword(userId, newPassword) {
    const user = db.users.find((u) => u.id === userId);
    if (!user)
        return { error: "invalid user" };
    user.password = hashPassword(newPassword);
    return { data: true };
}
