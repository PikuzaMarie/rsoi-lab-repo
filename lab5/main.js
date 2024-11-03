const rusToEngMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
};

const engToRusMap = {
    'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д',
    'e': 'е', 'yo': 'ё', 'zh': 'ж', 'z': 'з', 'i': 'и',
    'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н',
    'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т',
    'u': 'у', 'f': 'ф', 'h': 'х', 'ts': 'ц', 'ch': 'ч',
    'sh': 'ш', 'shch': 'щ', '': 'ъ', 'y': 'ы', '': 'ь',
    'e': 'э', 'yu': 'ю', 'ya': 'я', 'j': 'ж', 'w': 'в', 
    'q': 'кв'
};

const rusInput = document.getElementById('input-rus');
const engInput = document.getElementById('input-eng');

const rusBtn = document.getElementById('btn-rus');
const engBtn = document.getElementById('btn-eng');

const selectFont = document.getElementById('font-select');
const selectColor = document.getElementById('color-select');

const form = document.getElementById('form');

const olContainer = document.getElementById('ol-container');

function transliterateRusToEng(str) {
    let result = '';
    const strArr = str.split('');

    for (let letter of strArr) {
        result += rusToEngMap[letter] || letter;
    }

    return result;
};

function transliterateEngToRus(str) {
    let result = '';
    const strArr = str.split('');

    for (let letter of strArr) {
        result += engToRusMap[letter] || letter;
    }

    return result;
};

function setClass(element) {
    element.className = `${selectFont.value} ${selectColor.value}`;
};

engBtn.addEventListener('click', () => {
    if (rusInput.value !== '') {
        engInput.focus();
        engInput.value = transliterateRusToEng(rusInput.value) + ' ';
        setClass(engInput);
    } else {
        alert('Input is empty');
    }
});

rusBtn.addEventListener('click', () => {
    if (engInput.value !== '') {
        rusInput.focus();
        rusInput.value = transliterateEngToRus(engInput.value) + ' ';
        setClass(rusInput);
    } else {
        alert('Input is empty');
    }
});

rusInput.addEventListener('change', () => {
    engInput.focus();
});

engInput.addEventListener('change', () => {
    rusInput.focus();
});

document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if(rusInput.value.trim() === '' && rusInput.value.trim() === '') {
            alert('Inputs are empty');
            return;
        }
        
        const rusWordsArr = rusInput.value.trim().split(' ');
        const engWordsArr = engInput.value.trim().split(' ');
        const liCount = Math.max(rusWordsArr.length, engWordsArr.length);
    
        const ol = document.createElement('ol');

        const title = document.createElement('figcaption');
        title.innerText = 'Transliteration results';
        ol.appendChild(title);
    
        for (let i = 0; i < liCount; i++) {
            const li = document.createElement('li');
            const rusWord = rusWordsArr[i] || '';
            const engWord = engWordsArr[i] || '';
            li.textContent = `${rusWord} - ${engWord}`;
            ol.appendChild(li);
        }

        olContainer.innerHTML = ''; 
        olContainer.appendChild(ol);

        rusInput.className='';
        engInput.className='';

        form.reset();
    });
});