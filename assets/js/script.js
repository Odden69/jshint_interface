const API_KEY = "RBGx_XRu7FvpA1WnI55oFgQsEUc";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data.expiry);
    } else {
        throw new Error(data.error);
    }

}

function displayStatus(data) {
    document.getElementById('resultsModalTitle').textContent = 'API Key Status';
    document.getElementById('results-content').innerHTML = 
    `<div class='key-status'>Your key is valid until <br>${data}</div>`;

    resultsModal.show();
}