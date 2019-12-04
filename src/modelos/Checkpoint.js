class Checkpoint extends Modelo {

    constructor(x, y, orientacion) {
        super(imagenes.checkpoint_inactivo, x, y);
        this.orientacion = orientacion;
        this.activo = false;

        this.aInactivo = new Animacion(imagenes.checkpoint_inactivo, this.ancho, this.alto, 1, 1);
        this.aInactivoIverso = new Animacion(imagenes.checkpoint_inactivo_reves, this.ancho, this.alto, 1, 1);
        this.aActivo = new Animacion(imagenes.checkpoint_activo, this.ancho, this.alto, 1, 1);
        this.aActivoInverso = new Animacion(imagenes.checkpoint_activo_reves, this.ancho, this.alto, 1, 1);

        // Ref a la animación actual
        if (this.orientacion === orientaciones.y.inversa)
            this.animacion = this.aInactivo;
        else
            this.animacion = this.aActivoInverso;
    }

    actualizar() {
        this.animacion.actualizar();
        if (this.activo) {
            if (this.orientacion === orientaciones.y.inversa)
                this.animacion = this.aActivoInverso;
            else
                this.animacion = this.aActivo;
        } else {
            if (this.orientacion === orientaciones.y.inversa)
                this.animacion = this.aInactivoIverso;
            else
                this.animacion = this.aInactivo;
        }
    }

    dibujar() {
        this.animacion.dibujar(this.x, this.y);
    }

}
