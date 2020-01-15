const TETRIS = (() => {
    const MAX_MARGENES_TABLERO = [0, 170];
    const DIMENSION_BLOQUE = 10;
    const HEIGHT_CANVAS = 180;
    const WIDTH_CANVAS = 90;
    const VELOCIDAD = 200;

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
        if (contadorX == 80) { contadorY += DIMENSION_BLOQUE; contadorX = -(DIMENSION_BLOQUE); }
        return new casillaTablero(contadorX += DIMENSION_BLOQUE, contadorY);
    });

    function casillaTablero(x, y) {
        this.color = null;
        this.x = x;
        this.y = y;
    }

    function pintarTablero() {
        tableroArray.forEach( casilla => {
            if (casilla.color != null) { pintarBloque(casilla.color, casilla.x, casilla.y); }
        });
    }

    function pintarBloque(color, x, y) {
        const bloque = canvasPantalla.context;
        bloque.fillStyle = color;
        bloque.fillRect(x, y, DIMENSION_BLOQUE, DIMENSION_BLOQUE);  
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    function generarfigura() { // Hasta que hagamos más figuras.
        return new figuraCuadrado();
    }

    function figuraCuadrado() {
        this.colisionDetectada = false;
        let bloques = [10, 9, 1, 0];
        const color = 'yellow';

        window.addEventListener('keydown', desplazarLateralmente, false);
        bloques.forEach( bloque => {
            tableroArray[bloque].color = color;
        });

        let timerFiguraDescenso = setInterval( () => {
            // Si en los dos bloques inferiores, al ser un cuadrado, hay colisión O llegamos a la última fila (con mirar aquí un solo bloque vale), detenemos el timer y eliminamos la figura.
            if ( tableroArray[bloques[0]].y == MAX_MARGENES_TABLERO[1] || (tableroArray[bloques[0] + 9].color != null && tableroArray[bloques[1] + 9].color != null) ) {
                window.removeEventListener('keydown', desplazarLateralmente, false);
                clearInterval(timerFiguraDescenso);
                colisionDetectada = true;
            } else {
                bloques = bloques.map( bloque => {
                    tableroArray[bloque].color = null;
                    tableroArray[bloque + 9].color = color;
                    return bloque + 9;
                });
            }
         }, VELOCIDAD );

        function desplazarLateralmente() {
            switch (evt.code) { // Revisar mañana, al desplazar hay que ELIMINAR anteriores.
                case 'ArrowLeft':
                    if (tableroArray[bloques[0]].x > MAX_MARGENES_TABLERO[0]) bloques = bloques.map( bloque => bloque - 1); 
                    break;
                case 'ArrowRight':
                    if (tableroArray[bloques[1]].x > MAX_MARGENES_TABLERO[1]) bloques = bloques.map( bloque => bloque + 1);
                    break;
            }
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    let figuraActual = generarfigura();
    function timerTask() {
        canvasPantalla.mostrar(); // Update.
        pintarTablero();
        if (figuraActual.colision) figuraActual = generarfigura();
    }

    setInterval(timerTask, 10);

    function lanzarAplicacion() {
        
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//https://www.w3schools.com/graphics/game_controllers.asp

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return {lanzarAplicacion};

})();










/*

    
    function iniciarPausarJuego() {
        punteroPlayPause.addEventListener('click', onOff, false);
        añadirEventoDesplazamientoTeclas();

        let temporizadorTimer;
        function onOff() {    
            switch(punteroPlayPause.innerText) {
                case 'PLAY ':
                    punteroPlayPause.replaceChild(document.createTextNode('STOP '), punteroPlayPause.firstChild);
                    punteroPlayPause.firstElementChild.src = 'IMGs/Stop.png';
                    temporizadorTimer = setInterval(timerTask, 800);
                    break;
                case 'STOP ':
                    punteroPlayPause.replaceChild(document.createTextNode('PLAY '), punteroPlayPause.firstChild);
                    punteroPlayPause.firstElementChild.src = 'IMGs/Play.png';
                    clearInterval(temporizadorTimer);
                    break;
            }
        }
    }


    const heredar = function(padre, hijo) {
        hijo.prototype = Object.create(padre.prototype);
        hijo.prototype.constructor = hijo;
    }

    function Figuras(nombreFig, bloques) {
        this.nombreFigura = nombreFig;
        this.bloques = bloques;
    }

    heredar(Figuras, Cuadrado);
*/