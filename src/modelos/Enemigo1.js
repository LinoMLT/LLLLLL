class Enemigo1 extends Enemigo {

    constructor(imagenRuta, x, y, sentido) {
        super(imagenRuta, x, y, sentido);
        this.aMover = new Animacion(imagenes.enemigo1Animacion, this.ancho, this.alto, 8, 4);
        this.animacion = this.aMover;
    }

    actualizar() {
        super.actualizar();
        this.animacion.actualizar();
    }

    dibujar() {
        this.animacion.dibujar(this.x, this.y);
    }

}
