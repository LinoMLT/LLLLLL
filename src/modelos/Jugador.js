class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador_derecha, x, y);
        this.estado = estados.quieto;
        this.orientacion = {
            x: orientaciones.x.derecha,
            y: orientaciones.y.normal
        };
        this.vx = 0;
        this.vy = 0;
        this.tesoros = [];

        // Animaciones
        this.aDerecha = new Animacion(imagenes.jugador_derecha, this.ancho, this.alto, 30, 1);
        this.aDerechaInversa = new Animacion(imagenes.jugador_derecha_reves, this.ancho, this.alto, 30, 1);
        this.aIzquierda = new Animacion(imagenes.jugador_izquierda, this.ancho, this.alto, 30, 1);
        this.aIzquierdaInversa = new Animacion(imagenes.jugador_izquierda_reves, this.ancho, this.alto, 30, 1);
        this.aDerechaMuerte = new Animacion(imagenes.jugador_derecha_muerte, this.ancho, this.alto, 2, 10, this.finAnimacionMuriendo.bind(this));
        this.aDerechaInversaMuerte = new Animacion(imagenes.jugador_derecha_reves_muerte, this.ancho, this.alto, 2, 10, this.finAnimacionMuriendo.bind(this));
        this.aIzquierdaMuerte = new Animacion(imagenes.jugador_izquierda_muerte, this.ancho, this.alto, 2, 10, this.finAnimacionMuriendo.bind(this));
        this.aIzquierdaInversaMuerte = new Animacion(imagenes.jugador_izquierda_reves_muerte, this.ancho, this.alto, 2, 10, this.finAnimacionMuriendo.bind(this));

        this.animacion = this.aDerecha;

        this.tiempoEsperaSalto = 0;
        this.esperaSalto = 0;
    }

    actualizar() {
        if (this.estado === estados.muriendo) {
            this.vx = 0;
            this.vy = 0;
        }

        // TEMPORAL
        if (this.estado === estados.saltando)
            this.esperaSalto = this.tiempoEsperaSalto;
        else if (this.esperaSalto > 0)
            this.esperaSalto--;

        // ESTADOS
        if (this.estado !== estados.muriendo) {
            if (this.vy !== 0)
                this.estado = estados.saltando;
            else if (this.vx !== 0) {
                this.estado = estados.corriendo;
            } else
                this.estado = estados.quieto;
        }

        // ORIENTACIÓN
        if (this.vx > 0)
            this.orientacion.x = orientaciones.x.derecha;
        else if (this.vx < 0)
            this.orientacion.x = orientaciones.x.izquierda;

        // ANIMACIÓN
        switch (this.estado) {
            case estados.quieto:
                if (this.orientacion.x === orientaciones.x.derecha) {
                    if (this.orientacion.y === orientaciones.y.normal) {
                        this.animacion = this.aDerecha;
                    } else if (this.orientacion.y === orientaciones.y.inversa) {
                        this.animacion = this.aDerechaInversa
                    }
                } else if (this.orientacion.x === orientaciones.x.izquierda) {
                    if (this.orientacion.y === orientaciones.y.normal) {
                        this.animacion = this.aIzquierda;
                    } else if (this.orientacion.y === orientaciones.y.inversa) {
                        this.animacion = this.aIzquierdaInversa;
                    }
                }
                break;
            case estados.corriendo: // TODO Cambiar por las animaciones de correr
                if (this.orientacion.x === orientaciones.x.derecha) {
                    if (this.orientacion.y === orientaciones.y.normal) {
                        this.animacion = this.aDerecha;
                    } else if (this.orientacion.y === orientaciones.y.inversa) {
                        this.animacion = this.aDerechaInversa
                    }
                } else if (this.orientacion.x === orientaciones.x.izquierda) {
                    if (this.orientacion.y === orientaciones.y.normal) {
                        this.animacion = this.aIzquierda;
                    } else if (this.orientacion.y === orientaciones.y.inversa) {
                        this.animacion = this.aIzquierdaInversa;
                    }
                }
                break;
            case estados.saltando: // TODO Cambiar por las animaciones de saltar
                if (this.orientacion.x === orientaciones.x.derecha) {
                    if (this.orientacion.y === orientaciones.y.normal) {
                        this.animacion = this.aDerecha;
                    } else if (this.orientacion.y === orientaciones.y.inversa) {
                        this.animacion = this.aDerechaInversa
                    }
                } else if (this.orientacion.x === orientaciones.x.izquierda) {
                    if (this.orientacion.y === orientaciones.y.normal) {
                        this.animacion = this.aIzquierda;
                    } else if (this.orientacion.y === orientaciones.y.inversa) {
                        this.animacion = this.aIzquierdaInversa;
                    }
                }
                break;
            case estados.muriendo:
                if (this.orientacion.x === orientaciones.x.derecha) {
                    if (this.orientacion.y === orientaciones.y.normal) {
                        this.animacion = this.aDerechaMuerte;
                    } else if (this.orientacion.y === orientaciones.y.inversa) {
                        this.animacion = this.aDerechaInversaMuerte
                    }
                } else if (this.orientacion.x === orientaciones.x.izquierda) {
                    if (this.orientacion.y === orientaciones.y.normal) {
                        this.animacion = this.aIzquierdaMuerte;
                    } else if (this.orientacion.y === orientaciones.y.inversa) {
                        this.animacion = this.aIzquierdaInversaMuerte;
                    }
                }
                break;
        }
        this.animacion.actualizar();
    }

    dibujar() {
        this.animacion.dibujar(this.x, this.y);
    }

    moverX(direccion) {
        this.vx = direccion * 5; // TODO Añadir inercia y aceleración
    }

    invertirGravedad() {
        if (this.estado !== estados.muriendo && this.estado !== estados.saltando && this.esperaSalto === 0) {
            this.estado = estados.saltando;
            if (this.orientacion.y === orientaciones.y.normal) {
                this.orientacion.y = orientaciones.y.inversa;
                reproducirEfecto(efectos.salto1);
            } else {
                this.orientacion.y = orientaciones.y.normal;
                reproducirEfecto(efectos.salto2);
            }

        }
    }

    getGravedad() {
        if (this.orientacion.y === orientaciones.y.normal)
            return gravedadModulo;
        else
            return -gravedadModulo
    }

    finAnimacionMuriendo() {
        this.estado = estados.muerto;
    }

    morir() {
        if (this.estado !== estados.muriendo) {
            reproducirEfecto(efectos.muerte);
            this.estado = estados.muriendo;
        }
    }

    cogerTesoro(tesoro) {
        reproducirEfecto(efectos.tesoro);
        this.tesoros.push(tesoro.numero);
    }

    apoyadoEn(modelo) {
        let apoyado = false;

        if (this.orientacion.y === orientaciones.y.normal) {
            if (modelo.x - modelo.ancho / 2 < this.x + this.ancho / 2
                && modelo.x + modelo.ancho / 2 > this.x - this.ancho / 2
                && this.y + this.alto / 2 === modelo.y - modelo.alto / 2) {
                apoyado = true;
            }
        } else if (this.orientacion.y === orientaciones.y.inversa) {
            if (modelo.x - modelo.ancho / 2 < this.x + this.ancho / 2
                && modelo.x + modelo.ancho / 2 > this.x - this.ancho / 2
                && this.y - this.alto / 2 === modelo.y + modelo.alto / 2) {
                apoyado = true;
            }
        }

        return apoyado;
    }

}