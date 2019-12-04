class Enemigo extends Modelo {

    constructor(x, y, sentido) {
        super(imagenes.enemigo1, x, y);
        this.sentidoMov = sentido;

        this.setVelocidadInicial(sentido);

        this.aMover = new Animacion(imagenes.enemigo1Animacion, this.ancho, this.alto, 8, 4);

        // Ref a la animación actual
        this.animacion = this.aMover;
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
        this.animacion.actualizar();
        if (this.vx === 0 && (this.sentidoMov === sentidoMov.izquierda || this.sentidoMov === sentidoMov.derecha)) {
            this.vInteligencia = -this.vInteligencia;
            this.vx = this.vInteligencia;
        } else if (this.vy === 0 && (this.sentidoMov === sentidoMov.arriba || this.sentidoMov === sentidoMov.abajo)) {
            this.vInteligencia = -this.vInteligencia;
            this.vy = this.vInteligencia;
        }
    }

    dibujar() {
        this.animacion.dibujar(this.x, this.y);
    }

}
