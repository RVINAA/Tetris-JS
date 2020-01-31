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
    };

    class Tablero {
        static actualizarPuntuacion = valor => {
            document.querySelector('.puntuacion').innerText = (PLAYER.PUNTUACION += valor).toString().padStart(8,'0');
        }

        static actualizarLineas = valor => {
            if ((PLAYER.LINEAS += valor).toString().slice(0, PLAYER.LINEAS.toString().length - 1) > PLAYER.NIVEL) Tablero.actualizarNivel();
            document.querySelector('.lineas').innerText = 'LINES - ' + PLAYER.LINEAS.toString().padStart(3,'0');
        }

        static actualizarNivel = () => {
            document.querySelector('.nivel').innerText = 'LEVEL: ' + (++PLAYER.NIVEL), PLAYER.VELOCIDAD -= 10;
            new Audio('SOUND/FX - Level UP.mp3').play();
        }

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
            imagen.src = 'IMGs/casillas/' + PLAYER.NIVEL + '/' + color + '.png';
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
                }
            });

            if (lineasCompletadas > 0) Tablero.actualizarLineas(lineasCompletadas);
            else new Audio('SOUND/FX - Colision.mp3').play();
            if (lineasCompletadas > 0 && lineasCompletadas < 4) {
                new Audio('SOUND/FX - POOR LINE.mp3').play();
                Tablero.actualizarPuntuacion( [40, 100, 300][lineasCompletadas - 1] );
            } else if (lineasCompletadas == 4) {
                new Audio('SOUND/FX - GOOD LINE.mp3').play();
                Tablero.actualizarPuntuacion(1200);
            }
        }
    }

    let tablero = new Tablero();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     Definimos la clase figura de la que heredan las otras figuras y una función que genera aleatoriamente figuras.     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    class Temporizador {
        constructor(funcion) {
            this.funcion = funcion;
            this.iniciarTimer();
        }

        iniciarTimer = () => { this.timer = setInterval(this.funcion, PLAYER.VELOCIDAD); }

        detenerTimer = () => { clearInterval(this.timer); }

        switchStatus = () => {
            if (document.hidden) this.detenerTimer();
            else this.iniciarTimer();
        }

        pausarJuego = () => {

        }
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     Definimos la clase figura de la que heredan las otras figuras y una función que genera aleatoriamente figuras.     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const FIGURAS_DISPONIBLES = [
        { nombre : 'T', color : 'type0', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 11, CONFIG.SPAWN_BLOCK + 2], posiciones : [[-9, 0, -11, 9], [11, 0, -9, -11], [9, 0, 11, -9], [-11, 0, 9, 11]] },
        { nombre : 'J', color : 'type1', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 2, CONFIG.SPAWN_BLOCK + 12], posiciones : [[2, 11, 20, 9], [20, 9, -2, -11], [-2, -11, -20, -9], [-20, -9, 2, 11]] },
        { nombre : 'Z', color : 'type2', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 11, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 12], posiciones : [[2, 0, 11, 9], [20, 0, 9 , -11], [-2, 0, -11, -9], [-20, 0, -9, 11]] },
        { nombre : 'C', color : 'type0', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 10, CONFIG.SPAWN_BLOCK + 11], posiciones : [[1, 10, -10, -1], [10, -1, 1, -10], [-1, -10, 10, 1], [-10, 1, -1, 10]] },
        { nombre : 'S', color : 'type1', inicio : [CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 11, CONFIG.SPAWN_BLOCK + 2, CONFIG.SPAWN_BLOCK + 10], posiciones : [[11, 0, 20, -9], [9, 0, -2, 11], [-11, 0, -20, 9], [-9, 0, 2, -11]] },
        { nombre : 'L', color : 'type2', inicio : [CONFIG.SPAWN_BLOCK, CONFIG.SPAWN_BLOCK + 1, CONFIG.SPAWN_BLOCK + 2, CONFIG.SPAWN_BLOCK + 10], posiciones: [[2, 11, 20, -9], [20, 9, -2, 11], [-2, -11, -20, 9], [-20, -9, 2, -11]] },
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

        static calcularFigura = () => FIGURAS_DISPONIBLES[ Math.floor( (Math.random() * 7) ) ];
        
        static generarFigura = objFigura => {
            this.actualizarContadorFiguras(objFigura);
            return new Figura(objFigura);
        }
        
        static actualizarContadorFiguras = objFigura => {
            const contadorFigura = PLAYER.PIEZAS_OBTENIDAS[objFigura.nombre] += 1;
            document.querySelector("p[data-pieza = '" + objFigura.nombre + "']").innerText = contadorFigura.toString().padStart(3,'0');
        }

        static actualizarFiguras = () => {
            FIGURAS.FIG_ACTUAL = this.generarFigura(FIGURAS.NXT_FIGURA);
            FIGURAS.NXT_FIGURA = this.calcularFigura();
        }

        //////////////////////////////////////////////////////////////

        constructor(objFigura) {
            objFigura.inicio.forEach( bloque => tablero.sectores[bloque].color = objFigura.color );
            this.posiciones = objFigura.posiciones;
            this.bloques = objFigura.inicio;
            this.nombre = objFigura.nombre;
            this.color = objFigura.color;
            this.pos = 0;

            window.addEventListener('keydown', this.moverFigura, false);

            let timer = new Temporizador( () => {
                if (!this.comprobarColisiones('ArrowDown')) this.desplazar('ArrowDown');     
                else {
                    window.removeEventListener('visibilitychange', switchStatus, false);
                    window.removeEventListener('keydown', this.moverFigura, false);
                    tablero.comprobarSiHayFilasRellenas();
                    timer.detenerTimer();

                    if (Figura.comprobarColisionSuperior()) gameOver();
                    else Figura.actualizarFiguras();
                }
            });
            
            const switchStatus = () => timer.switchStatus();
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
                    FIGURAS.FIG_ACTUAL.drop();
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
                new Audio('SOUND/FX - Spin.mp3').play();
                if (++this.pos > 3) this.pos = 0;
            }
        }

        comprobarGiro = array => {

        }

        drop = () => { while (!this.comprobarColisiones('ArrowDown')) this.desplazar('ArrowDown'), Tablero.actualizarPuntuacion(1); }
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         Todo lo relacionado al Jugador; niveles, puntuación, velocidad de la partida, colores de las fichas...         //
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

    const FIGURAS = {
        FIG_ACTUAL : Figura.generarFigura(Figura.calcularFigura()),
        NXT_FIGURA : Figura.calcularFigura()
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//               Creamos una figura y un timer en el que iremos pintando el juego, comprobando colisiones..               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let request;
    const performAnimation = () => {
        request = requestAnimationFrame(performAnimation);
        canvasPantalla.mostrar();
        tablero.pintarTablero();
    };

    requestAnimationFrame(performAnimation);

    const gameOver = () => {
        cancelAnimationFrame(request);
        console.log('Perdiste');
    };
};