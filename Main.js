// Canvas y contexto del Canvas
let canvas = document.getElementById("canvas");
let contexto = canvas.getContext("2d");
contexto.imageSmoothingEnabled = false;

// Capas
let layer;
let gameLayer;
let menuLayer;

// Controles
let controles = {};


// Inicio capas y bucle del juego
function iniciarJuego() {
    menuLayer = new MenuLayer();
    layer = menuLayer;
    setInterval(loop, 1000 / 30);
}

function loop() {
    layer.actualizar();
    if (entrada === entradas.pulsaciones) {
        layer.calcularPulsaciones(pulsaciones);
    }
    layer.procesarControles();
    layer.dibujar();

    actualizarPulsaciones();
}

function actualizarPulsaciones() {
    for (let i = 0; i < pulsaciones.length; i++) {
        if (pulsaciones[i].tipo === tipoPulsacion.inicio) {
            pulsaciones[i].tipo = tipoPulsacion.mantener;
        }
    }
}


// Cambio de escalado
window.addEventListener('load', resize, false);

function resize() {
    console.log("Resize");
    let escaladoAncho = parseFloat(window.innerWidth / canvas.width);
    let escaladoAlto = parseFloat(window.innerHeight / canvas.height);

    escaladoMinimo = Math.trunc(Math.min(escaladoAncho, escaladoAlto));

    canvas.width = canvas.width * escaladoMinimo;
    canvas.height = canvas.height * escaladoMinimo;

    contexto.scale(escaladoMinimo, escaladoMinimo);
    contexto.imageSmoothingEnabled = false;
}

