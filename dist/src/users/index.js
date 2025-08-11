import db, {} from "../db";
function hashPassword(password) {
    // TODO implement a hash functionality
    return password.split("").reverse().join("");
}
export function findUser(email, password) {
    const hashedPassword = hashPassword(password);
    const user = db.users.find((u) => u.email === email && u.password === hashedPassword);
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
