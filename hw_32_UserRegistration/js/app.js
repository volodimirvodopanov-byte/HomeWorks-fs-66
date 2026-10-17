const userManager = createUserManager();
const nameInput = document.querySelector("#nameInput");
const ageInput = document.querySelector("#ageInput");
const registerButton = document.querySelector("#registerButton");
const errorMessage = document.querySelector("#errorMessage");
const userList = document.querySelector("#userList");

function renderUsers(users) {
    userList.replaceChildren();

    users.forEach(({name, age}) => {
        const li = document.createElement("li");
        li.textContent = `${name}, ${age} years old`;
        userList.append(li);
    });
}

registerButton.addEventListener("click", () => {
    try {
        const name = nameInput.value;
        const age = ageInput.value;
        if (age === "") {
            throw new Error("Age is required");
        }
        const ageNumber = Number(age);
        const user = createUser({name: name, age: ageNumber});
        userManager.addUser(user);
        const users = userManager.getUsers();
        console.log("User registered:", user);
        renderUsers(users);
        errorMessage.textContent = "";
        nameInput.value = "";
        ageInput.value = "";
    } catch (error) {
        console.error(error.message);
        errorMessage.textContent = error.message;
    } finally {
        console.log("Registration attempt completed");
    }
});

