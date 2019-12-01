var cancion = new Audio("res/pushing_onwards.mp3");
cancion.loop = true;

var efectos = {
    // disparo: "res/efecto_disparo.mp3",
    // explosion: "res/efecto_explosion.mp3",
};

function reproducirMusica() {
    cancion.play();
}

function pararMusica() {
    cancion.stop();
}

function reproducirEfecto(srcEfecto) {
    var efecto = new Audio(srcEfecto);
    efecto.play();
}
