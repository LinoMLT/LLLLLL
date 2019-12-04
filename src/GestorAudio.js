let cancion = new Audio("res/pushing_onwards.mp3");
cancion.loop = true;

let efectos = {
    muerte: "res/efecto_muerte.mp3",
    // explosion: "res/efecto_explosion.mp3",
};

function reproducirMusica() {
    cancion.play();
}

function pararMusica() {
    cancion.stop();
}

function reproducirEfecto(srcEfecto) {
    let efecto = new Audio(srcEfecto);
    efecto.play();
}
