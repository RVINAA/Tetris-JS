class Gramola {
    constructor() {
        this.soundTrack = new Audio();
        this.soundTrack.volume = 0.4;
        this.soundTrack.loop = true;
        this.working = true;
    }

    ponerCancion = cancion => {
        this.soundTrack.src = 'SOUND/' + cancion + '.mp3';
        this.soundTrack.play();
    }

    switchStatus = () => {
        if (this.working) {
            if (this.soundTrack.src != false && !this.soundTrack.paused) this.soundTrack.pause();
            else if (this.soundTrack.src != false && this.soundTrack.paused) this.soundTrack.play();
        }
    }
}

let musica = new Gramola();

document.addEventListener("DOMContentLoaded", () => {
    
    const TRACKLIST = ['MUSIC - I', 'MUSIC - 2', 'MUSIC - 3', 'MUTED - X'];
    const BLOQUES = ['T', 'J', 'Z', 'C', 'S', 'L', 'I'];
    
    document.title = '⸺ ❌ 𝑻 𝑬 𝑻 𝑹 𝑰 𝑺 ❌ ⸺'

    // Contenedor centrado - Main
    let main = document.createElement('main');
    document.body.appendChild(main);

    // Cabecera -> .titulo
    let puntero = document.createElement('div');
    puntero.innerText = '𝑻𝑬𝑻𝑹𝑰𝑺 - @𝑺𝑰𝑮𝑴𝑨#1182';
    puntero.className = 'titulo';
    main.appendChild(puntero);

    // Contenedor -> #Tetris
    puntero = document.createElement('div');
    puntero.id = 'tetris';

    // Contenedor -> .puntuacion
    puntero.appendChild(document.createElement('div'));
    puntero.firstElementChild.className = 'puntuacion';
    puntero.firstElementChild.innerText = '00000000';

    // Contenedor -> .lineas
    puntero.appendChild(document.createElement('div'));
    puntero.children[1].innerText = 'LINES - 000';
    puntero.children[1].className = 'lineas';
    
    // Contenedor -> .estadisticas
    puntero.appendChild(document.createElement('div'));
    puntero.children[2].className = 'estadisticas';
    puntero.children[2].appendChild(document.createElement('p'));
    puntero.children[2].firstElementChild.innerText = 'STATISTICS';
    puntero.children[2].appendChild(document.createElement('ul'));
    BLOQUES.forEach( bloque => {
        let liPuntero = document.createElement('li');
        liPuntero.appendChild(document.createElement('img'));
        liPuntero.firstElementChild.src = 'IMGs/blocks/0/' + bloque + '.png';
        liPuntero.appendChild(document.createElement('p'));
        liPuntero.children[1].dataset.pieza = bloque;
        liPuntero.children[1].innerText = '000';
        puntero.children[2].children[1].appendChild(liPuntero);
    });

    // Contenedor -> .Tablero
    puntero.appendChild(document.createElement('div'));
    puntero.children[3].className = 'tablero';
    main.appendChild(puntero); // #Tetris.

    // Pantalla de pausa -> .pauseScreen
    puntero.appendChild(document.createElement('div'));
    puntero.children[4].className = 'pausa';
    puntero.children[4].appendChild(document.createElement('p'));
    puntero.children[4].firstElementChild.innerText = 'PAUSE';
    puntero.children[3].appendChild(puntero.children[4]);

    // Contenedor -> .adicional
    puntero = document.createElement('div');
    puntero.className = 'adicional';

    // Contenedor -> .nivel
    puntero.appendChild(document.createElement('div'));
    puntero.firstElementChild.className = 'nivel';
    puntero.firstElementChild.innerText = 'LEVEL: 0';

    // Contenedor -> .next
    puntero.appendChild(document.createElement('div'));
    puntero.children[1].className = 'next';
    puntero.children[1].appendChild(document.createElement('p'));
    puntero.children[1].firstElementChild.innerText = 'NEXT';
    puntero.children[1].appendChild(document.createElement('img'));

    // Contenedor -> .music
    const elegirSoundtrack = evt => {
        if (evt.target.tagName == 'A' && evt.target.className != 'activo') {
            document.querySelector('.activo').removeAttribute("class");
            evt.target.className = 'activo';
            switch(evt.target.text) {
                case TRACKLIST[0]:
                case TRACKLIST[1]:
                case TRACKLIST[2]:
                    musica.ponerCancion(evt.target.text);
                    break;
                case TRACKLIST[3]:
                    musica.soundTrack.pause();
                    musica.soundTrack.removeAttribute('src');
                    break;
            }
        }
    }

    puntero.appendChild(document.createElement('div'));
    puntero.children[2].addEventListener('click', elegirSoundtrack, false);
    puntero.children[2].className = 'musica';

    TRACKLIST.forEach( (track, index) => {
        let aPuntero = document.createElement('a');
        aPuntero.innerText = track;
        if (index == 3) aPuntero.className = 'activo';
        puntero.children[2].appendChild(aPuntero);
    });

    main.appendChild(puntero);

    // Cada vez que el usuario cambie de pestaña, detenemos la música.
    document.addEventListener('visibilitychange', () => musica.switchStatus(), false);

});