import { GEMINI_API_KEY } from "./secret.js";

const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  GUEST: "GUEST",
};

const AI_MODEL = "gemini-3.5-flash-lite";

const FRIDGE_FILE = "./fridge.json";
const USERS_FILE = "./users.json";

export { ROLES, AI_MODEL, FRIDGE_FILE, USERS_FILE, GEMINI_API_KEY };
