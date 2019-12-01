var teclas = [];

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

function onKeyDown(event) {
    entrada = entradas.teclado;
    // agregar la tecla pulsada si no estaba
    let posicion = teclas.indexOf(event.keyCode);
    if (posicion === -1) {
        teclas.push(event.keyCode);
        switch (event.keyCode) {
            case 13:
                controles.continuar = true;
                break;
            case 32:
                controles.saltar = true;
                break;
            case 38:
                controles.saltar = true;
                break;
            case 40:
                controles.saltar = true;
                break;
            case 39:
                controles.moverX = 1;
                break;
            case 37:
                controles.moverX = -1;
                break;
        }
    }
}

function onKeyUp(event) {
    // sacar la tecla pulsada
    let posicion = teclas.indexOf(event.keyCode);
    teclas.splice(posicion, 1);
    switch (event.keyCode) {
        case 13:
            controles.continuar = false;
            break;
        case 32:
            if (controles.saltar) {
                controles.saltar = false;
            }
            break;
        case 38:
            if (controles.saltar) {
                controles.saltar = false;
            }
            break;
        case 40:
            if (controles.saltar) {
                controles.saltar = false;
            }
            break;
        case 39:
            if (controles.moverX === 1) {
                controles.moverX = 0;
            }
            break;
        case 37:
            if (controles.moverX === -1) {
                controles.moverX = 0;
            }
            break;
    }
}