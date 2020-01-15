const TETRIS = (function () {

    const DIMENSION_BLOQUE = 10;
    const HEIGHT_CANVAS = 180;
    const WIDTH_CANVAS = 90;

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function figuraCuadrado() {
        this.color = 'yellow';
        this.bloques = 4;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    setInterval(timerTask, 800);
    function lanzarAplicacion() {
        
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    function añadirEventoDesplazamientoTeclas() {
        window.addEventListener("keydown", function (event) {
            switch(event.code) {
                case "ArrowLeft":
                    if (piezaValorX > topeXizq) piezaValorX -= DIMENSION_BLOQUE;
                    break;
                case "ArrowRight":
                    if (piezaValorX < topeXder) piezaValorX += DIMENSION_BLOQUE;
                    break;    
            }
          },false);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function timerTask() {
        canvasPantalla.mostrar(); // Update.
        console.log('a')
        new pintarBloque('red', 0, 0);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//https://www.w3schools.com/graphics/game_controllers.asp

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function pintarBloque(color, x, y) {
        const bloque = canvasPantalla.context;
        bloque.fillStyle = color;
        bloque.fillRect(x, y, DIMENSION_BLOQUE, DIMENSION_BLOQUE);  
    }

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