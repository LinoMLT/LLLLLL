let cancion = new Audio("res/pushing_onwards.mp3");
cancion.loop = true;

let efectos = {
    muerte: "res/efecto_muerte.mp3",
    salto1: "res/salto_1.wav",
    salto2: "res/salto_2.wav",
    checkpoint: "res/checkpoint.wav"
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
