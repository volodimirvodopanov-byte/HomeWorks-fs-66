let nextId = 1;

function createUser({name, age, ...rest}) {
    const trimName = name.trim();
    if (trimName === "") {
        throw new Error("Name is required");
    }
    if (!Number.isInteger(age) || age < 0 || age > 120) {
        throw new Error("Invalid age");
    }
    return {...rest, id: nextId++, name: trimName, age}; // rest первый на случай лишних полей и совпадающих ключей
}