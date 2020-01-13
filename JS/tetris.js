const TETRIS = (function () {

    // Objeto Canvas donde representaremos nuestro juego.
    let canvasPantalla = {
        canvas : document.createElement('canvas'),
        mostrar : function() {
            document.querySelector('.tablero').appendChild(this.canvas);
            this.context = this.canvas.getContext('2d');
            this.canvas.height = 180;
            this.canvas.width = 90;
        }
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function lanzar() {
        añadirEventoBotonIniciarParar();
        añadirEventoDesplazamientoTeclas();
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Botón Play / Stop con timer para poder para o reanudar el juego.
    function añadirEventoBotonIniciarParar() {
        let punteroPlayPause = document.querySelector('.header').getElementsByTagName('a')[0];
        punteroPlayPause.addEventListener('click', onOff, false);

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

    function añadirEventoDesplazamientoTeclas() {
        window.addEventListener("keydown", function (event) {
            switch(event.code) {
                case "ArrowLeft":
                    if (piezaValorX > topeXizq) piezaValorX -= 10;
                    break;
                case "ArrowRight":
                    if (piezaValorX < topeXder) piezaValorX += 10;
                    break;    
            }
          },false);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Timer para el Juego.
    function timerTask() {
        canvasPantalla.mostrar(); // Pintamos el canvas.
        let cuadrado = new pintarBloque('red', piezaValorX, piezaValorY);
        detectarColisionInferior();
    }

    function detectarColisionInferior() {
        if (piezaValorY < 170) {
            piezaValorY += 10;
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//https://www.w3schools.com/graphics/game_controllers.asp

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    function pintarBloque(color, x, y) {
        this.height = 10;
        this.width = 10;
        this.x = x;
        this.y = y;
        let bloque = canvasPantalla.context;
        bloque.fillStyle = color;
        bloque.fillRect(this.x, this.y, this.width, this.height);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return {lanzar};
})();










/*

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