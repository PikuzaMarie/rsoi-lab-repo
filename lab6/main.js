const dbName = 'residentsDB';
const storeName = 'residentsStore';
let db;
let address = '';
let isAddressColumnAdded = false;

// Get DOM elements
const residentForm = document.getElementById('residentForm');

const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const deleteBtn = document.getElementById('deleteBtn');
const minMaxAreaBtn = document.getElementById('minMaxAreaBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const addPropertyBtn = document.getElementById('addPropertyBtn');

const idSelect = document.getElementById('idSelect');
const nameInput = document.getElementById('name');
const numberInput = document.getElementById('number');
const areaInput = document.getElementById('area');
const privatizedInput = document.getElementById('privatized');

const newPropertyInput = document.getElementById('newProperty');
const residentsTableHead = document.querySelector('#residentsTable thead tr');
const residentsTableBody = document.querySelector('#residentsTable tbody');

const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('number', 'number', { unique: false });
    objectStore.createIndex('area', 'area', { unique: false });
    objectStore.createIndex('privatized', 'privatized', { unique: false });
    objectStore.createIndex('address', 'address', { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    displayRecords();
    updateIdSelect();
};

request.onerror = function(event) {
    console.error('Database error: ' + event.target.errorCode);
};

// Revise presence of residents in objectStore
function checkResidentsExist(callback) {
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
        const residents = event.target.result;
        if (residents.length === 0) {
            alert('Нет записей');
            return;
        }
        callback(residents);
    };
}

// Add an address when the button is clicked
addPropertyBtn.addEventListener('click', () => {
    const id = parseInt(idSelect.value);
    address = newPropertyInput.value;

    if (!address) {
        alert('Пожалуйста, введите адрес.');
        return;
    }

    updateAddress(id);
    newPropertyInput.value = '';
});

// Function to update the address of an existing resident
function updateAddress(id) {
    address = newPropertyInput.value;

    if (!address) {
        alert('Пожалуйста, введите адрес.');
        return;
    }

    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
        const resident = event.target.result;
        if (resident) {
            resident.address = address;
            objectStore.put(resident).onsuccess = function() {
                displayRecords();
                updateIdSelect();
                alert('Адрес успешно обновлён.');
                address = '';
            };
        } else {
            alert('Запись с таким ID не найдена.');
        }
    };
}

// Add a new resident or update address for an existing one
residentForm.addEventListener('submit', () => {
    const id = parseInt(idSelect.value);

    if (id && !nameInput.value && !numberInput.value && !areaInput.value) {
        updateAddress(id);
        return;
    }

    if (!nameInput.value || !numberInput.value || !areaInput.value) {
        alert('Пожалуйста, заполните все обязательные поля: ФИО, Номер квартиры и Площадь.');
        return;
    }

    const name = nameInput.value;
    const number = parseInt(numberInput.value);
    const area = parseInt(areaInput.value);
    const privatized = privatizedInput.checked;

    const resident = { name, number, area, privatized, address };

    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    objectStore.add(resident).onsuccess = function() {
        displayRecords();
        updateIdSelect();
        clearForm();
        address = '';
    };
});

// Display all records
function displayRecords() {
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    if (objectStore.get(address)) {
        if (!isAddressColumnAdded) {
            const addressHeader = document.createElement('th');
            addressHeader.textContent = 'Адрес';
            residentsTableHead.appendChild(addressHeader);
            isAddressColumnAdded = true;
        }
    }

    request.onsuccess = function(event) {
        const residents = event.target.result;
        residentsTableBody.innerHTML = '';

        residents.forEach(resident => {
            const row = residentsTableBody.insertRow();
            row.innerHTML = `
                <td>${resident.id}</td>
                <td>${resident.name}</td>
                <td>${resident.number}</td>
                <td>${resident.area}</td>
                <td>${resident.privatized ? 'Да' : 'Нет'}</td>
                <td>${resident.address}</td>
            `;
        });
    };
}

// Clear the form
function clearForm() {
    residentForm.reset();
}

// Delete a resident
deleteBtn.addEventListener('click', () => {
    checkResidentsExist((residents) => {
        const id = parseInt(idSelect.value);
        const transaction = db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        objectStore.delete(id).onsuccess = () => {
            displayRecords();
            updateIdSelect();
            clearForm();
            alert('Запись успешно удалена');
        };
    });
});

// Show min/max area
minMaxAreaBtn.addEventListener('click', () => {
    checkResidentsExist((residents) => {
        if (residents.length === 1) {
            alert('Пожалуйста, добавьте больше записей');
            return;
        }

        const areas = residents.map(resident => resident.area);
        const minArea = Math.min(...areas);
        const maxArea = Math.max(...areas);

        const minResidentNames = residents
            .filter(resident => resident.area === minArea)
            .map(resident => resident.name)
            .join(', ');

        const maxResidentNames = residents
            .filter(resident => resident.area === maxArea)
            .map(resident => resident.name)
            .join(', ');

        alert(`Минимальная площадь: ${minArea} (ФИО: ${minResidentNames})\nМаксимальная площадь: ${maxArea} (ФИО: ${maxResidentNames})`);
    });
});

// Populate ID select options
function updateIdSelect() {
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const residents = event.target.result;
        idSelect.innerHTML = '';
        residents.forEach(resident => {
            const option = document.createElement('option');
            option.value = resident.id;
            option.textContent = resident.id;
            idSelect.appendChild(option);
        });
    };
}

// Delete all residents
deleteAllBtn.addEventListener('click', () => {
    checkResidentsExist((residents) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        objectStore.clear().onsuccess = function() {
            displayRecords();
            updateIdSelect();
            alert('Все записи были удалены.');
        };

        objectStore.clear().onerror = function(event) {
            console.error('Ошибка при удалении всех записей: ' + event.target.errorCode);
        };
    });
});

// Call populateIdSelect after displaying records
document.addEventListener('DOMContentLoaded', () => {
    displayRecords();
    updateIdSelect();
});