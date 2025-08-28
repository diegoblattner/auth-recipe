// Simulation of a database
const db = {
    users: [
        { id: "1", firstName: "Test", lastName: "Login", email: "test@login.com", password: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", verified: true, roles: ["admin"] }, // password 1234
        { id: "2", firstName: "Test", lastName: "Login", email: "test2@login.com", password: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", verified: true, roles: ["marketing"] },
        { id: "3", firstName: "Test", lastName: "Login", email: "test3@login.com", password: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", verified: true, roles: ["finance"] },
        { id: "3", firstName: "Test", lastName: "Login", email: "test4@login.com", password: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", verified: true, roles: ["finance"] },
    ],
    groups: [],
    groupUsers: [],
    authTokens: [],
};
export default db;
