function createUserManager() {
    const users = []

    return {
        addUser(user) {
            users.push(user);
        },
        getUsers() {
            return [...users];
        }
    };
}