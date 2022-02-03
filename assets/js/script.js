const API_KEY = "RBGx_XRu7FvpA1WnI55oFgQsEUc";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete('options');

    form.append('options', optArray.join());

    return form;

}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    })

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let head = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">Ni errors reported!</div>`;
    } else {
        results = `<div>Total errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>at line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
    document.getElementById('resultsModalTitle').textContent = head;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();

}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data.expiry);
    } else {
        displayException(data)
        throw new Error(data.error);
    }

}

function displayStatus(data) {
    document.getElementById('resultsModalTitle').textContent = 'API Key Status';
    document.getElementById('results-content').innerHTML =
        `<div class='key-status'>Your key is valid until <br>${data}</div>`;

    resultsModal.show();
}

function displayException(data) {
    document.getElementById('resultsModalTitle').textContent = 'An Exception Occurred';
    document.getElementById('results-content').innerHTML =
        `<div class='status-code'>The API returned status code ${data.status_code}</div>
        <div class='error_number'>Error number: ${data.error_no}</div>
        <div class='error_text'>Error text: ${data.error}</div>`;

        resultsModal.show();
}
