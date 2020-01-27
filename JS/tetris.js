document.addEventListener("DOMContentLoaded", () => TETRIS(), false);

const TETRIS = () => {

    const CONFIG = {
        BLOQUE_GENERADOR_DE_PIEZA : 4,
        MARGEN_TABLERO_MAX_Y : 190,
        MARGEN_TABLERO_MAX_X : 90,
        MARGEN_TABLERO_MIN_Y : 0,
        MARGEN_TABLERO_MIN_X : 0,
        PIEZAS_EN_UNA_FILA : 10,
        DIMENSION_BLOQUE : 10,
        HEIGHT_CANVAS : 200,
        WIDTH_CANVAS : 100
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

    let contadorX = -10; let contadorY = 0;
    let tableroArray = new Array( (CONFIG.HEIGHT_CANVAS / CONFIG.DIMENSION_BLOQUE) * (CONFIG.WIDTH_CANVAS / CONFIG.DIMENSION_BLOQUE) ).fill('.');
    tableroArray = tableroArray.map( (casilla) => {
        if (contadorX == CONFIG.MARGEN_TABLERO_MAX_X) { contadorY += CONFIG.DIMENSION_BLOQUE; contadorX = -(CONFIG.DIMENSION_BLOQUE); }
        return new casillaTablero(contadorX += CONFIG.DIMENSION_BLOQUE, contadorY);
    });

    function casillaTablero(x, y) {
        this.color = null;
        this.x = x;
        this.y = y;
    }

    const pintarTablero = () => {
        tableroArray.forEach( casilla => {
            if (casilla.color != null) pintarBloque(casilla.color, casilla.x, casilla.y);
            //else pintarBloque('empty', casilla.x, casilla.y);
        });
    }

    const pintarBloque = (color, x, y) => {
        const bloque = canvasPantalla.context;
        const imagen = new Image();
        imagen.src = 'IMGs/casillas/0/' + color + '.png';
        bloque.fillStyle = color;
        bloque.drawImage(imagen, x, y, CONFIG.DIMENSION_BLOQUE, CONFIG.DIMENSION_BLOQUE);  
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     Definimos la clase figura de la que heredan las otras figuras y una función que genera aleatoriamente figuras.     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const extend = (Hijo, Padre) => {
        Hijo.prototype = Object.create(Padre.prototype);
        Hijo.prototype.constuctor = Hijo;
    }

    function Figura(array, color) {
        array.forEach( bloque => tableroArray[bloque].color = color );
        this.colisionDetectada = false;
        this.bloques = array;
        this.color = color;
    }

    const comprobarSiSePuedeGenerarLaFigura = celdaOcupada => {
        POSICIONES_INICIALES[FIGURAS.NXT_FIGURA].forEach( casilla => { 
            if (tableroArray[casilla].color != null) celdaOcupada = true; 
        });
        return celdaOcupada;
    }

    const calcularFigura = () => Object.keys(POSICIONES_INICIALES)[Math.floor( (Math.random() * 7) )];

    const generarFigura = codigoDeFiguraAleatoria => { // Aquí un switch que devuelve el new Figura*
        añadirPiezaGeneradaAlMarcador('T');
        return new FiguraT();
    }

    const actualizarFiguras = () => {
        FIGURAS.FIG_ACTUAL = generarFigura(FIGURAS.NXT_FIGURA);
        FIGURAS.NXT_FIGURA = calcularFigura();
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                        La parte más larga, todas las figuras que extienden de la clase Figura..                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const POSICIONES_INICIALES = {
        T  : [CONFIG.BLOQUE_GENERADOR_DE_PIEZA, CONFIG.BLOQUE_GENERADOR_DE_PIEZA + 1, CONFIG.BLOQUE_GENERADOR_DE_PIEZA + 2, CONFIG.BLOQUE_GENERADOR_DE_PIEZA + 11],
        L2 : [],
        N1 : [],
        C  : [CONFIG.BLOQUE_GENERADOR_DE_PIEZA, CONFIG.BLOQUE_GENERADOR_DE_PIEZA + 1, CONFIG.BLOQUE_GENERADOR_DE_PIEZA + 10, CONFIG.BLOQUE_GENERADOR_DE_PIEZA + 11],
        L1 : [],
        N2 : [],
        I  : [CONFIG.BLOQUE_GENERADOR_DE_PIEZA - 1, CONFIG.BLOQUE_GENERADOR_DE_PIEZA, CONFIG.BLOQUE_GENERADOR_DE_PIEZA + 1, CONFIG.BLOQUE_GENERADOR_DE_PIEZA + 2]
    }

    extend(FiguraT, Figura);
    function FiguraT() {
        /*
         *               0          0          0   
         *    0  1  2    1  2    2  1  3    2  1
         *       3       3                     3
         */
        const REFERENCIA = this;
        let posicion = 0;

        Figura.call(this, POSICIONES_INICIALES.T, 'type1');
        window.addEventListener('keydown', moverFigura, false);

        let timerFiguraDescenso = setInterval( () => {
            if (comprobarColisionesDescendientes(this.bloques)) {
                window.removeEventListener('keydown', moverFigura, false);
                new Audio('SOUND/FX - Colision.mp3').play();
                clearInterval(timerFiguraDescenso);
                this.colisionDetectada = true;      
            } else {
                this.bloques = this.bloques.map( (bloque, index) => {
                    return desplazarPiramideParaAbajo(bloque, index, this.color);
                });
            }
         }, PLAYER.VELOCIDAD );

        function moverFigura(evt) {

            switch (evt.code) {
                case 'ArrowLeft':
                    if (comprobarColisionIzquierda(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarPiramideParaLaIzquierda(bloque, index, REFERENCIA.color);
                        });
                        new Audio('SOUND/FX - Desplazar.mp3').play();
                    }
                    break;
                case 'ArrowRight':
                    if (comprobarColisionDerecha(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                           return desplazarPiramideParaLaDerecha(bloque, index, REFERENCIA.color);
                        });
                        new Audio('SOUND/FX - Desplazar.mp3').play();
                    }
                    break;
                case 'ArrowDown':
                    if (!comprobarColisionesDescendientes(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarPiramideParaAbajo(bloque, index, REFERENCIA.color);
                        });
                    }
                    break;  
                case 'ArrowUp':
                    if (evt.repeat == true) return false;
                    if (++posicion == 4) posicion = 0;
                    if (comprobarColisionRotacionDisponible(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return girarFigura(bloque, index, REFERENCIA.color);
                        });
                        new Audio('SOUND/FX - Spin.mp3').play();
                    } else if (--posicion == -1) posicion = 3;
                    break;
            }
        }

        function girarFigura(bloque, index, color) {
            switch(posicion) {
                case 0:
                    switch(index) {
                        case 0:
                            tableroArray[bloque].color = null;
                            return bloque + 9;
                        case 2:
                            tableroArray[bloque + 2].color = color;
                            return bloque + 2;
                        default:
                            return bloque;
                    }
                case 1:
                    switch(index) {
                        case 0:
                            tableroArray[bloque].color = null;
                            tableroArray[bloque - 9].color = color;
                            return bloque - 9;
                        default:
                            return bloque;
                    }
                case 2:
                    switch(index) {
                        case 2:
                            tableroArray[bloque - 2].color = color;
                            return bloque - 2;
                        case 3:
                            tableroArray[bloque].color = null;
                            return bloque - 9;
                        default:
                            return bloque;
                    }
                case 3:
                    switch(index) {
                        case 3:
                            tableroArray[bloque].color = null;
                            tableroArray[bloque + 9].color = color;
                            return bloque + 9;
                        default:
                            return bloque;
                    }
            }
        }

        function comprobarColisionRotacionDisponible(bloques) {
            switch(posicion) {
                case 0:
                    return tableroArray[bloques[1]].x < CONFIG.MARGEN_TABLERO_MAX_X && tableroArray[bloques[2] + 2].color == null;
                case 1:
                    return tableroArray[bloques[1]].y > CONFIG.MARGEN_TABLERO_MIN_Y && tableroArray[bloques[0] - 9].color == null;
                case 2:
                    return tableroArray[bloques[1]].x > CONFIG.MARGEN_TABLERO_MIN_X && tableroArray[bloques[2] - 2].color == null;
                case 3:
                    return tableroArray[bloques[1]].y < CONFIG.MARGEN_TABLERO_MAX_Y && tableroArray[bloques[3] + 9].color == null;
            }
        }

        function comprobarColisionIzquierda(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[0]].x > CONFIG.MARGEN_TABLERO_MIN_X && 
                            tableroArray[bloques[0] - 1].color == null && 
                            tableroArray[bloques[3] - 1].color == null; 
                case 1:
                    return  tableroArray[bloques[0]].x > CONFIG.MARGEN_TABLERO_MIN_X && 
                            tableroArray[bloques[0] - 1].color == null &&
                            tableroArray[bloques[1] - 1].color == null &&  
                            tableroArray[bloques[3] - 1].color == null; 
                case 2:
                    return  tableroArray[bloques[2]].x > CONFIG.MARGEN_TABLERO_MIN_X && 
                            tableroArray[bloques[0] - 1].color == null && 
                            tableroArray[bloques[2] - 1].color == null; 
                case 3:
                    return  tableroArray[bloques[2]].x > CONFIG.MARGEN_TABLERO_MIN_X && 
                            tableroArray[bloques[0] - 1].color == null &&
                            tableroArray[bloques[2] - 1].color == null && 
                            tableroArray[bloques[3] - 1].color == null; 
            }
        }

        function comprobarColisionDerecha(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[2]].x < CONFIG.MARGEN_TABLERO_MAX_X && 
                            tableroArray[bloques[2] + 1].color == null && 
                            tableroArray[bloques[3] + 1].color == null;
                case 1:
                    return  tableroArray[bloques[2]].x < CONFIG.MARGEN_TABLERO_MAX_X &&
                            tableroArray[bloques[0] + 1].color == null &&
                            tableroArray[bloques[2] + 1].color == null &&  
                            tableroArray[bloques[3] + 1].color == null; 
                case 2:
                    return  tableroArray[bloques[3]].x < CONFIG.MARGEN_TABLERO_MAX_X && 
                            tableroArray[bloques[0] + 1].color == null && 
                            tableroArray[bloques[3] + 1].color == null; 
                case 3:
                    return  tableroArray[bloques[0]].x < CONFIG.MARGEN_TABLERO_MAX_X &&
                            tableroArray[bloques[0] + 1].color == null &&
                            tableroArray[bloques[1] + 1].color == null &&  
                            tableroArray[bloques[3] + 1].color == null; 
            }
        }

        function desplazarPiramideParaLaIzquierda(bloque, index, color) {
            switch(posicion) {
                case 0:
                    if (index == 2 || index == 3) tableroArray[bloque].color = null;
                    if (index == 0 || index == 3) tableroArray[bloque - 1].color = color;
                    return bloque - 1;
                case 1:
                    if (index != 1) tableroArray[bloque].color = null;
                    if (index != 2) tableroArray[bloque - 1].color = color;
                    return bloque - 1;
                case 2:
                    if (index == 0 || index == 3) tableroArray[bloque].color = null;
                    if (index == 0 || index == 2) tableroArray[bloque - 1].color = color;
                    return bloque - 1;
                case 3:
                    if (index != 2) tableroArray[bloque].color = null;
                    if (index != 1) tableroArray[bloque - 1].color = color;
                    return bloque - 1;
            }
        }

        function desplazarPiramideParaLaDerecha(bloque, index, color) {
            switch(posicion) {
                case 0:
                    if (index == 0 || index == 3) tableroArray[bloque].color = null;
                    if (index == 2 || index == 3) tableroArray[bloque + 1].color = color;
                    return bloque + 1;
                case 1:
                    if (index != 2) tableroArray[bloque].color = null;
                    if (index != 1) tableroArray[bloque + 1].color = color;
                    return bloque + 1;
                case 2:
                    if (index == 0 || index == 2) tableroArray[bloque].color = null;
                    if (index == 0 || index == 3) tableroArray[bloque + 1].color = color;
                    return bloque + 1;
                case 3:
                    if (index != 1) tableroArray[bloque].color = null;
                    if (index != 2) tableroArray[bloque + 1].color = color;
                    return bloque + 1;
            }
        }

        function comprobarColisionesDescendientes(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[3]].y == CONFIG.MARGEN_TABLERO_MAX_Y || 
                            tableroArray[bloques[0] + CONFIG.PIEZAS_EN_UNA_FILA].color != null ||
                            tableroArray[bloques[2] + CONFIG.PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[3] + CONFIG.PIEZAS_EN_UNA_FILA].color != null;
                case 1:
                    return  tableroArray[bloques[3]].y == CONFIG.MARGEN_TABLERO_MAX_Y ||
                            tableroArray[bloques[2] + CONFIG.PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[3] + CONFIG.PIEZAS_EN_UNA_FILA].color != null;
                case 2:
                    return  tableroArray[bloques[1]].y == CONFIG.MARGEN_TABLERO_MAX_Y || 
                            tableroArray[bloques[1] + CONFIG.PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[2] + CONFIG.PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[3] + CONFIG.PIEZAS_EN_UNA_FILA].color != null;
                case 3:
                    return  tableroArray[bloques[3]].y == CONFIG.MARGEN_TABLERO_MAX_Y ||
                            tableroArray[bloques[2] + CONFIG.PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[3] + CONFIG.PIEZAS_EN_UNA_FILA].color != null;
            }
        }

        function desplazarPiramideParaAbajo(bloque, index, color) {
            switch(posicion) {
                case 0:
                    if (index != 1) tableroArray[bloque + CONFIG.PIEZAS_EN_UNA_FILA].color = color;
                    if (index != 3) tableroArray[bloque].color = null;
                    break;
                case 1:
                case 3:
                    if (index != 0 && index != 1) tableroArray[bloque + CONFIG.PIEZAS_EN_UNA_FILA].color = color;
                    if (index != 1 && index != 3) tableroArray[bloque].color = null;
                    break;
                case 2:
                    if (index != 0) tableroArray[bloque + CONFIG.PIEZAS_EN_UNA_FILA].color = color;
                    if (index != 1) tableroArray[bloque].color = null;
                    break;
            }
            return bloque + CONFIG.PIEZAS_EN_UNA_FILA;
        }
    }

    extend(FiguraC, Figura);
    function FiguraC() {
        const REFERENCIA = this;

        Figura.call(this, POSICIONES_INICIALES.C, 'type0');
        window.addEventListener('keydown', moverFigura, false);

        let timerFiguraDescenso = setInterval( () => {
            if (comprobarColisionesDescendientes(this.bloques)) {
                window.removeEventListener('keydown', moverFigura, false);
                new Audio('SOUND/FX - Colision.mp3').play();
                clearInterval(timerFiguraDescenso);
                this.colisionDetectada = true;
            } else {
                this.bloques = this.bloques.map( (bloque, index) => {
                    return desplazarCuadradoParaAbajo(bloque, index, this.color);
                });
            }
         }, PLAYER.VELOCIDAD );

        function moverFigura(evt) {
            switch (evt.code) {
                case 'ArrowLeft':
                    if (comprobarColisionIzquierda(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarCuadradoParaLaIzquierda(bloque, index, REFERENCIA.color);
                        });
                        new Audio('SOUND/FX - Desplazar.mp3').play();
                    }
                    break;
                case 'ArrowRight':
                    if (comprobarColisionDerecha(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarCuadradoParaLaDerecha(bloque, index, REFERENCIA.color);
                        });
                        new Audio('SOUND/FX - Desplazar.mp3').play();
                    }
                    break;
                case 'ArrowDown':
                    if (!comprobarColisionesDescendientes(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarCuadradoParaAbajo(bloque, index, REFERENCIA.color);
                        });
                    }
                    break;
                case 'ArrowUp':
                    if (evt.repeat == true) return false;
                    new Audio('SOUND/FX - Spin.mp3').play();
                    break;
            }
        }

        function comprobarColisionIzquierda(bloques) {
            return  tableroArray[bloques[0]].x > CONFIG.MARGEN_TABLERO_MIN_X && 
                    tableroArray[bloques[2]].x > CONFIG.MARGEN_TABLERO_MIN_X && 
                    tableroArray[bloques[0] - 1].color == null && 
                    tableroArray[bloques[2] - 1].color == null;
        }

        function comprobarColisionDerecha(bloques) {
            return  tableroArray[bloques[1]].x < CONFIG.MARGEN_TABLERO_MAX_X && 
                    tableroArray[bloques[3]].x < CONFIG.MARGEN_TABLERO_MAX_X && 
                    tableroArray[bloques[1] + 1].color == null && 
                    tableroArray[bloques[3] + 1].color == null;
        }

        function desplazarCuadradoParaLaIzquierda(bloque, index, color) {
            (index == 1 || index == 3) ? tableroArray[bloque].color = null : tableroArray[bloque - 1].color = color;
            return bloque - 1;
        }

        function desplazarCuadradoParaLaDerecha(bloque, index, color) {
            (index == 0 || index == 2) ? tableroArray[bloque].color = null : tableroArray[bloque + 1].color = color;
            return bloque + 1;
        }

        function comprobarColisionesDescendientes(bloques) {
            return  tableroArray[bloques[3]].y == CONFIG.MARGEN_TABLERO_MAX_Y || 
                    tableroArray[bloques[2] + CONFIG.PIEZAS_EN_UNA_FILA].color != null || 
                    tableroArray[bloques[3] + CONFIG.PIEZAS_EN_UNA_FILA].color != null;
        }

        function desplazarCuadradoParaAbajo(bloque, index, color) {
            (index == 0 || index == 1) ? tableroArray[bloque].color = null : tableroArray[bloque + CONFIG.PIEZAS_EN_UNA_FILA].color = color;
            return bloque + CONFIG.PIEZAS_EN_UNA_FILA;
        }
    }
    
    extend(FiguraI, Figura);
    function FiguraI() {
        /* 
         *                      0
         *                      1
         *      0  1  2  3      2   
         *                      3
         */
        const REFERENCIA = this;
        let posicion = 0;

        Figura.call(this, POSICIONES_INICIALES.I, 'type0');
        window.addEventListener('keydown', moverFigura, false);

        let timerFiguraDescenso = setInterval( () => {
            if (comprobarColisionesDescendientes(this.bloques)) {
                window.removeEventListener('keydown', moverFigura, false);
                new Audio('SOUND/FX - Colision.mp3').play();
                clearInterval(timerFiguraDescenso);
                this.colisionDetectada = true;      
            } else {
                this.bloques = this.bloques.map( (bloque, index) => {
                    return desplazarLineaParaAbajo(bloque, index, this.color);
                });
            }
         }, PLAYER.VELOCIDAD );
        
        function moverFigura(evt) {

            switch (evt.code) {
                case 'ArrowLeft':
                    if (comprobarColisionIzquierda(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarLineaParaLaIzquierda(bloque, index, REFERENCIA.color);
                        });
                        new Audio('SOUND/FX - Desplazar.mp3').play();
                    }
                    break;
                case 'ArrowRight':
                    if (comprobarColisionDerecha(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                           return desplazarLineaParaLaDerecha(bloque, index, REFERENCIA.color);
                        });
                        new Audio('SOUND/FX - Desplazar.mp3').play();
                    }
                    break;
                case 'ArrowDown':
                    if (!comprobarColisionesDescendientes(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarLineaParaAbajo(bloque, index, REFERENCIA.color);
                        });
                    }
                    break;  
                case 'ArrowUp':
                    if (evt.repeat == true) return false;
                    if (++posicion == 2) posicion = 0;
                    if (comprobarColisionRotacionDisponible(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return girarFigura(bloque, index, REFERENCIA.color);
                        });
                        new Audio('SOUND/FX - Spin.mp3').play();
                    } else if (--posicion == -1) posicion = 1;
                    break;
            }
        }
        
        function girarFigura(bloque, index, color) {
            switch(posicion) {
                case 0:
                    switch(index) {
                        case 0:
                            tableroArray[bloque].color = null;
                            tableroArray[bloque + 18].color = color;
                            return bloque + 18;
                        case 1:
                            tableroArray[bloque].color = null;
                            tableroArray[bloque + 9].color = color;
                            return bloque + 9;
                        case 3:
                            tableroArray[bloque].color = null;
                            tableroArray[bloque - 9].color = color;
                            return bloque - 9;
                        default:
                            return bloque;
                    }
                case 1:
                    switch(index) {
                        case 0:
                            tableroArray[bloque].color = null;
                            tableroArray[bloque - 18].color = color;
                            return bloque - 18;
                        case 1:
                            tableroArray[bloque].color = null;
                            tableroArray[bloque - 9].color = color;
                            return bloque - 9;
                        case 3:
                            tableroArray[bloque].color = null;
                            tableroArray[bloque + 9].color = color;
                            return bloque + 9;
                        default:
                            return bloque;
                    }
            }
        }

        function comprobarColisionRotacionDisponible(bloques) {
            switch(posicion) {
                case 0:
                    return tableroArray[bloques[2]].x > (CONFIG.MARGEN_TABLERO_MIN_X + 10) && tableroArray[bloques[2]].x < CONFIG.MARGEN_TABLERO_MAX_X && tableroArray[bloques[0] + 18].color == null && tableroArray[bloques[1] + 9].color == null && tableroArray[bloques[3] - 9].color == null;
                case 1:
                    return tableroArray[bloques[2]].y > (CONFIG.MARGEN_TABLERO_MIN_Y + 10) && tableroArray[bloques[2]].y < (CONFIG.MARGEN_TABLERO_MAX_Y) && tableroArray[bloques[0] - 18].color == null && tableroArray[bloques[1] - 9].color == null && tableroArray[bloques[3] + 9].color == null;
            }
        }

        function comprobarColisionIzquierda(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[0]].x > CONFIG.MARGEN_TABLERO_MIN_X && 
                            tableroArray[bloques[0] - 1].color == null;
                case 1:
                    return  tableroArray[bloques[0]].x > CONFIG.MARGEN_TABLERO_MIN_X && 
                            tableroArray[bloques[0] - 1].color == null &&
                            tableroArray[bloques[1] - 1].color == null &&
                            tableroArray[bloques[2] - 1].color == null &&
                            tableroArray[bloques[3] - 1].color == null;
            }
        }

        function comprobarColisionDerecha(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[3]].x < CONFIG.MARGEN_TABLERO_MAX_X &&
                            tableroArray[bloques[3] + 1].color == null;
                case 1:
                    return  tableroArray[bloques[2]].x < CONFIG.MARGEN_TABLERO_MAX_X &&
                            tableroArray[bloques[0] + 1].color == null &&
                            tableroArray[bloques[1] + 1].color == null &&
                            tableroArray[bloques[2] + 1].color == null &&
                            tableroArray[bloques[3] + 1].color == null;
            }
        }

        function desplazarLineaParaLaIzquierda(bloque, index, color) {
            switch(posicion) {
                case 0:
                    if (index == 0) tableroArray[bloque - 1].color = color;
                    if (index == 3) tableroArray[bloque].color = null;
                    return bloque - 1;
                case 1:
                    tableroArray[bloque].color = null;
                    tableroArray[bloque - 1].color = color;
                    return bloque - 1;
            }
        }

        function desplazarLineaParaLaDerecha(bloque, index, color) {
            switch(posicion) {
                case 0:
                    if (index == 0) tableroArray[bloque].color = null;
                    if (index == 3) tableroArray[bloque + 1].color = color;
                    return bloque + 1;
                case 1:
                    tableroArray[bloque].color = null;
                    tableroArray[bloque + 1].color = color;
                    return bloque + 1;
            }
        }

        function comprobarColisionesDescendientes(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[2]].y == CONFIG.MARGEN_TABLERO_MAX_Y ||
                            tableroArray[bloques[0] + CONFIG.PIEZAS_EN_UNA_FILA].color != null |
                            tableroArray[bloques[1] + CONFIG.PIEZAS_EN_UNA_FILA].color != null ||
                            tableroArray[bloques[2] + CONFIG.PIEZAS_EN_UNA_FILA].color != null ||
                            tableroArray[bloques[3] + CONFIG.PIEZAS_EN_UNA_FILA].color != null;
                case 1:
                    return  tableroArray[bloques[3]].y == CONFIG.MARGEN_TABLERO_MAX_Y ||
                            tableroArray[bloques[3] + CONFIG.PIEZAS_EN_UNA_FILA].color != null;
            }
        }

        function desplazarLineaParaAbajo(bloque, index, color) {
            switch(posicion) {
                case 0:
                    tableroArray[bloque].color = null;
                    tableroArray[bloque + CONFIG.PIEZAS_EN_UNA_FILA].color = color;
                    break;
                case 1:
                    if (index == 0) tableroArray[bloque].color = null;
                    if (index == 3)  tableroArray[bloque + CONFIG.PIEZAS_EN_UNA_FILA].color = color;
                    break;
            }
            return bloque + CONFIG.PIEZAS_EN_UNA_FILA;
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//         Todo lo relacionado al Jugador; niveles, puntuación, velocidad de la partida, colores de las fichas...         //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const PLAYER = {
        PIEZAS_OBTENIDAS : ( () => Object.keys(POSICIONES_INICIALES).reduce( (objeto, valor) => {
            objeto[valor] = 0;
            return objeto;
        }, {} ))(),
        PUNTUACION : '00000000',
        VELOCIDAD : 500,
        LINEAS : 0,
        NIVEL : 0
    }

    const añadirPiezaGeneradaAlMarcador = codigoFigura => {
        PLAYER.PIEZAS_OBTENIDAS[codigoFigura] += 1;
        document.querySelector("p[data-pieza = '" + codigoFigura + "']").innerText = PLAYER.PIEZAS_OBTENIDAS[codigoFigura].toString().padStart(3,'0');
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//               Creamos una figura y un timer en el que iremos pintando el juego, comprobando colisiones..               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
    const FIGURAS = {
        FIG_ACTUAL : generarFigura( calcularFigura() ),
        NXT_FIGURA : calcularFigura()
    }

    let request;
    const performAnimation = () => {
        request = requestAnimationFrame(performAnimation);
        if (FIGURAS.FIG_ACTUAL.colisionDetectada) {
            comprobarSiHayFilasRellenas();
            if (!comprobarSiSePuedeGenerarLaFigura(false)) actualizarFiguras();
            else gameOver();
        }
        canvasPantalla.mostrar();
        pintarTablero();
    }

    requestAnimationFrame(performAnimation);

    const comprobarSiHayFilasRellenas = () => {
        let lineasCompletadas = 0;
        let coincidencias = 0;

        tableroArray.forEach( (casilla, index) => {
            if (index != 0 && index % 10 == 0) coincidencias = 0;
            if (casilla.color != null) ++coincidencias;
            if (coincidencias == CONFIG.PIEZAS_EN_UNA_FILA) {
                Object.keys(tableroArray.slice(0, index + 1)).reverse().map( currentIndex => {
                    if (currentIndex >= CONFIG.PIEZAS_EN_UNA_FILA) tableroArray[currentIndex].color = tableroArray[currentIndex - CONFIG.PIEZAS_EN_UNA_FILA].color;
                    else tableroArray[currentIndex].color = null;
                });
                ++lineasCompletadas;
            }
        });

        if (lineasCompletadas > 0 && lineasCompletadas < 4) new Audio('SOUND/FX - POOR LINE.mp3').play();
        else if(lineasCompletadas == 4) new Audio('SOUND/FX - GOOD LINE.mp3').play();
    }

    const gameOver = () => {
        cancelAnimationFrame(request);
        console.log('Perdiste');
    }

};