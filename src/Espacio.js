class Espacio {

    constructor() {
        this.gravedad = gravedadModulo;
        this.dinamicos = []; // Se mueven
        this.bloqueantes = []; // Bloquean el movimiento a los demás elementos
    }

    invertirGravedad() {
        this.gravedad *= -1;
    }

    agregarCuerpoDinamico(modelo) {
        this.dinamicos.push(modelo);
    }

    agregarCuerpoBloqueante(modelo) {
        this.bloqueantes.push(modelo);
    }

    eliminarCuerpoDinamico(modelo) {
        for (let i = 0; i < this.dinamicos.length; i++) {
            if (this.dinamicos[i] === modelo) {
                this.dinamicos.splice(i, 1);
            }
        }
    }

    eliminarCuerpoBloqueante(modelo) {
        for (let i = 0; i < this.bloqueantes.length; i++) {
            if (this.bloqueantes[i] === modelo) {
                this.bloqueantes.splice(i, 1);
            }
        }
    }

    actualizar() {
        for (let i = 0; i < this.dinamicos.length; i++) {
            // reiniciar choques
            this.dinamicos[i].choqueAbajo = false;

            //derecha
            this.moverDerecha(i);
            this.moverIzquierda(i);
            this.moverArriba(i);
            this.moverAbajo(i);
        }
    }

    moverDerecha(i) {
        if (this.dinamicos[i].vx > 0) {
            let movimientoPosible = this.dinamicos[i].vx;
            // El mejor "idealmente" vx partimos de ese

            for (let j = 0; j < this.bloqueantes.length; j++) {
                if (this.dinamicos[i] === this.bloqueantes[j])
                    continue; // Para que las plataformas móviles no se bloqueen a sí mismas

                let derechaDinamico = this.dinamicos[i].x + this.dinamicos[i].ancho / 2;
                let arribaDinamico = this.dinamicos[i].y - this.dinamicos[i].alto / 2;
                let abajoDinamico = this.dinamicos[i].y + this.dinamicos[i].alto / 2;
                let izquierdaBloqueante = this.bloqueantes[j].x - this.bloqueantes[j].ancho / 2;
                let arribaBloqueante = this.bloqueantes[j].y - this.bloqueantes[j].alto / 2;
                let abajoBloqueante = this.bloqueantes[j].y + this.bloqueantes[j].alto / 2;

                // Alerta! Elemento bloquenate en la trayectoria.
                if ((derechaDinamico + this.dinamicos[i].vx) >= izquierdaBloqueante
                    && derechaDinamico <= izquierdaBloqueante
                    && arribaBloqueante < abajoDinamico
                    && abajoBloqueante > arribaDinamico) {

                    // Comprobamos si la distancia al estático es menor
                    // que nuestro movimientoPosible actual
                    if (movimientoPosible >= izquierdaBloqueante - derechaDinamico) {
                        // La distancia es MENOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno menor
                        movimientoPosible = izquierdaBloqueante - derechaDinamico;
                    }

                }
            }

            if (!(this.dinamicos[i] instanceof Jugador)) {
                let derechaDinamico = this.dinamicos[i].x + this.dinamicos[i].ancho / 2;
                if (derechaDinamico + movimientoPosible > anchoNativo) {
                    movimientoPosible = anchoNativo - derechaDinamico;
                }
            }

            // Ya se han comprobado todos los estáticos
            this.dinamicos[i].x += movimientoPosible;
            this.dinamicos[i].vx = movimientoPosible;
        }
    }

    moverIzquierda(i) {
        // Izquierda
        if (this.dinamicos[i].vx < 0) {
            let movimientoPosible = this.dinamicos[i].vx;
            // El mejor "idealmente" vx partimos de ese

            for (let j = 0; j < this.bloqueantes.length; j++) {
                if (this.dinamicos[i] === this.bloqueantes[j])
                    continue; // Para que las plataformas móviles no se bloqueen a sí mismas

                let izquierdaDinamico = this.dinamicos[i].x - this.dinamicos[i].ancho / 2;
                let arribaDinamico = this.dinamicos[i].y - this.dinamicos[i].alto / 2;
                let abajoDinamico = this.dinamicos[i].y + this.dinamicos[i].alto / 2;
                let derechaBloqueante = this.bloqueantes[j].x + this.bloqueantes[j].ancho / 2;
                let arribaBloqueante = this.bloqueantes[j].y - this.bloqueantes[j].alto / 2;
                let abajoBloqueante = this.bloqueantes[j].y + this.bloqueantes[j].alto / 2;

                // Alerta!, Elemento estático en la trayectoria.
                if ((izquierdaDinamico + this.dinamicos[i].vx) <= derechaBloqueante
                    && izquierdaDinamico >= derechaBloqueante
                    && arribaBloqueante < abajoDinamico
                    && abajoBloqueante > arribaDinamico) {

                    // Comprobamos si la distancia al estático es mayor
                    // que nuestro movimientoPosible actual
                    if (movimientoPosible <= derechaBloqueante - izquierdaDinamico) {
                        // La distancia es MAYOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno mayor
                        movimientoPosible = derechaBloqueante - izquierdaDinamico;
                    }

                }
            }

            if (!(this.dinamicos[i] instanceof Jugador)) {
                let izquierdaDinamico = this.dinamicos[i].x - this.dinamicos[i].ancho / 2;
                if (izquierdaDinamico + movimientoPosible < 0) {
                    movimientoPosible = -izquierdaDinamico;
                }
            }

            // Ya se han comprobado todos los bloqueantes
            this.dinamicos[i].x += movimientoPosible;
            this.dinamicos[i].vx = movimientoPosible;
        }
    }

    moverAbajo(i) {
        if (this.dinamicos[i].vy > 0) {
            let movimientoPosible = this.dinamicos[i].vy;
            // El mejor "idealmente" es la velocidad vy.

            for (let j = 0; j < this.bloqueantes.length; j++) {
                if (this.dinamicos[i] === this.bloqueantes[j])
                    continue; // Para que las plataformas móviles no se bloqueen a sí mismas

                let arribaDinamico = this.dinamicos[i].y - this.dinamicos[i].alto / 2;
                let abajoDinamico = this.dinamicos[i].y + this.dinamicos[i].alto / 2;
                let derechaDinamico = this.dinamicos[i].x + this.dinamicos[i].ancho / 2;
                let izquierdaDinamico = this.dinamicos[i].x - this.dinamicos[i].ancho / 2;
                let arribaBloqueante = this.bloqueantes[j].y - this.bloqueantes[j].alto / 2;
                let abajoBloqueante = this.bloqueantes[j].y + this.bloqueantes[j].alto / 2;
                let derechaBloqueante = this.bloqueantes[j].x + this.bloqueantes[j].ancho / 2;
                let izquierdaBloqueante = this.bloqueantes[j].x - this.bloqueantes[j].ancho / 2;

                // Alerta!, Elemento estático en la trayectoria.
                if ((abajoDinamico + this.dinamicos[i].vy) >= arribaBloqueante &&
                    arribaDinamico < abajoBloqueante
                    && izquierdaDinamico < derechaBloqueante
                    && derechaDinamico > izquierdaBloqueante) {

                    // Comprobamos si la distancia al estático es menor
                    // que nuestro movimientoPosible actual
                    if (movimientoPosible >= arribaBloqueante - abajoDinamico) {
                        // La distancia es MENOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno menor
                        movimientoPosible = arribaBloqueante - abajoDinamico;
                        this.dinamicos[i].choqueAbajo = true;
                    }
                }
            }

            if (!(this.dinamicos[i] instanceof Jugador)) {
                let abajoDinamico = this.dinamicos[i].y + this.dinamicos[i].alto / 2;
                if (abajoDinamico + movimientoPosible > altoNativo) {
                    movimientoPosible = altoNativo - abajoDinamico;
                }
            }

            // Ya se han comprobado todos los estáticos
            this.dinamicos[i].y += movimientoPosible;
            this.dinamicos[i].vy = movimientoPosible;
        }
    }

    moverArriba(i) {
        if (this.dinamicos[i].vy < 0) {
            let movimientoPosible = this.dinamicos[i].vy;
            // El mejor "idealmente" es la velocidad vy.

            for (let j = 0; j < this.bloqueantes.length; j++) {
                if (this.dinamicos[i] === this.bloqueantes[j])
                    continue; // Para que las plataformas móviles no se bloqueen a sí mismas

                let arribaDinamico = this.dinamicos[i].y - this.dinamicos[i].alto / 2;
                let abajoDinamico = this.dinamicos[i].y + this.dinamicos[i].alto / 2;
                let derechaDinamico = this.dinamicos[i].x + this.dinamicos[i].ancho / 2;
                let izquierdaDinamico = this.dinamicos[i].x - this.dinamicos[i].ancho / 2;
                let arribaBloqueante = this.bloqueantes[j].y - this.bloqueantes[j].alto / 2;
                let abajoBloqueante = this.bloqueantes[j].y + this.bloqueantes[j].alto / 2;
                let derechaBloqueante = this.bloqueantes[j].x + this.bloqueantes[j].ancho / 2;
                let izquierdaBloqueante = this.bloqueantes[j].x - this.bloqueantes[j].ancho / 2;

                // Alerta!, Elemento bloqueante en la trayectoria
                if ((arribaDinamico + this.dinamicos[i].vy) <= abajoBloqueante &&
                    abajoDinamico > arribaBloqueante
                    && izquierdaDinamico < derechaBloqueante
                    && derechaDinamico > izquierdaBloqueante) {

                    // Comprobamos si la distancia al estático es MAYOR
                    // que nuestro movimientoPosible actual
                    if (movimientoPosible <= abajoBloqueante - arribaDinamico) {
                        // La distancia es MAYOR que nuestro movimiento posible
                        // Tenemos que actualizar el movimiento posible a uno mayor

                        movimientoPosible = abajoBloqueante - arribaDinamico;
                    }
                }
            }

            if (!(this.dinamicos[i] instanceof Jugador)) {
                let arribaDinamico = this.dinamicos[i].y - this.dinamicos[i].alto / 2;
                if (arribaDinamico + movimientoPosible < 0) {
                    movimientoPosible = -arribaDinamico;
                }
            }

            this.dinamicos[i].y += movimientoPosible;
            this.dinamicos[i].vy = movimientoPosible;
        }
    }

}