class Animacion {

    constructor(imagenSrc, modeloAncho, modeloAlto, duracionFrame, frames, callback) {
        // Nuevo para animaciones finitas
        this.callback = callback;

        this.imagen = cache[imagenSrc];
        this.modeloAncho = modeloAncho;
        this.modeloAlto = modeloAlto;
        this.duracionFrame = duracionFrame;
        this.frames = frames;

        this.frameActual = 0;
        this.frameAncho = this.imagen.width / this.frames;
        this.frameAlto = this.imagen.height;

        this.rectanguloDibujo = {
            x: 0,
            y: 0,
            ancho: this.frameAncho,
            alto: this.frameAlto
        };

        this.ultimaActualizacion = 0;
    }

    actualizar() {
        this.ultimaActualizacion++;

        if (this.ultimaActualizacion > this.duracionFrame) {
            this.ultimaActualizacion = 0;
            // actualizar el frame
            this.frameActual++;
            // Si llega al último frame evuelve al primero
            if (this.frameActual >= this.frames) {
                if (this.callback != null) {
                    // avisar de que acabo
                    this.frameActual = 0;
                    this.callback();
                } else {
                    // reiniciar, es infinita
                    this.frameActual = 0;
                }
            }
        }
        // actualizar el rectangulo (siguiente frame)
        this.rectanguloDibujo.x = this.frameActual * this.frameAncho;
    }

    dibujar(x, y) {
        contexto.drawImage(
            this.imagen,
            this.rectanguloDibujo.x,
            this.rectanguloDibujo.y,
            this.rectanguloDibujo.ancho,
            this.rectanguloDibujo.alto,
            x - this.modeloAncho / 2,
            y - this.modeloAlto / 2,
            this.modeloAncho,
            this.modeloAlto);
    }

}
