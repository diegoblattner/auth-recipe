// Simulation of a database
const db = {
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
