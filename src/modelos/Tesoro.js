class Tesoro extends Modelo {

    constructor(x, y, numero) {
        super(imagenes.tesoro, x, y);
        this.numero = numero;

        // Animaciones
        this.aTesoro = new Animacion(imagenes.tesoroAnimacion, this.ancho, this.alto, 2, 2);
        this.animacion = this.aTesoro;
    }

    actualizar() {
        this.animacion.actualizar();
    }

    dibujar() {
        this.animacion.dibujar(this.x, this.y);
    }
}