const TETRIS = (() => {
    const MAX_MARGENES_TABLERO = [0, 190, 90];
    const BLOQUE_GENERADOR_DE_PIEZA = 4;
    const PIEZAS_EN_UNA_FILA = 10;
    const DIMENSION_BLOQUE = 10;
    const HEIGHT_CANVAS = 200;
    const WIDTH_CANVAS = 100;
    const VELOCIDAD = 500;

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

    let contadorX = -10; let contadorY = -20;
    let tableroArray = new Array( (HEIGHT_CANVAS + 20 / DIMENSION_BLOQUE) * (WIDTH_CANVAS / DIMENSION_BLOQUE) ).fill('.');
    tableroArray = tableroArray.map( (casilla) => {
        if (contadorX == 90) { contadorY += DIMENSION_BLOQUE; contadorX = -(DIMENSION_BLOQUE); }
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

    function generarfigura() { // Hasta que hagamos más figuras.
        return new FiguraC();
    }

    function Figura(array, color) {
        this.colisionDetectada = false;
        this.bloques = array;
        this.color = color;
    
        this.bloques.forEach( bloque => { tableroArray[bloque].color = this.color; });
    }
    
    extend(FiguraT, Figura);
    function FiguraT() {
        const REFERENCIA = this;
        let posicion = 0;

        Figura.call(this, [BLOQUE_GENERADOR_DE_PIEZA, BLOQUE_GENERADOR_DE_PIEZA + 1, BLOQUE_GENERADOR_DE_PIEZA + 2, BLOQUE_GENERADOR_DE_PIEZA + 11], 'purple');
        //window.addEventListener('keydown', desplazarLateralmente, false);

        let timerFiguraDescenso = setInterval( () => {
            // Añadir: A medida que se rote (posicion) actualizar con una función las comprobaciones
            if ( tableroArray[this.bloques[3]].y == MAX_MARGENES_TABLERO[1] || (tableroArray[this.bloques[0] + PIEZAS_EN_UNA_FILA].color != null || tableroArray[this.bloques[2] + PIEZAS_EN_UNA_FILA].color != null || tableroArray[this.bloques[3] + PIEZAS_EN_UNA_FILA].color != null) ) {
                //window.removeEventListener('keydown', desplazarLateralmente, false);
                clearInterval(timerFiguraDescenso);
                this.colisionDetectada = true;
            } else {
                this.bloques = this.bloques.map( (bloque, index) => {// Aqui tambien necesitaremos función dependiendo de la posición.
                    (index == 1) ? tableroArray[bloque].color = null : tableroArray[bloque + PIEZAS_EN_UNA_FILA].color = this.color;
                    if (index == 0 || index == 2) {
                        tableroArray[bloque].color = null;
                    }
                    return bloque + PIEZAS_EN_UNA_FILA;
                });
            }
         }, VELOCIDAD );

        function comprobarColisionesDescendientes() {
            /*               0          0       0   
             *    0  1  2    1  2    1  2  3    1 2
             *       3       3                  3
             */
            switch(posicion) {

            }
        } 

    }

    extend(FiguraC, Figura);
    function FiguraC() {
        const REFERENCIA = this;
        Figura.call(this, [BLOQUE_GENERADOR_DE_PIEZA, BLOQUE_GENERADOR_DE_PIEZA + 1, BLOQUE_GENERADOR_DE_PIEZA + 10, BLOQUE_GENERADOR_DE_PIEZA + 11], 'orange');
        window.addEventListener('keydown', desplazarLateralmente, false);

        let timerFiguraDescenso = setInterval( () => {
            if (comprobarColisionesDescendientes(this.bloques)) {
                window.removeEventListener('keydown', desplazarLateralmente, false);
                clearInterval(timerFiguraDescenso);
                this.colisionDetectada = true;
            } else {
                this.bloques = this.bloques.map( (bloque, index) => {
                    (index == 0 || index == 1) ? tableroArray[bloque].color = null : tableroArray[bloque + PIEZAS_EN_UNA_FILA].color = this.color;
                    return bloque + PIEZAS_EN_UNA_FILA;
                });
            }
         }, VELOCIDAD );

        function comprobarColisionesDescendientes(bloques) {
            return (tableroArray[bloques[3]].y == MAX_MARGENES_TABLERO[1] || (tableroArray[bloques[2] + PIEZAS_EN_UNA_FILA].color != null || tableroArray[bloques[3] + PIEZAS_EN_UNA_FILA].color != null));
        }

        function desplazarLateralmente(evt) {
            switch (evt.code) {
                case 'ArrowLeft':
                    if ( (tableroArray[REFERENCIA.bloques[0]].x > MAX_MARGENES_TABLERO[0] && tableroArray[REFERENCIA.bloques[2]].x > MAX_MARGENES_TABLERO[0]) && tableroArray[REFERENCIA.bloques[0] - 1].color == null && tableroArray[REFERENCIA.bloques[2] - 1].color == null ) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            (index == 1 || index == 3) ? tableroArray[bloque].color = null : tableroArray[bloque - 1].color = REFERENCIA.color;
                            return bloque - 1;
                        });
                    }
                    break;
                case 'ArrowRight':
                    if ( (tableroArray[REFERENCIA.bloques[1]].x < MAX_MARGENES_TABLERO[1] && tableroArray[REFERENCIA.bloques[3]].x < MAX_MARGENES_TABLERO[2])  && tableroArray[REFERENCIA.bloques[1] + 1].color == null && tableroArray[REFERENCIA.bloques[3] + 1].color == null ) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            (index == 0 || index == 2) ? tableroArray[bloque].color = null : tableroArray[bloque + 1].color = REFERENCIA.color;
                            return bloque + 1;
                        });
                    }
                    break;
                case 'ArrowDown':
                    if (!comprobarColisionesDescendientes(REFERENCIA.bloques)) {
                        REFERENCIA.bloques = REFERENCIA.bloques.map( (bloque, index) => {
                            (index == 0 || index == 1) ? tableroArray[bloque].color = null : tableroArray[bloque + PIEZAS_EN_UNA_FILA].color = REFERENCIA.color;
                            return bloque + PIEZAS_EN_UNA_FILA;
                        });
                    }
                    break;
            }
        }
    }    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let figuraActualAleatoria = generarfigura();
    let juego = setInterval(timerTask, 10);

    function timerTask() {
        canvasPantalla.mostrar(); // Update.

        if (!colisionSuperior()) {
            if (figuraActualAleatoria.colisionDetectada) { 
                console.log('colisionada');
                comprobarFilasRellenas();
                figuraActualAleatoria = generarfigura();
            }
        } else { clearInterval(juego); }

        pintarTablero();
    }

    function colisionSuperior() {
        return (figuraActualAleatoria.colisionDetectada && tableroArray[BLOQUE_GENERADOR_DE_PIEZA].color != null) ? true : false;
    }

    function comprobarFilasRellenas() {
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