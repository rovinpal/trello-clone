async function createCheckItem(checklistId, name) {
    const response = await fetch(
        `${BASE_URL}/checklists/${checklistId}/checkItems?name=${encodeURIComponent(name)}&${getAuthParams()}`,
        {
            method: "POST"
        }
    );
    if (!response.ok) {
        throw new Error(
            "Failed to create checkitem"
        );
    }
    const data = await response.json();
    return data;
}


// Update Checkitem State
async function updateCheckItemState(checklistId, checkItemId, completed) {
    const state = completed ? "complete" : "incomplete";
    // console.log({checklistId, checkItemId, completed});

    const response = await fetch(
        `${BASE_URL}/cards/${currentCardId}/checkItem/${checkItemId}?state=${state}&${getAuthParams()}`,
        {
            method: "PUT"
        }
    );
    // console.log(response);

    if (!response.ok) {
        throw new Error(
            "Failed to update checkitem"
        );
    }
    const data = await response.json();
    return data;
}


// Rename A Checkitem's Name
async function renameCheckItem(checkItemId, newName) {
    const response = await fetch(
        `${BASE_URL}/cards/${currentCardId}/checkItem/${checkItemId}?name=${encodeURIComponent(newName)}&${getAuthParams()}`,
        {
            method: "PUT"
        }
    );
    if (!response.ok) {
        // console.log(await response.text());
        throw new Error("Failed to rename checkitem");
    }
    const data = await response.json();
    return data;
}


// Delete A Checkitem
async function deleteCheckItem(checklistId, checkItemId) {
    const response = await fetch(
        `${BASE_URL}/checklists/${checklistId}/checkItems/${checkItemId}?${getAuthParams()}`,
        {
            method: "DELETE"
        }
    );
    if (!response.ok) {
        throw new Error(
            "Failed to delete checkitem"
        );
    }
    const data = await response.json();
    return data;
}