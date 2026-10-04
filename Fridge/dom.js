// Все элементы страницы в одном месте.
// И render.js, и main.js берут их отсюда, а не ищут каждый сам.

// ===== Список покупок =====
export const addForm = document.getElementById("addForm");
export const productNameInput = document.getElementById("productName");
export const categorySelect = document.getElementById("productCategory");

export const filtersBlock = document.getElementById("filters");
export const filterButtons = filtersBlock.querySelectorAll("[data-filter]");

export const createDraftButton = document.getElementById("createDraft");
export const saveDraftButton = document.getElementById("saveDraft");
export const cancelDraftButton = document.getElementById("cancelDraft");
export const draftBadge = document.getElementById("draftBadge");

export const productList = document.getElementById("productList");

// ===== Помощник AI =====
export const searchForm = document.getElementById("searchForm");
export const userNameInput = document.getElementById("userName");
export const dishTitleInput = document.getElementById("dishTitle");
export const searchButton = document.getElementById("searchButton");
export const roleBadge = document.getElementById("roleBadge");
export const result = document.getElementById("result");

// ===== Модальное окно ошибки =====
export const errorModal = document.getElementById("errorModal");
export const errorMessage = document.getElementById("errorMessage");
export const closeModalButton = document.getElementById("closeModal");
