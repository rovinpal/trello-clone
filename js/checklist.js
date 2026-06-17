// Get Checklists
async function getChecklists(cardId) {
    const response = await fetch(
        `${BASE_URL}/cards/${cardId}/checklists?${getAuthParams()}`
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch checklists`);
    }
    const data = response.json();
    // console.log(data);
    return data;
}


// Create A Checklist
async function createChecklist(cardId, name) {
    const response = await fetch(
        `${BASE_URL}/checklists?idCard=${cardId}&name=${encodeURIComponent(name)}&${getAuthParams()}`,
        {
            method: "POST"
        }
    );
    if (!response.ok) {
        throw new Error(
            "Failed to create checklist"
        );
    }
    const data = await response.json();
    return data;
}


// Rename A Checklist
async function renameChecklist(checklistId, newName) {
    const response = await fetch(
        `${BASE_URL}/checklists/${checklistId}/name?value=${encodeURIComponent(newName)}&${getAuthParams()}`,
        {
            method: "PUT"
        }
    );
    if (!response.ok) {
        throw new Error(
            "Failed to rename checklist"
        );
    }
    const data = await response.json();
    return data;
}


// Delete A Checklist
async function deleteChecklist(checklistId) {
    const response = await fetch(
        `${BASE_URL}/checklists/${checklistId}?${getAuthParams()}`,
        {
            method: "DELETE"
        }
    );
    if (!response.ok) {
        throw new Error("Failed to delete checklist");
    }
    const data = await response.json();
    return data;
}