const TETRIS = (function () {
    // Objeto Canvas donde representaremos nuestro juego.
    let canvasPantalla = {
        canvas : document.createElement('canvas'),
        mostrar : function() {
            document.querySelector('.tablero').appendChild(this.canvas);
            this.context = this.canvas.getContext('2d');
            this.canvas.height = 181;
            this.canvas.width = 91;
        }
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function lanzar() {
        añadirEventoBotonIniciarParar();

    }

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
                    temporizadorTimer = setInterval(timerTask, 500);
                    break;
                case 'STOP ':
                    punteroPlayPause.replaceChild(document.createTextNode('PLAY '), punteroPlayPause.firstChild);
                    punteroPlayPause.firstElementChild.src = 'IMGs/Play.png';
                    clearInterval(temporizadorTimer);
                    break;
            }
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let num = -10;
    // Timer para el Juego.
    function timerTask() {
        canvasPantalla.mostrar(); // Pintamos el canvas en cada task.
        let cuadrado = new crearBloque(10, "red", 0, num+=10);

    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//https://www.w3schools.com/graphics/game_components.asp

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const heredar = function(padre, hijo) {
        hijo.prototype = Object.create(padre.prototype);
        hijo.prototype.constructor = hijo;
    }

    function Figuras(nombreFig, bloques) {
        this.nombreFigura = nombreFig;
        this.bloques = bloques;
    }

    heredar(Figuras, Cuadrado);
    function Cuadrado() {

    }
    
    function crearBloque(longitud, color, x, y) {
        this.height = longitud;
        this.width = longitud;
        this.x = x;
        this.y = y;
        let bloque = canvasPantalla.context;
        bloque.fillStyle = color;
        bloque.fillRect(this.x, this.y, this.width, this.height);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return {lanzar};
})();