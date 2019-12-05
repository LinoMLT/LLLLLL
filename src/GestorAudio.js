let cancionVVVVVV = new Audio("res/pushing_onwards.mp3");
let cancionLLLLLL = new Audio("res/LLLLL_main_theme_8bit.mp3");
cancionLLLLLL.loop = true;

let efectos = {
    muerte: "res/efecto_muerte.mp3",
    salto1: "res/salto_1.wav",
    salto2: "res/salto_2.wav",
    checkpoint: "res/checkpoint.wav",
    tesoro: "res/tesoro.wav"
};

function reproducirMusica() {
    cancionLLLLLL.play();
}

function pararMusica() {
    cancion.stop();
}

function reproducirEfecto(srcEfecto) {
    let efecto = new Audio(srcEfecto);
    efecto.play();
}
