document.addEventListener("DOMContentLoaded", () => {
    const BLOQUES = ['block-T', 'block-L2', 'block-N1', 'block-C', 'block-N2', 'block-L1', 'block-I'];

    document.title = 'Tetris JS';

    // Cabecera .header
    let puntero = document.createElement('div');
    puntero.className = 'header';
    puntero.appendChild(document.createElement('p'));
    puntero.firstElementChild.innerText = '𝑻𝑬𝑻𝑹𝑰𝑺 - @𝑺𝑰𝑮𝑴𝑨#1182';
    document.body.appendChild(puntero);

    // Contenedor #Tetris
    puntero = document.createElement('div');
    puntero.id = 'tetris';

    // Contenedor .puntuacion
    puntero.appendChild(document.createElement('div'));
    puntero.firstElementChild.className = 'puntuacion';
    puntero.firstElementChild.appendChild(document.createElement('p'));
    puntero.firstElementChild.firstElementChild.innerText = '00000000';

    // Contenedor .lineas
    puntero.appendChild(document.createElement('div'));
    puntero.children[1].className = 'lineas';
    puntero.children[1].appendChild(document.createElement('p'));
    puntero.children[1].firstElementChild.innerText = 'LINES - 000';

    // Contenedor .estadisticas
    puntero.appendChild(document.createElement('div'));
    puntero.children[2].className = 'estadisticas';
    puntero.children[2].appendChild(document.createElement('p'));
    puntero.children[2].firstElementChild.innerText = 'STATISTICS';
    puntero.children[2].appendChild(document.createElement('ul'));
    BLOQUES.forEach( bloque => {
        let liPuntero = document.createElement('li');
        liPuntero.appendChild(document.createElement('img'));
        liPuntero.firstElementChild.src = 'IMGs/' + bloque + '.png';
        liPuntero.appendChild(document.createElement('p'));
        liPuntero.children[1].className = bloque;
        liPuntero.children[1].innerText = '000';
        puntero.children[2].children[1].appendChild(liPuntero);
    });

    // Contenedor .Tablero
    puntero.appendChild(document.createElement('div'));
    puntero.children[3].className = 'tablero';
    document.body.appendChild(puntero); // #Tetris.
});
