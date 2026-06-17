let currentAction = null;
let currentListId = null;
let currentCardId = null;
let currentChecklistId = null;
let currentChecklistCardId = null;
let currentCheckItemId = null;


async function init() {
    const lists = await getLists();
    await renderLists(lists);
}

init();


const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalInput = document.getElementById("modal-input");
const saveBtn = document.getElementById("modal-save-btn");
const cancelBtn = document.getElementById("modal-cancel-btn");

const cardDetailsOverlay = document.getElementById("card-details-overlay");
const cardDetailsContent = document.getElementById("card-details-content");
const closeCardDetailsBtn = document.getElementById("close-card-details-btn");


const modal = document.querySelector("#modal-overlay .modal");
const cardDetailsModal = document.querySelector("#card-details-overlay .modal");

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add("hidden");

        if (
            currentAction === "create-checklist" ||
            currentAction === "rename-checklist" ||
            currentAction === "create-checkitem" ||
            currentAction === "rename-checkitem"
        ) {
            openCardDetailsModal(currentCardId);
        }
    }
});

cardDetailsOverlay.addEventListener("click", (e) => {
    if (e.target === cardDetailsOverlay) {
        cardDetailsOverlay.classList.add("hidden");
    }
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("show-add-list-btn")) {
        currentAction = "create-list";

        modalTitle.textContent = "Create List";
        modalInput.value = "";

        modalOverlay.classList.remove("hidden");
    }
});

cancelBtn.addEventListener("click", () => {
    modalOverlay.classList.add("hidden");
    if (currentAction === "create-checklist") {
        openCardDetailsModal(currentCardId);
    }
    if (currentAction === "rename-checklist" || currentAction === "rename-checkitem") {
        openCardDetailsModal(currentCardId);
    }
    if (currentAction === "create-checkitem") {
        openCardDetailsModal(currentCardId);
    }
});

closeCardDetailsBtn.addEventListener("click", () => {
    cardDetailsOverlay.classList.add("hidden");
});


document.getElementById("board").addEventListener("click", async (e) => {

    if (e.target.classList.contains("edit-list-btn")) {
        const listEl = e.target.closest(".list");
        currentListId = listEl.dataset.listId;

        currentAction = "rename-list";
        modalTitle.textContent = "Rename List";
        modalInput.value = "";

        modalOverlay.classList.remove("hidden");
    }

    if (e.target.classList.contains("delete-list-btn")) {
        const listId = e.target.closest(".list").dataset.listId;

        if (!confirm("Archive this list?")) return;

        await deleteList(listId);
        await init();
    }

    if (e.target.classList.contains("add-card-btn")) {
        const listId = e.target.closest(".list").dataset.listId;

        currentListId = listId;
        currentAction = "create-card";

        modalTitle.textContent = "Create Card";
        modalInput.value = "";

        modalOverlay.classList.remove("hidden");
    }

    if (e.target.classList.contains("edit-card-btn")) {
        const cardId = e.target.closest(".card").dataset.cardId;

        currentCardId = cardId;
        currentAction = "rename-card";

        modalTitle.textContent = "Rename Card";
        modalInput.value = "";

        modalOverlay.classList.remove("hidden");
    }

    if (e.target.classList.contains("delete-card-btn")) {
        const cardId = e.target.closest(".card").dataset.cardId;

        if (!confirm("Archive this card?")) return;

        await deleteCard(cardId);
        await init();
    }
});


document.addEventListener("click", async (e) => {

    if (e.target.id === "add-checklist-btn") {
        currentChecklistCardId = currentCardId;
        currentAction = "create-checklist";
        cardDetailsOverlay.classList.add("hidden");
        modalTitle.textContent = "Create Checklist";
        modalInput.value = "";
        modalOverlay.classList.remove("hidden");
        setTimeout(() => modalInput.focus(), 0);
    }

    if (e.target.classList.contains("rename-checklist-btn")) {
        currentChecklistId = e.target.dataset.checklistId;
        currentAction = "rename-checklist";
        cardDetailsOverlay.classList.add("hidden");
        modalTitle.textContent = "Rename Checklist";
        modalInput.value = "";
        modalOverlay.classList.remove("hidden");
        setTimeout(() => modalInput.focus(), 0);
    }

    if (e.target.classList.contains("delete-checklist-btn")) {
        const checklistId = e.target.dataset.checklistId;

        if (!confirm("Delete checklist?")) return;
        await deleteChecklist(checklistId);
        await openCardDetailsModal(currentCardId);
    }

    if (e.target.classList.contains("add-checkitem-btn")) {
        currentChecklistId = e.target.dataset.checklistId;

        currentAction = "create-checkitem";
        cardDetailsOverlay.classList.add("hidden");
        modalTitle.textContent = "Add CheckItem";
        modalInput.value = "";
        modalOverlay.classList.remove("hidden");
        setTimeout(() => modalInput.focus(), 0);
    }

    if (e.target.classList.contains("checkitem-text")) {
        currentCheckItemId = e.target.dataset.checkitemId;
        currentChecklistId = e.target.dataset.checklistId;
        currentAction = "rename-checkitem";
        modalTitle.textContent = "Rename CheckItem";

        modalInput.value = e.target.textContent.trim();
        cardDetailsOverlay.classList.add("hidden");
        modalOverlay.classList.remove("hidden");

        setTimeout(() => {
            modalInput.focus();
            modalInput.select();
        }, 0);
    }

    const deleteBtn = e.target.closest(".delete-checkitem-btn");

    if (deleteBtn) {
        const checklistId = deleteBtn.dataset.checklistId;
        const checkItemId = deleteBtn.dataset.checkitemId;

        const confirmed = confirm("Delete this checkitem?");
        if (!confirmed) return;

        await deleteCheckItem(checklistId, checkItemId);
        deleteBtn.closest("li").remove();
    }
});


document.getElementById("board").addEventListener("click", async (e) => {
    if (
        e.target.closest(".edit-card-btn") ||
        e.target.closest(".delete-card-btn") ||
        e.target.closest(".delete-checkitem-btn")
    ) {
        return;
    }

    const cardEl = e.target.closest(".card");
    if (!cardEl) return;

    currentCardId = cardEl.dataset.cardId;

    await openCardDetailsModal(currentCardId);
});

async function openCardDetailsModal(cardId) {
    cardDetailsOverlay.classList.remove("hidden");

    const checklists = await getChecklists(cardId);

    renderChecklists(checklists);
}

document.addEventListener("change", async (e) => {
    if (e.target.classList.contains("toggle-checkitem")) {
        const checklistId = e.target.dataset.checklistId;
        const checkItemId = e.target.dataset.checkitemId;
        const completed = e.target.checked;
        await updateCheckItemState(checklistId, checkItemId, completed);
        openCardDetailsModal(currentCardId);
    }
}
);


function renderChecklists(checklists) {
    cardDetailsContent.innerHTML = "";

    for (const checklist of checklists) {

        const checklistEl = document.createElement("div");
        checklistEl.className = "checklist";

        const completed = checklist.checkItems.filter(item => item.state === "complete").length;
        const total = checklist.checkItems.length;

        const checkItemsHtml = checklist.checkItems.map(item => `
            <li class="checkitem-row">
                <div class="checkitem-left">
                    <input
                        type="checkbox"
                        class="toggle-checkitem"
                        data-checklist-id="${checklist.id}"
                        data-checkitem-id="${item.id}"
                        ${item.state === "complete" ? "checked" : ""}
                    >

                        <span
                            class="checkitem-text"
                            data-checklist-id="${checklist.id}"
                            data-checkitem-id="${item.id}"
                        >
                            ${item.name}
                        </span>
                </div>
                <button
                    class="delete-checkitem-btn"
                    data-checklist-id="${checklist.id}"
                    data-checkitem-id="${item.id}"
                >
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </li>
        `).join("");

        checklistEl.innerHTML = `
            <div class="checklist-header">
                <h3>${checklist.name} <span class="completed-span">(${completed}/${total})</span></h3>

                <div>
                    <button class="rename-checklist-btn"
                        data-checklist-id="${checklist.id}">
                        Rename
                    </button>

                    <button class="delete-checklist-btn"
                        data-checklist-id="${checklist.id}">
                        Delete
                    </button>
                </div>
            </div>

            <ul class="checkitems">
                ${checkItemsHtml}
            </ul>

            <button class="add-checkitem-btn"
                data-checklist-id="${checklist.id}">
                + Add CheckItem
            </button>
        `;

        cardDetailsContent.appendChild(checklistEl);
    }
}


saveBtn.addEventListener("click", async () => {
    const name = modalInput.value.trim();
    if (!name) return;

    if (currentAction === "create-list") {
        await createList(name);
    }

    if (currentAction === "rename-list") {
        await renameList(currentListId, name);
    }

    if (currentAction === "create-card") {
        await createCard(currentListId, name);
    }

    if (currentAction === "rename-card") {
        await renameCard(currentCardId, name);
    }

    if (currentAction === "create-checklist") {
        await createChecklist(currentChecklistCardId, name);
        modalOverlay.classList.add("hidden");

        await openCardDetailsModal(currentCardId);
        return;
    }

    if (currentAction === "rename-checklist") {
        await renameChecklist(currentChecklistId, name);
        modalOverlay.classList.add("hidden");

        await openCardDetailsModal(currentCardId);
        return;
    }

    if (currentAction === "create-checkitem") {
        await createCheckItem(currentChecklistId, name);
        modalOverlay.classList.add("hidden");

        await openCardDetailsModal(currentCardId);
        return;
    }

    if (currentAction === "rename-checkitem") {
        await renameCheckItem(currentCheckItemId, name);
        modalOverlay.classList.add("hidden");

        await openCardDetailsModal(currentCardId);
        return;
    }

    modalOverlay.classList.add("hidden");
    await init();
});