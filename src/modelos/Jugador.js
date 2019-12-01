class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador_derecha, x, y);
        this.estado = estados.moviendo;
        this.orientacion = orientaciones.derecha;
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY

        // Animaciones
        this.aDerecha = new Animacion(imagenes.jugador_derecha,
            this.ancho, this.alto, 1, 1);

        this.animacion = this.aDerecha;
    }

    actualizar() {
        if (this.vy !== 0)
            this.estado = estados.saltando;
        else if (this.vx !== 0) {
            this.estado = estados.corriendo;
        } else
            this.estado = estados.quieto;

        this.animacion.actualizar();
    }

    dibujar() {
        this.animacion.dibujar(this.x, this.y);
    }

    moverX(direccion) {
        this.vx = direccion * 5;
    }

    invertirGravedad() {
        if (this.estado !== estados.saltando) {
            this.estado = estados.saltando;
            return true
        } else
            return false;
    }

    morir() {

    }

}