const TETRIS = ( () => {
    const MAX_MARGENES_TABLERO = [0, 190, 90, 0];
    const BLOQUE_GENERADOR_DE_PIEZA = 4;
    const PIEZAS_EN_UNA_FILA = 10;
    const DIMENSION_BLOQUE = 10;
    const HEIGHT_CANVAS = 200;
    const WIDTH_CANVAS = 100;
    let VELOCIDAD = 300;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Creamos un canvas, posteriormente creamos un tablero donde guardaremos cada celda, su posición y un color a pintar.  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let canvasPantalla = {
        canvas : document.createElement('canvas'),
        mostrar : function() {
            document.querySelector('.tablero').appendChild(this.canvas);
            this.context = this.canvas.getContext('2d');
            this.canvas.height = HEIGHT_CANVAS;
            this.canvas.width = WIDTH_CANVAS;
        }
    };

    let contadorX = -10; let contadorY = 0;
    let tableroArray = new Array( (HEIGHT_CANVAS / DIMENSION_BLOQUE) * (WIDTH_CANVAS / DIMENSION_BLOQUE) ).fill('.');
    tableroArray = tableroArray.map( (casilla) => {
        if (contadorX == MAX_MARGENES_TABLERO[2]) { contadorY += DIMENSION_BLOQUE; contadorX = -(DIMENSION_BLOQUE); }
        return new casillaTablero(contadorX += DIMENSION_BLOQUE, contadorY);
    });

    function casillaTablero(x, y) {
        this.color = null;
        this.x = x;
        this.y = y;
    }

    function pintarTablero() {
        tableroArray.forEach( casilla => {
            if (casilla.color != null) pintarBloque(casilla.color, casilla.x, casilla.y);
            else pintarBloque('empty', casilla.x, casilla.y);
        });
    }

    function pintarBloque(color, x, y) {
        const bloque = canvasPantalla.context;
        const imagen = new Image();
        imagen.src = 'IMGs/casillas/' + color + '.png';
        bloque.fillStyle = color;
        bloque.drawImage(imagen, x, y, DIMENSION_BLOQUE, DIMENSION_BLOQUE);  
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     Definimos la clase figura de la que heredan las otras figuras y una función que genera aleatoriamente figuras.     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const extend = function(Hijo, Padre) {
        Hijo.prototype = Object.create(Padre.prototype);
        Hijo.prototype.constuctor = Hijo;
    }

    function generarFigura() { // Hasta que hagamos más figuras.
        return new FiguraT();
    }

    function Figura(array, color) {
        array.forEach( bloque => { tableroArray[bloque].color = color; });
        this.colisionDetectada = false;
        this.bloques = array;
        this.color = color;
    }
    
    extend(FiguraT, Figura);
    function FiguraT() {
        /*               0          0          0   
         *    0  1  2    1  2    2  1  3    2  1
         *       3       3                     3
         */
        const INICIO = [BLOQUE_GENERADOR_DE_PIEZA, BLOQUE_GENERADOR_DE_PIEZA + 1, BLOQUE_GENERADOR_DE_PIEZA + 2, BLOQUE_GENERADOR_DE_PIEZA + 11];
        const REFERENCIA = this;
        let posicion = 0;

        Figura.call(this, INICIO, 'purple');
        window.addEventListener('keydown', moverFigura, false);

        let timerFiguraDescenso = setInterval( () => {
            if (comprobarColisionesDescendientes(this.bloques)) {
                window.removeEventListener('keydown', moverFigura, false);
                clearInterval(timerFiguraDescenso);
                this.colisionDetectada = true;
            } else {
                this.bloques = this.bloques.map( (bloque, index) => {
                    return desplazarPiramideParaAbajo(bloque, index, this.color);
                });
            }
         }, VELOCIDAD );

        function moverFigura(evt) {
            switch (evt.code) {
                case 'ArrowLeft':
                    if (comprobarColisionIzquierda(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarPiramideParaLaIzquierda(bloque, index, REFERENCIA.color);
                        });
                    }
                    break;
                case 'ArrowRight':
                    if (comprobarColisionDerecha(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                           return desplazarPiramideParaLaDerecha(bloque, index, REFERENCIA.color);
                        });
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
                    if (++posicion == 4) posicion = 0;
                    if (comprobarColisionRotacionDisponible(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return girarFigura(bloque, index, REFERENCIA.color);
                        });
                        
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
                    return tableroArray[bloques[1]].x < MAX_MARGENES_TABLERO[2] && tableroArray[bloques[2] + 2].color == null;
                case 1:
                    return tableroArray[bloques[1]].y > MAX_MARGENES_TABLERO[3] && tableroArray[bloques[0] - 9].color == null;
                case 2:
                    return tableroArray[bloques[1]].x > MAX_MARGENES_TABLERO[0] && tableroArray[bloques[2] - 2].color == null;
                case 3:
                    return tableroArray[bloques[1]].y < MAX_MARGENES_TABLERO[1] && tableroArray[bloques[3] + 9].color == null;
            }
        }

        function comprobarColisionesDescendientes(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[3]].y == MAX_MARGENES_TABLERO[1] || 
                            tableroArray[bloques[0] + PIEZAS_EN_UNA_FILA].color != null ||
                            tableroArray[bloques[2] + PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[3] + PIEZAS_EN_UNA_FILA].color != null;
                case 1:
                    return  tableroArray[bloques[3]].y == MAX_MARGENES_TABLERO[1] ||
                            tableroArray[bloques[2] + PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[3] + PIEZAS_EN_UNA_FILA].color != null;
                case 2:
                    return  tableroArray[bloques[1]].y == MAX_MARGENES_TABLERO[1] || 
                            tableroArray[bloques[1] + PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[2] + PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[3] + PIEZAS_EN_UNA_FILA].color != null;
                case 3:
                    return  tableroArray[bloques[3]].y == MAX_MARGENES_TABLERO[1] ||
                            tableroArray[bloques[2] + PIEZAS_EN_UNA_FILA].color != null || 
                            tableroArray[bloques[3] + PIEZAS_EN_UNA_FILA].color != null;
            }
        }

        function comprobarColisionIzquierda(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[0]].x > MAX_MARGENES_TABLERO[0] && 
                            tableroArray[bloques[0] - 1].color == null && 
                            tableroArray[bloques[3] - 1].color == null; 
                case 1:
                    return  tableroArray[bloques[0]].x > MAX_MARGENES_TABLERO[0] && 
                            tableroArray[bloques[0] - 1].color == null &&
                            tableroArray[bloques[1] - 1].color == null &&  
                            tableroArray[bloques[3] - 1].color == null; 
                case 2:
                    return  tableroArray[bloques[2]].x > MAX_MARGENES_TABLERO[0] && 
                            tableroArray[bloques[0] - 1].color == null && 
                            tableroArray[bloques[2] - 1].color == null; 
                case 3:
                    return  tableroArray[bloques[2]].x > MAX_MARGENES_TABLERO[0] && 
                            tableroArray[bloques[0] - 1].color == null &&
                            tableroArray[bloques[2] - 1].color == null && 
                            tableroArray[bloques[3] - 1].color == null; 
            }
        }

        function comprobarColisionDerecha(bloques) {
            switch(posicion) {
                case 0:
                    return  tableroArray[bloques[2]].x < MAX_MARGENES_TABLERO[2] && 
                            tableroArray[bloques[2] + 1].color == null && 
                            tableroArray[bloques[3] + 1].color == null;
                case 1:
                    return  tableroArray[bloques[2]].x < MAX_MARGENES_TABLERO[2] &&
                            tableroArray[bloques[0] + 1].color == null &&
                            tableroArray[bloques[2] + 1].color == null &&  
                            tableroArray[bloques[3] + 1].color == null; 
                case 2:
                    return  tableroArray[bloques[3]].x < MAX_MARGENES_TABLERO[2] && 
                            tableroArray[bloques[0] + 1].color == null && 
                            tableroArray[bloques[3] + 1].color == null; 
                case 3:
                    return  tableroArray[bloques[0]].x < MAX_MARGENES_TABLERO[2] &&
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

        function desplazarPiramideParaAbajo(bloque, index, color) {
            switch(posicion) {
                case 0:
                    if (index != 1) tableroArray[bloque + PIEZAS_EN_UNA_FILA].color = color;
                    if (index != 3) tableroArray[bloque].color = null;
                    break;
                case 1:
                case 3:
                    if (index != 0 && index != 1) tableroArray[bloque + PIEZAS_EN_UNA_FILA].color = color;
                    if (index != 1 && index != 3) tableroArray[bloque].color = null;
                    break;
                case 2:
                    if (index != 0) tableroArray[bloque + PIEZAS_EN_UNA_FILA].color = color;
                    if (index != 1) tableroArray[bloque].color = null;
                    break;
            }
            return bloque + PIEZAS_EN_UNA_FILA;
        }
    }

    extend(FiguraC, Figura);
    function FiguraC() {
        const POS_INICIAL = [BLOQUE_GENERADOR_DE_PIEZA, BLOQUE_GENERADOR_DE_PIEZA + 1, BLOQUE_GENERADOR_DE_PIEZA + 10, BLOQUE_GENERADOR_DE_PIEZA + 11];
        const REFERENCIA = this;

        Figura.call(this, POS_INICIAL, 'orange');
        window.addEventListener('keydown', moverFigura, false);

        let timerFiguraDescenso = setInterval( () => {
            if (comprobarColisionesDescendientes(this.bloques)) {
                window.removeEventListener('keydown', moverFigura, false);
                clearInterval(timerFiguraDescenso);
                this.colisionDetectada = true;
            } else {
                this.bloques = this.bloques.map( (bloque, index) => {
                    return desplazarCuadradoParaAbajo(bloque, index, this.color);
                });
            }
         }, VELOCIDAD );

        function moverFigura(evt) {
            switch (evt.code) {
                case 'ArrowLeft':
                    if (comprobarColisionIzquierda(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarCuadradoParaLaIzquierda(bloque, index, REFERENCIA.color);
                        });
                    }
                    break;
                case 'ArrowRight':
                    if (comprobarColisionDerecha(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarCuadradoParaLaDerecha(bloque, index, REFERENCIA.color);
                        });
                    }
                    break;
                case 'ArrowDown':
                    if (!comprobarColisionesDescendientes(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            return desplazarCuadradoParaAbajo(bloque, index, REFERENCIA.color);
                        });
                    }
                    break;
            }
        }

        function comprobarColisionesDescendientes(bloques) {
            return  tableroArray[bloques[3]].y == MAX_MARGENES_TABLERO[1] || 
                    tableroArray[bloques[2] + PIEZAS_EN_UNA_FILA].color != null || 
                    tableroArray[bloques[3] + PIEZAS_EN_UNA_FILA].color != null;
        }

        function comprobarColisionIzquierda(bloques) {
            return  tableroArray[bloques[0]].x > MAX_MARGENES_TABLERO[0] && 
                    tableroArray[bloques[2]].x > MAX_MARGENES_TABLERO[0] && 
                    tableroArray[bloques[0] - 1].color == null && 
                    tableroArray[bloques[2] - 1].color == null;
        }

        function comprobarColisionDerecha(bloques) {
            return  tableroArray[bloques[1]].x < MAX_MARGENES_TABLERO[2] && 
                    tableroArray[bloques[3]].x < MAX_MARGENES_TABLERO[2] && 
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

        function desplazarCuadradoParaAbajo(bloque, index, color) {
            (index == 0 || index == 1) ? tableroArray[bloque].color = null : tableroArray[bloque + PIEZAS_EN_UNA_FILA].color = color;
            return bloque + PIEZAS_EN_UNA_FILA;
        }
    }    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//               Creamos una figura y un timer en el que iremos pintando el juego, comprobando colisiones..               //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let figuraActual = generarFigura();
    let request;

    const performAnimation = () => {
      request = requestAnimationFrame(performAnimation);
      actualizarCanvas();
    }
    requestAnimationFrame(performAnimation);

    function actualizarCanvas() {
        canvasPantalla.mostrar(); // Update.
        if (!detectarColisionBordeSuperior()) {
            if (figuraActual.colisionDetectada) { 
                console.log('colisionada');
                comprobarFilasRellenas();
                figuraActual = generarFigura();
            }
        } else cancelAnimationFrame(request);
        pintarTablero();
    }

    function detectarColisionBordeSuperior() {
        return (figuraActual.colisionDetectada && tableroArray[BLOQUE_GENERADOR_DE_PIEZA].color != null) ? true : false;
    }

    function comprobarFilasRellenas() { // Metodo dudoso, pendiente de corregir, por si acaso.
        let coincidencias = 0;
        tableroArray.forEach( (casilla, index) => {
            if (index != 0 && index % 10 == 0) coincidencias = 0;
            if (casilla.color != null) ++coincidencias;
            if (coincidencias == PIEZAS_EN_UNA_FILA) {
                for (let x = index; x >= PIEZAS_EN_UNA_FILA; x--) {
                    tableroArray[x].color = tableroArray[x - PIEZAS_EN_UNA_FILA].color;
                }
            }
        });
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// https://www.w3schools.com/graphics/game_sound.asp
// https://www.youtube.com/watch?v=-FAzHyXZPm0
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

})();