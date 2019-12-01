const anchoNativo = 320;
const altoNativo = 240;

const entradas = {
    pulsaciones: 1,
    teclado: 2,
    gamepad: 3
};

const tipoPulsacion = {
    inicio: 1,
    mantener: 2
};

const estados = {
    quieto: 1,
    corriendo: 2,
    saltando: 3,
    mueriendo: 4,
    muerto: 5
};

const orientaciones = {
    derecha: 1,
    izquierda: 2
};

var pulsaciones = [];
var entrada = entradas.pulsaciones;
let escaladoMinimo = 1;
var nivelActual = 0;
