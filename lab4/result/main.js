// Параметры пагинации
const rowsPerPage = 5;
let currentPage = 1;

// Элементы пагинации
const resultsBody = document.getElementById('results-body');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const clearStorageButton = document.getElementById('clear-storage');

// Функция для отображения данных с пагинацией
function displayResults(page = 1) {
    const storedData = localStorage.getItem('pollDataArray');

    if (storedData) {
        const allPollData = JSON.parse(storedData);
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = allPollData.slice(start, end);

        let resultRows = '';

        pageData.forEach((pollData) => {
            let birthDate = new Date(pollData.dateOfBirth);
            let today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            let fileCell = pollData.fileData 
                ? `<img src="${pollData.fileData}" alt="Прикрепленное изображение" style="max-width: 100px; max-height: 100px;">` 
                : 'Нет файла';

            resultRows += `
                <tr>
                    <td>${pollData.name}</td>
                    <td>${age}</td>
                    <td>${pollData.phone}</td>
                    <td>${pollData.satisfaction}</td>
                    <td>${pollData.qualities.join(', ')}</td>
                    <td>${fileCell}</td>
                    <td>${pollData.comment}</td>
                </tr>
            `;
        });

        resultsBody.innerHTML = resultRows;

        // Обновляем информацию о текущей странице
        pageInfo.textContent = `Страница ${currentPage} из ${Math.ceil(allPollData.length / rowsPerPage)}`;

        // Управляем видимостью кнопок
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === Math.ceil(allPollData.length / rowsPerPage);
    } else {
        resultsBody.innerHTML = `
            <tr>
                <td colspan="7">Нет сохранённых данных</td>
            </tr>
        `;
        pageInfo.textContent = ''; // Очистка информации о страницах, если данных нет
        prevPageButton.disabled = true;
        nextPageButton.disabled = true;
    }
}

// Обработчики кнопок пагинации
prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayResults(currentPage);
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < Math.ceil(JSON.parse(localStorage.getItem('pollDataArray')).length / rowsPerPage)) {
        currentPage++;
        displayResults(currentPage);
    }
});

// Обработчик кнопки "Очистить данные"
clearStorageButton.addEventListener('click', () => {
    localStorage.removeItem('pollDataArray');
    resultsBody.innerHTML = '';
    pageInfo.textContent = '';
    alert('Данные очищены');
    prevPageButton.disabled = true;
    nextPageButton.disabled = true;
});

// Инициализация отображения данных
window.onload = () => displayResults(currentPage);