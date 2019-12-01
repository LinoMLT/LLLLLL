var cache = [];
var imagenes = {
    fondo: "res/fondo.png",
    menu_fondo: "res/menu_fondo.png",

    jugador_derecha: "res/jugador_derecha.png",
    jugador_derecha_reves: "res/jugador_derecha_reves.png",
    jugador_izquierda: "res/jugador_izquierda.png",
    jugador_izquierda_reves: "res/jugador_izquierda_reves.png",
    bloque_4_con_bordes: "res/bloque_4_con_bordes.png",
    bloque_fondo_4_con_bordes: "res/bloque_fondo_4_con_bordes.png",
    bloque_fondo_sin_bordes: "res/bloque_fondo_sin_bordes.png",
    bloque_sin_bordes: "res/bloque_sin_bordes.png",
    checkpoint_activo: "res/checkpoint_activo.png",
    checkpoint_activo_reves: "res/checkpoint_activo_reves.png",
    checkpoint_inactivo: "res/checkpoint_inactivo.png",
    checkpoint_inactivo_reves: "res/checkpoint_inactivo_reves.png",
    deslizante_derecha: "res/deslizante_derecha.png",
    inversor_horizontal: "res/inversor_horizontal.png",
    pincho: "res/pincho.png",

    pad: "res/pad.png",
    boton_disparo: "res/boton_disparo.png",
    boton_salto: "res/boton_salto.png",
    boton_pausa: "res/boton_pausa.png",
    boton_jugar: "res/boton_jugar.png"
};

var rutasImagenes = Object.values(imagenes);
cargarImagenes(0);

function cargarImagenes(indice) {
    cache[rutasImagenes[indice]] = new Image();
    cache[rutasImagenes[indice]].src = rutasImagenes[indice];
    cache[rutasImagenes[indice]].onload = function () {
        if (indice < rutasImagenes.length - 1) {
            indice++;
            cargarImagenes(indice);
        } else {
            iniciarJuego();
        }
    }
}
