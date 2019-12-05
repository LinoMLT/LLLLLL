class Enemigo2 extends Enemigo {

    constructor(imagenRuta, x, y, sentido) {
        super(imagenRuta, x, y, sentido);
        this.aMover = new Animacion(imagenes.enemigo2Animacion, this.ancho, this.alto, 2, 2);
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
