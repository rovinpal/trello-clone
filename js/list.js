// Get All Lists
async function getLists() {
    const response = await fetch(
        `${BASE_URL}/boards/${BOARD_ID}/lists?${getAuthParams()}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch lists`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
}


// Create A New List
async function createList(name) {
    const response = await fetch(
        `${BASE_URL}/lists?name=${encodeURIComponent(name)}&pos=bottom&idBoard=${BOARD_ID}&${getAuthParams()}`,
        {
            method: "POST"
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to create list: ${response.status}`);
    }
    const data = await response.json();
    return data;
}


// Rename A List
async function renameList(listId, newName) {
    const response = await fetch(
        `${BASE_URL}/lists/${listId}?name=${encodeURIComponent(newName)}&${getAuthParams()}`,
        {
            method: "PUT"
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to rename list: ${response.status}`);
    }
    const data = await response.json();
    return data;
}


// Delete(Archive) A List
async function deleteList(listId) {
    const response = await fetch(
        `${BASE_URL}/lists/${listId}/closed?value=true&${getAuthParams()}`,
        {
            method: "PUT"
        }
    );
    if (!response.ok) {
        throw new Error(`Failed to delete list: ${response.status}`);
    }
    const data = await response.json();
    return data;
}