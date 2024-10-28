const paragraphs = document.querySelectorAll('p');

paragraphs.forEach(p => {
    const style = window.getComputedStyle(p);

    if(style.fontSize === '16px' && style.color === 'rgb(33, 33, 33)') {
        if(p.textContent.length > 2) {
            p.innerHTML = `<span class='first-two-letters'>${p.textContent.slice(0, 2)}</span>${p.textContent.slice(2)}`;
        }
    }
});