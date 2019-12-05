const anchoNativo = 320;
const altoNativo = 240;

const gravedadModulo = 5;
const velocidadEnemigos = 4;

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
    muriendo: 4,
    muerto: 5
};

const orientaciones = {
    x: {
        derecha: 1,
        izquierda: 2
    },
    y: {
        normal: 3,
        inversa: 4
    }
};

const sentidoMov = {
    izquierda: 1,
    derecha: 2,
    arriba: 3,
    abajo: 4
};

const nivelInicial = {
    x: 0,
    y: 0
};
const nivelMaximo = {
    x: 2,
    y: 2
};

const estadosPlataforma = {
  normal: 1,
  desapareciendo:  2,
  invisible: 3,
  apareciendo: 4
};

let pulsaciones = [];
let entrada = entradas.pulsaciones;
let escaladoMinimo = 1;
