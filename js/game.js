document.addEventListener("DOMContentLoaded", () => TETRIS(), false);

const TETRIS = () => {
    
    const CONFIG = {
        MARGEN_TABLERO_MAX_Y : 210,
        MARGEN_TABLERO_MIN_Y : -20,
        MARGEN_TABLERO_MAX_X : 90,
        MARGEN_TABLERO_MIN_X : 0,
        DIMENSION_BLOQUE : 10,
        HEIGHT_CANVAS : 200,
        WIDTH_CANVAS : 100,
        SPAWN_BLOCK : 4
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Creamos un canvas, posteriormente creamos un tablero donde guardaremos cada celda, su posición y un color a pintar.  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const canvasPantalla = {
        canvas : document.createElement('canvas'),
        mostrar : function() {
            document.querySelector('.tablero').appendChild(this.canvas);
            this.context = this.canvas.getContext('2d');
            this.canvas.height = CONFIG.HEIGHT_CANVAS;
            this.canvas.width = CONFIG.WIDTH_CANVAS;
        }
    }

    class Tablero {
        static actualizarPuntuacion = valor => document.querySelector('.puntuacion').innerText = (PLAYER.PUNTUACION += valor).toString().padStart(8,'0');

        static actualizarLineas = () => document.querySelector('.lineas').innerText = 'LINES - ' + PLAYER.LINEAS.toString().padStart(3,'0');

        static actualizarFiguras = () => {
            document.querySelectorAll('.estadisticas > ul > li > img').forEach( (imagen, index) => { imagen.src = 'tetris-js/img/blocks/' + PLAYER.NIVEL % 10 + '/' + FIGURAS_DISPONIBLES[index].nombre + '.png'; });
        }

        static actualizarNivel = () => {
            document.querySelector('.nivel').innerText = 'LEVEL: ' + (++PLAYER.NIVEL), PLAYER.VELOCIDAD -= 10;
            new Audio('tetris-js/sound/FX - Level UP.mp3').play();
            Tablero.actualizarFiguras();
        }

        static actualizarNext = () => document.querySelector('.next > img').src = 'tetris-js/img/blocks/' + PLAYER.NIVEL + '/' + FIGURAS.NXT_FIGURA.nombre + '.png';

        constructor() {
            let contadorX = -10, contadorY = -20;
            this.sectores = new Array( ( (CONFIG.HEIGHT_CANVAS + 20) / CONFIG.DIMENSION_BLOQUE) * (CONFIG.WIDTH_CANVAS / CONFIG.DIMENSION_BLOQUE) ).fill('.');
            this.sectores = this.sectores.map( () => {
                if (contadorX == CONFIG.MARGEN_TABLERO_MAX_X) contadorY += CONFIG.DIMENSION_BLOQUE, contadorX = -(CONFIG.DIMENSION_BLOQUE); 
                return { color : null, x : contadorX += CONFIG.DIMENSION_BLOQUE, y : contadorY };
            });
        }

        pintarTablero = () => {
            this.sectores.forEach( casilla => {
                if (casilla.color != null) this.pintarCasilla(casilla.color, casilla.x, casilla.y);
            });
        }

        pintarCasilla = (color, x, y) => {
            const bloque = canvasPantalla.context;
            const imagen = new Image();
            imagen.src = 'tetris-js/img/blocks/' + PLAYER.NIVEL.toString().slice(PLAYER.NIVEL.toString().length - 1) + '/' + color + '.png';
            bloque.drawImage(imagen, x, y, CONFIG.DIMENSION_BLOQUE, CONFIG.DIMENSION_BLOQUE);  
        }

        comprobarSiHayFilasRellenas = () => {
            let lineasCompletadas = 0, coincidencias = 0;
            this.sectores.forEach( (casilla, index) => {
                if (index != 0 && index % 10 == 0) coincidencias = 0;
                if (casilla.color != null) ++coincidencias;
                if (coincidencias == 10) {
                    Object.keys(this.sectores.slice(0, index + 1)).reverse().map( currentIndex => {
                        if (currentIndex >= 10) this.sectores[currentIndex].color = this.sectores[currentIndex - 10].color;
                        else this.sectores[currentIndex].color = null;
                    });
                    ++lineasCompletadas;
                    if ((++PLAYER.LINEAS) % 10 == 0) Tablero.actualizarNivel();
                }
            });

            if (lineasCompletadas == 0) new Audio('tetris-js/sound/FX - Colision.mp3').play();
            else Tablero.actualizarLineas();

            if (lineasCompletadas > 0 && lineasCompletadas < 4) {
                new Audio('tetris-js/sound/FX - POOR LINE.mp3').play();
                Tablero.actualizarPuntuacion( [40, 100, 300][lineasCompletadas - 1] );
            } else if (lineasCompletadas == 4) {
                new Audio('tetris-js/sound/FX - GOOD LINE.mp3').play();
                Tablero.actualizarPuntuacion(1200);
            }
        }
    }

    let tablero = new Tablero();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         Aquí tenemos el temporizador, el encargado de que la pieza se mueva y de que se pueda pausar el juego.         //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    class Temporizador {
        constructor(funcion) {
            window.addEventListener('keydown', this.pausarJuego, false);
            this.funcion = funcion;
            this.pausado = false;
            this.iniciarTimer();
        }

        iniciarTimer = () => { this.timer = setInterval(this.funcion, PLAYER.VELOCIDAD); }

        detenerTimer = () => { clearInterval(this.timer); }

        pausarJuego = evt => {
            if (evt.code == 'Enter' && !evt.repeat) {
                if (this.pausado) {
                    document.querySelector('.musica').addEventListener('click', elegirsoundtrack, false);
                    window.addEventListener('keydown', FIGURAS.FIG_ACTUAL.moverFigura, false);
                    this.iniciarTimer(), musica.status = true, musica.switchStatus(), this.pausado = false;
                    document.querySelector('.pausa').removeAttribute('style');
                } else {
                    document.querySelector('.musica').removeEventListener('click', elegirsoundtrack, false);
                    window.removeEventListener('keydown', FIGURAS.FIG_ACTUAL.moverFigura, false);
                    this.detenerTimer(), musica.switchStatus(), this.pausado = true, musica.status = false;
                    document.querySelector('.pausa').style.display = "block";
                    new Audio('tetris-js/sound/FX - Pause.mp3').play();
                }
            }
        }

        switchStatus = () => {
            if (document.hidden && !this.pausado) this.detenerTimer();
            else if (!this.pausado) this.iniciarTimer();
        }
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     Definimos la clase figura de la que heredan las otras figuras y una función que genera aleatoriamente figuras.     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const FIGURAS_DISPONIBLES = [
        { nombre : 'T', color : 'type0', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 11, CONFIG.SPAWN_BLOCK + 2], posiciones : [[-9, 0, -11, 9], [11, 0, -9, -11], [9, 0, 11, -9], [-11, 0, 9, 11]] },
        { nombre : 'J', color : 'type1', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 2, CONFIG.SPAWN_BLOCK + 12], posiciones : [[-9, 0, 9, -2], [11, 0, -11, -20], [9, 0, -9, 2], [-11, 0, 11, 20]] },
        { nombre : 'Z', color : 'type2', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 11, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 12], posiciones : [[2, 0, 11, 9], [20, 0, 9 , -11], [-2, 0, -11, -9], [-20, 0, -9, 11]] },
        { nombre : 'C', color : 'type0', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 10, CONFIG.SPAWN_BLOCK + 11], posiciones : [[0, 0, 0, 0]] },
        { nombre : 'S', color : 'type1', inicio : [CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 11, CONFIG.SPAWN_BLOCK + 2, CONFIG.SPAWN_BLOCK + 10], posiciones : [[11, 0, 20, -9], [9, 9, -11, 11], [-11, -20, 0, 9], [-9, 11, -9, -11]] },
        { nombre : 'L', color : 'type2', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 2, CONFIG.SPAWN_BLOCK + 10], posiciones: [[-9, 0, 9, -20], [11, 0, -11, 2], [9, 0, -9, 20], [-11, 0, 11, -2]] },
        { nombre : 'I', color : 'type0', inicio : [CONFIG.SPAWN_BLOCK + 9, CONFIG.SPAWN_BLOCK + 10, CONFIG.SPAWN_BLOCK + 11, CONFIG.SPAWN_BLOCK + 12], posiciones : [[-8, 1, 10, 19], [21, 10, -1, -12], [8, -1, -10, -19], [-21, -10, 1, 12]] }
    ];
    
    class Figura {
        static comprobarColisionSuperior = () => {
            let celdaOcupada = false;
            FIGURAS.NXT_FIGURA.inicio.forEach( casilla => { 
                if (tablero.sectores[casilla].color != null) celdaOcupada = true; 
            });
            return celdaOcupada;
        }

        static calcularFigura = () => FIGURAS_DISPONIBLES[ Math.trunc(Math.random() * 7) ];
        
        static generarFigura = objFigura => {
            this.actualizarContadorFiguras(objFigura);
            return new Figura(objFigura);
        }
        
        static actualizarContadorFiguras = objFigura => {
            const contadorFigura = PLAYER.PIEZAS_OBTENIDAS[objFigura.nombre] += 1;
            document.querySelector("p[data-pieza = '" + objFigura.nombre + "']").innerText = contadorFigura.toString().padStart(3,'0');
        }

        static actualizarFiguras = () => {
            FIGURAS.FIG_ACTUAL = this.generarFigura(FIGURAS.NXT_FIGURA || this.calcularFigura());
            FIGURAS.NXT_FIGURA = this.calcularFigura();
            Tablero.actualizarNext();
        }

        constructor(objFigura) {
            objFigura.inicio.forEach( bloque => tablero.sectores[bloque].color = objFigura.color );
            this.posiciones = objFigura.posiciones;
            this.bloques = objFigura.inicio;
            this.nombre = objFigura.nombre;
            this.color = objFigura.color;
            this.pos = 0;

            window.addEventListener('keydown', this.moverFigura, false);

            this.timer = new Temporizador( () => {
                if (!this.comprobarColisiones('ArrowDown')) this.desplazar('ArrowDown');     
                else {
                    window.removeEventListener('keydown', this.timer.pausarJuego, false);
                    window.removeEventListener('visibilitychange', switchStatus, false);
                    window.removeEventListener('keydown', this.moverFigura, false);
                    tablero.comprobarSiHayFilasRellenas();
                    this.timer.detenerTimer();

                    if (Figura.comprobarColisionSuperior()) gameOver();
                    else Figura.actualizarFiguras();
                }
            });
            
            const switchStatus = () => this.timer.switchStatus();
            window.addEventListener('visibilitychange', switchStatus, false);
        }

        moverFigura = evt => {
            switch(evt.code) {
                case 'ArrowDown':
                    if (!FIGURAS.FIG_ACTUAL.comprobarColisiones('ArrowDown')) Tablero.actualizarPuntuacion(1); 
                case 'ArrowLeft':
                case 'ArrowRight':
                    FIGURAS.FIG_ACTUAL.desplazar(evt.code);
                    break;
                case 'ArrowUp':
                    if (evt.repeat != true) FIGURAS.FIG_ACTUAL.girar();
                    break;
                case 'Space':
                    if (evt.repeat != true) FIGURAS.FIG_ACTUAL.drop();
                    break;
            }
        }

        desplazar = direccion => {
            if (!this.comprobarColisiones(direccion)) {
                let cantidadADesplazar;
                switch(direccion) {
                    case 'ArrowLeft': cantidadADesplazar = -1; break;
                    case 'ArrowRight': cantidadADesplazar = 1; break;
                    case 'ArrowDown': cantidadADesplazar = 10; break;
                }
                this.bloques.forEach( bloque => tablero.sectores[bloque].color = null );
                this.bloques = this.bloques.map( bloque => bloque + cantidadADesplazar);
                this.bloques.forEach( bloque => tablero.sectores[bloque].color = this.color );
            }
        }

        comprobarColisiones = direccion => {
            switch(direccion) {
                case 'ArrowLeft':
                    return this.colision(CONFIG.MARGEN_TABLERO_MIN_X, -1);
                case 'ArrowRight':
                    return this.colision(CONFIG.MARGEN_TABLERO_MAX_X, 1);
                case 'ArrowDown':
                    return this.colision(CONFIG.MARGEN_TABLERO_MAX_Y, 10);
            }
        }

        colision = (bordeExterior, bloqueAMirar) => {
            let colision = false;
            this.bloques.forEach( bloque => {
                if (tablero.sectores[bloque].x == bordeExterior) colision = true;
                if (this.bloques.indexOf(bloque + bloqueAMirar) == -1) {
                    if (typeof tablero.sectores[bloque + bloqueAMirar] == 'undefined' || tablero.sectores[bloque + bloqueAMirar].color != null) colision = true;
                } 
            });
            return colision;
        }

        girar = () => {
            if (!this.comprobarGiro(this.posiciones[this.pos])) {
                this.bloques.forEach( bloque => tablero.sectores[bloque].color = null );
                this.bloques = this.bloques.map( (bloque, index) => bloque + this.posiciones[this.pos][index]);
                this.bloques.forEach( bloque => tablero.sectores[bloque].color = this.color );
                new Audio('tetris-js/sound/FX - Spin.mp3').play();
                if (++this.pos > this.posiciones.length - 1) this.pos = 0;
            }
        }

        comprobarGiro = array => {
            let colision = false;
            array.forEach( (celda, index) => {
                if (this.bloques.indexOf(this.bloques[index] + celda) == -1) {
                    if (typeof tablero.sectores[this.bloques[index] + celda] == 'undefined'
                        || tablero.sectores[this.bloques[index] + celda].color != null
                        || (tablero.sectores[this.bloques[index] + celda].x == CONFIG.MARGEN_TABLERO_MIN_X && tablero.sectores[this.bloques[index]].x == CONFIG.MARGEN_TABLERO_MAX_X)
                        || (tablero.sectores[this.bloques[index] + celda].x == CONFIG.MARGEN_TABLERO_MAX_X && tablero.sectores[this.bloques[index]].x == CONFIG.MARGEN_TABLERO_MIN_X)) colision = true;
                }
            });
            return colision;
        }

        drop = () => { while (!this.comprobarColisiones('ArrowDown')) this.desplazar('ArrowDown'), Tablero.actualizarPuntuacion(1); }
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                     Todo lo relacionado con la música del juego...                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    class Gramola {
        constructor() {
            this.soundTrack = new Audio();
            this.soundTrack.volume = 0.4;
            this.soundTrack.loop = true;
            this.status = true;
            
            document.addEventListener('visibilitychange', () => this.switchStatus(), false);
        }

        ponerCancion = cancion => {
            this.soundTrack.src = 'tetris-js/sound/' + cancion + '.mp3';
            this.soundTrack.play();
        }

        switchStatus = () => {
            if (this.status) {
                if (this.soundTrack.src != false && !this.soundTrack.paused) this.soundTrack.pause();
                else if (this.soundTrack.src != false && this.soundTrack.paused) this.soundTrack.play();
            }
        }
    }

    let musica = new Gramola();

    const elegirsoundtrack = evt => {
        if (evt.target.tagName == 'LI' && evt.target.className != 'activo') {
            document.querySelector('.activo').removeAttribute("class");
            evt.target.className = 'activo';
            switch(evt.target.innerText) {
                case 'MUSIC - I':
                case 'MUSIC - 2':
                case 'MUSIC - 3':
                    musica.ponerCancion(evt.target.innerText);
                    break;
                case 'MUTED - X':
                    musica.soundTrack.pause();
                    musica.soundTrack.removeAttribute('src');
                    break;
            }
        }
    }

    document.querySelector('.musica').addEventListener('click', elegirsoundtrack, false);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//        Objetos PLAYER y FIGURAS, donde se almacenarán los stats del usuario y las figuras que se van generando.        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const PLAYER = {
        PIEZAS_OBTENIDAS : ( () => FIGURAS_DISPONIBLES.reduce( (objeto, valor) => {
            objeto[valor.nombre] = 0;
            return objeto;
        }, {} ))(),
        VELOCIDAD : 500,
        PUNTUACION : 0,
        LINEAS : 0,
        NIVEL : 0
    };

    const FIGURAS = { FIG_ACTUAL : null, NXT_FIGURA : null };
    Figura.actualizarFiguras();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//               Creamos una figura y un timer en el que iremos pintando el juego, comprobando colisiones..               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let request;
    const performAnimation = () => {
        canvasPantalla.mostrar();
        tablero.pintarTablero();
        request = requestAnimationFrame(performAnimation);
    };

    requestAnimationFrame(performAnimation);

    const sendScoreAJAX = () => {
        $.ajax({
            type: "POST",
            url: "../score/add",
            data: { "Game": 'Tetris JS', "Score" : PLAYER.PUNTUACION },
            success: (response) => {
                if (response.route) window.location.href = response.route;
            },
            error: () => {
                console.log("AJAX JQUERY DOES BRRRR.");
            }
        });
    }

    const gameOver = () => {
        document.querySelector('.musica').removeEventListener('click', elegirsoundtrack, false);
        new Audio('tetris-js/sound/FX - Game Over.mp3').play();
        cancelAnimationFrame(request);
        musica.switchStatus();
        musica.status = false;

        setTimeout(sendScoreAJAX, 2000);
    };
};