class PlataformaMovil extends Modelo {

    constructor(x, y, sentido) {
        super(imagenes.plataformaMovil, x, y);
        this.sentidoMov = sentido;
        this.setVelocidadInicial(sentido);
    }

    setVelocidadInicial(sentido) {
        if (sentido === sentidoMov.izquierda) {
            this.vInteligencia = -velocidadEnemigos;
            this.vx = -velocidadEnemigos;
            this.vy = 0;
        } else if (sentido === sentidoMov.derecha) {
            this.vInteligencia = velocidadEnemigos;
            this.vx = velocidadEnemigos;
            this.vy = 0;
        } else if (sentido === sentidoMov.arriba) {
            this.vInteligencia = -velocidadEnemigos;
            this.vx = 0;
            this.vy = -velocidadEnemigos;
        } else if (sentido === sentidoMov.abajo) {
            this.vInteligencia = velocidadEnemigos;
            this.vx = 0;
            this.vy = velocidadEnemigos;
        }
    }

    actualizar() {
        if (this.vx === 0 && (this.sentidoMov === sentidoMov.izquierda || this.sentidoMov === sentidoMov.derecha)) {
            this.vInteligencia = -this.vInteligencia;
            this.vx = this.vInteligencia;
        } else if (this.vy === 0 && (this.sentidoMov === sentidoMov.arriba || this.sentidoMov === sentidoMov.abajo)) {
            this.vInteligencia = -this.vInteligencia;
            this.vy = this.vInteligencia;
        }
    }

}