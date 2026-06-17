// Get All Cards
async function getCards(listId) {
    const response = await fetch(
        `${BASE_URL}/lists/${listId}/cards?${getAuthParams()}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch cards`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
}


// Create A Card
async function createCard(listId, name) {
    const response = await fetch(
        `${BASE_URL}/cards?idList=${listId}&name=${encodeURIComponent(name)}&${getAuthParams()}`,
        {
            method: "POST"
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to create card: ${response.status}`);
    }
    const data = await response.json();
    return data;
}


// Rename A Card
async function renameCard(cardId, newName) {
    const response = await fetch(
        `${BASE_URL}/cards/${cardId}?name=${encodeURIComponent(newName)}&${getAuthParams()}`,
        {
            method: "PUT"
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to rename card: ${response.status}`);
    }
    const data = await response.json();
    return data;
}


// Delete(Archive) A Card
async function deleteCard(cardId) {
    const response = await fetch(
        `${BASE_URL}/cards/${cardId}/closed?value=true&${getAuthParams()}`,
        {
            method: "PUT"
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to delete card: ${response.status}`);
    }
    const data = await response.json();
    return data;
}