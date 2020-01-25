document.addEventListener("DOMContentLoaded", () => {

    const BLOQUES = ['block-T', 'block-L2', 'block-N1', 'block-C', 'block-N2', 'block-L1', 'block-I'];
    const TRACKS = ['MUSIC - I', 'MUSIC - 2', 'MUSIC - 3', 'MUTED - X'];

    document.title = '⸺ ❌ 𝑻 𝑬 𝑻 𝑹 𝑰 𝑺 ❌ ⸺'

    // Cabecera -> .titulo
    let puntero = document.createElement('div');
    puntero.className = 'titulo';
    puntero.appendChild(document.createElement('p'));
    puntero.firstElementChild.innerText = '𝑻𝑬𝑻𝑹𝑰𝑺 - @𝑺𝑰𝑮𝑴𝑨#1182';
    document.body.appendChild(puntero);

    // Contenedor -> #Tetris
    puntero = document.createElement('div');
    puntero.id = 'tetris';

    // Contenedor -> .puntuacion
    puntero.appendChild(document.createElement('div'));
    puntero.firstElementChild.className = 'puntuacion';
    puntero.firstElementChild.appendChild(document.createElement('p'));
    puntero.firstElementChild.firstElementChild.innerText = '00000000';

    // Contenedor -> .lineas
    puntero.appendChild(document.createElement('div'));
    puntero.children[1].className = 'lineas';
    puntero.children[1].appendChild(document.createElement('p'));
    puntero.children[1].firstElementChild.innerText = 'LINES - 000';

    // Contenedor -> .estadisticas
    puntero.appendChild(document.createElement('div'));
    puntero.children[2].className = 'estadisticas';
    puntero.children[2].appendChild(document.createElement('p'));
    puntero.children[2].firstElementChild.innerText = 'STATISTICS';
    puntero.children[2].appendChild(document.createElement('ul'));
    BLOQUES.forEach( bloque => {
        let liPuntero = document.createElement('li');
        liPuntero.appendChild(document.createElement('img'));
        liPuntero.firstElementChild.src = 'IMGs/piezas/' + bloque + '.png';
        liPuntero.appendChild(document.createElement('p'));
        liPuntero.children[1].className = bloque;
        liPuntero.children[1].innerText = '000';
        puntero.children[2].children[1].appendChild(liPuntero);
    });

    // Contenedor -> .Tablero
    puntero.appendChild(document.createElement('div'));
    puntero.children[3].className = 'tablero';
    document.body.appendChild(puntero); // #Tetris.

    // Contenedor -> .adicional
    puntero = document.createElement('div');
    puntero.className = 'adicional';

    // Contenedor -> .nivel
    puntero.appendChild(document.createElement('div'));
    puntero.firstElementChild.className = 'nivel';
    puntero.firstElementChild.appendChild(document.createElement('p'));
    puntero.firstElementChild.firstElementChild.innerText = 'LEVEL: 0';

    // Contenedor -> .next
    puntero.appendChild(document.createElement('div'));
    puntero.children[1].className = 'next';
    puntero.children[1].appendChild(document.createElement('p'));
    puntero.children[1].firstElementChild.innerText = 'NEXT';

    // Contenedor -> .music
    puntero.appendChild(document.createElement('div'));
    puntero.children[2].addEventListener('click', elegirSoundtrack, false);
    puntero.children[2].className = 'musica';

    TRACKS.forEach( (track, index) => {
        let aPuntero = document.createElement('a');
        aPuntero.innerText = track;
        if (index == 3) aPuntero.className = 'activo';
        puntero.children[2].appendChild(aPuntero);
    });

    document.body.appendChild(puntero);

    let soundTrack = new Audio();
    soundTrack.volume = 0.4;
    soundTrack.loop = true;

    function elegirSoundtrack(evt) {
        if (evt.target.tagName == 'A' && evt.target.className != 'activo') {
            document.querySelector('.activo').removeAttribute("class");
            evt.target.className = 'activo';
            switch(evt.target.text) {
                case TRACKS[0]:
                case TRACKS[1]:
                case TRACKS[2]:
                    soundTrack.src = 'SOUND/' + evt.target.text + '.mp3';
                    soundTrack.play();
                    break;
                case TRACKS[3]:
                    soundTrack.pause();
                    soundTrack = new Audio();
                    break;
            }
        }
    }

    // Cada vez que el usuario cambie de pestaña, detenemos la música.
    document.addEventListener('visibilitychange', () => {
        if (soundTrack.src != false && !soundTrack.paused) soundTrack.pause();
        else if (soundTrack.src != false && soundTrack.paused) soundTrack.play();
    }, false);
    
});
