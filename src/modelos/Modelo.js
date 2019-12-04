class Modelo {

    constructor(imagenRuta, x, y) {
        this.imagen = cache[imagenRuta];
        this.x = x;
        this.y = y;
        this.ancho = this.imagen.width;
        this.alto = this.imagen.height;
        this.fuera = {
            arriba: false,
            abajo: false,
            izquierda: false,
            derecha: false
        };
    }

    dibujar() {
        contexto.drawImage(this.imagen, this.x - this.ancho / 2, this.y - this.alto / 2);
    }


    colisiona(modelo) {
        let colisiona = false;

        if (modelo.x - modelo.ancho / 2 < this.x + this.ancho / 2
            && modelo.x + modelo.ancho / 2 > this.x - this.ancho / 2
            && this.y + this.alto / 2 > modelo.y - modelo.alto / 2
            && this.y - this.alto / 2 < modelo.y + modelo.alto / 2) {

            colisiona = true;

        }
        return colisiona;
    }

    estaEnPantalla() {
        this.fuera.arriba = this.y <= 0;
        this.fuera.abajo = this.y >= altoNativo;
        this.fuera.izquierda = this.x <= 0;
        this.fuera.derecha = this.x >= anchoNativo;

        return !this.fuera.arriba && !this.fuera.abajo && !this.fuera.izquierda && !this.fuera.derecha;
    }

}
