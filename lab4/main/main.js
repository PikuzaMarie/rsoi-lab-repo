// Обработчик отправки формы
document.getElementById('quality-poll-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем отправку формы

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const formData = {
                name: document.getElementById('name').value,
                dateOfBirth: document.getElementById('date-of-birth').value,
                phone: document.getElementById('tel').value,
                satisfaction: document.querySelector('input[name="satisfaction"]:checked').value,
                qualities: Array.from(document.querySelectorAll('input[name="quality"]:checked')).map(checkbox => checkbox.value),
                comment: document.getElementById('comment').value,
                fileData: e.target.result
            };

            let allData = JSON.parse(localStorage.getItem('pollDataArray')) || [];

            allData.push(formData);

            localStorage.setItem('pollDataArray', JSON.stringify(allData));

            document.getElementById('quality-poll-form').reset();
            alert('Данные успешно отправлены и сохранены в localStorage.');
            window.location.href = '../result/index.html';
        };

        reader.readAsDataURL(file);
    } else {
        alert('Пожалуйста, прикрепите файл.');
    }
});
// Удаляем плейсхолдер из поля комментария при фокусе
document.getElementById('comment').addEventListener("focus", () => {
    if (comment.textContent === 'Ваш комментарий') {
        comment.textContent = '';
    }
});
// Сброс всех полей формы
document.getElementById('resetBtn').addEventListener('click', function() {
    form.reset();
});