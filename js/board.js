async function renderLists(lists) {
    const board = document.getElementById("board");

    board.innerHTML = "";

    const cardsResults = await Promise.all(
        lists.map(list => getCards(list.id))
    );

    for (let i = 0; i < lists.length; i++) {

        const list = lists[i];
        const cards = cardsResults[i];

        const listEl = document.createElement("div");
        listEl.className = "list";
        listEl.dataset.listId = list.id;

        listEl.innerHTML = `
            <div class="list-header">
                <h3>${list.name}</h3>
                <div class="list-actions">
                    <button class="edit-list-btn">Edit</button>
                    <button class="delete-list-btn">Archive</button>
                </div>
            </div>

            <div class="cards"></div>

            <button class="add-card-btn">+ Add Card</button>
        `;

        const cardsContainer = listEl.querySelector(".cards");

        for (const card of cards) {
            const cardEl = document.createElement("div");
            cardEl.className = "card";
            cardEl.dataset.cardId = card.id;


            cardEl.innerHTML = `
                <div class="card-header">
                    <h4>${card.name}</h4>
                    <div class="card-btns">
                        <button class="edit-card-btn">
                            Edit
                        </button>
                        <button class="delete-card-btn">
                            Archive
                        </button>
                    </div>
                </div>
            `;

            cardsContainer.appendChild(cardEl);
        }

        board.appendChild(listEl);
    }

    const addListEl = document.createElement("div");
    addListEl.className = "add-list";

    addListEl.innerHTML = `
        <button class="show-add-list-btn">
            + Add another list
        </button>
    `;

    board.appendChild(addListEl);
}