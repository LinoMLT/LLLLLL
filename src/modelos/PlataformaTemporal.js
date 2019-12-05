class PlataformaTemporal extends Modelo {

    constructor(x, y) {
        super(imagenes.plataformaTemporal, x, y);
        this.estado = estadosPlataforma.normal;

        this.aNormal = new Animacion(imagenes.plataformaTemporal, this.ancho, this.alto, 1, 1);
        this.aDesaparece = new Animacion(imagenes.plataformaTemporalAnimacion1, this.ancho, this.alto, 2, 4, this.finAnimacionDesaparecer.bind(this));
        this.aAparece = new Animacion(imagenes.plataformaTemporalAnimacion2, this.ancho, this.alto, 2, 4, this.finAnimacionAparecer.bind(this));
        this.aInvisible = new Animacion(imagenes.plataformaTemporalInvisible, this.ancho, this.alto, 1, 1);

        this.animacion = this.aNormal;
    }

    activar() {
        if (this.estado === estadosPlataforma.normal) {
            this.estado = estadosPlataforma.desapareciendo;
        }
    }

    actualizar() {
        this.animacion.actualizar();

        switch (this.estado) {
            case estadosPlataforma.normal:
                this.animacion = this.aNormal;
                break;
            case estadosPlataforma.desapareciendo:
                this.animacion = this.aDesaparece;
                break;
            case estadosPlataforma.invisible:
                this.animacion = this.aInvisible;
                break;
            case estadosPlataforma.apareciendo:
                this.animacion = this.aAparece;
                break;
        }
    }

    dibujar() {
        this.animacion.dibujar(this.x, this.y);
    }

    finAnimacionDesaparecer() {
        this.estado = estadosPlataforma.invisible;
    }

    finAnimacionAparecer() {
        this.estado = estadosPlataforma.normal;
    }

}