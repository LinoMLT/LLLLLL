class GameLayer extends Layer {

    constructor() {
        super();
        this.pausa = false;
        this.iniciar();
    }

    iniciar() {
        reproducirMusica();
        this.botonSalto = new Boton(imagenes.boton_salto, anchoNativo * 0.9, altoNativo * 0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo, anchoNativo * 0.75, altoNativo * 0.83);
        this.pad = new Pad(anchoNativo * 0.14, altoNativo * 0.8);
        this.fondo = new Fondo(imagenes.fondo, anchoNativo * 0.5, altoNativo * 0.5);
        this.nivelActual = nivelInicial;
        this.ultimoGuardado = {};

        this.iniciarNuevoNivel(nivelInicial.x, nivelInicial.y);
    }

    iniciarNivel(nivelX, nivelY) {
        if (nivelX === this.nivelActual.x && nivelY === this.nivelActual.y)
            this.reiniciarNivelActual();
        else
            this.iniciarNuevoNivel(nivelX, nivelY);
    }

    iniciarNuevoNivel(nivelX, nivelY) {
        this.nivelActual = {x: nivelX, y: nivelY};

        this.espacio = new Espacio();
        this.bloques = [];
        this.pinchos = [];
        this.enemigos = [];
        this.checkpoints = [];
        this.plataformasTemporales = [];
        this.plataformasMoviles = [];
        this.tesoros = [];

        this.cargarMapa("res/" + nivelX + "_" + nivelY + ".txt");
        this.espacio.agregarCuerpoDinamico(this.jugador);
    }

    reiniciarNivelActual() {
        for (let i = 0; i < this.plataformasTemporales.length; i++) {
            if (this.plataformasTemporales[i].estado !== estadosPlataforma.normal) {
                this.espacio.agregarCuerpoBloqueante(this.plataformasTemporales[i]);
                this.plataformasTemporales[i].estado = estadosPlataforma.apareciendo;
            }
        }
    }

    actualizar() {
        if (this.pausa) {
            return;
        }

        // GRAVEDAD TODO Mover de aquí
        this.jugador.vy += this.jugador.getGravedad();

        // maxima velocidad de caida por gravedad
        if (this.jugador.vy > 10)
            this.jugador.vy = 10;
        else if (this.jugador.vy < -10)
            this.jugador.vy = -10;

        for (let i = 0; i < this.plataformasMoviles.length; i++) {
            if (this.jugador.apoyadoEn(this.plataformasMoviles[i])) {
                this.jugador.vx += this.plataformasMoviles[i].vx;
                this.jugador.vy += this.plataformasMoviles[i].vy;
            }
        }

        this.espacio.actualizar();
        this.fondo.actualizar();
        this.jugador.actualizar();

        if (this.jugador.estado === estados.muerto) {
            this.espacio.descongelar();
            this.revivirJugador();
            this.iniciarNivel(this.ultimoGuardado.nivel.x, this.ultimoGuardado.nivel.y);
            return;
        }

        if (!this.jugador.estaEnPantalla())
            this.cambiarNivel();

        // colisiones
        for (let i = 0; i < this.pinchos.length; i++) {
            if (this.jugador.colisiona(this.pinchos[i])) {
                this.espacio.congelar();
                this.jugador.morir();
            }
        }

        for (let i = 0; i < this.enemigos.length; i++) {
            if (this.jugador.colisiona(this.enemigos[i])) {
                this.espacio.congelar();
                this.jugador.morir();
            }
        }

        for (let i = 0; i < this.checkpoints.length; i++) {
            if (this.jugador.colisiona(this.checkpoints[i]) && !this.checkpoints[i].activo) {
                this.ultimoGuardado = {
                    nivel: {
                        x: this.nivelActual.x,
                        y: this.nivelActual.y
                    },
                    x: this.checkpoints[i].x,
                    y: this.jugador.y,
                    orientacion: {
                        x: this.jugador.orientacion.x,
                        y: this.checkpoints[i].orientacion
                    }
                };
                this.activarCheckpoint(this.checkpoints[i]);
            }
        }

        for (let i = 0; i < this.plataformasTemporales.length; i++) {
            let plataforma = this.plataformasTemporales[i];
            plataforma.actualizar();

            if (plataforma.estado === estadosPlataforma.invisible) {
                this.espacio.eliminarCuerpoBloqueante(plataforma);
            } else if (this.jugador.apoyadoEn(plataforma)) {
                plataforma.activar();
            }
        }

        for (let i = 0; i < this.plataformasMoviles.length; i++) {
            this.plataformasMoviles[i].actualizar();
        }

        for (let i = 0; i < this.tesoros.length; i++) {
            this.tesoros[i].actualizar();
            if (this.jugador.colisiona(this.tesoros[i])) {
                this.jugador.cogerTesoro(this.tesoros[i]);
                this.tesoros.splice(i, 1);
            }
        }

        for (let i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].actualizar();
        }

        for (let i = 0; i < this.checkpoints.length; i++) {
            this.checkpoints[i].actualizar();
        }
    }

    revivirJugador() {
        this.jugador.estado = estados.quieto;
        this.jugador.vx = 0;
        this.jugador.vy = 0;
        this.jugador.x = this.ultimoGuardado.x;
        this.jugador.y = this.ultimoGuardado.y;
        this.jugador.orientacion.x = this.ultimoGuardado.orientacion.x;
        this.jugador.orientacion.y = this.ultimoGuardado.orientacion.y;
    }

    activarCheckpoint(checkpoint) {
        for (let i = 0; i < this.checkpoints.length; i++) {
            this.checkpoints[i].desactivar();
        }
        checkpoint.activar();
    }

    dibujar() {
        this.fondo.dibujar();

        for (let i = 0; i < this.bloques.length; i++) {
            this.bloques[i].dibujar();
        }
        for (let i = 0; i < this.pinchos.length; i++) {
            this.pinchos[i].dibujar();
        }
        for (let i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].dibujar();
        }

        for (let i = 0; i < this.checkpoints.length; i++) {
            this.checkpoints[i].dibujar();
        }

        for (let i = 0; i < this.plataformasTemporales.length; i++) {
            this.plataformasTemporales[i].dibujar();
        }

        for (let i = 0; i < this.plataformasMoviles.length; i++) {
            this.plataformasMoviles[i].dibujar();
        }

        for (let i = 0; i < this.tesoros.length; i++) {
            this.tesoros[i].dibujar();
        }

        this.jugador.dibujar();

        // HUD
        if (!this.pausa && entrada === entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.botonSalto.dibujar();
            this.pad.dibujar();
        }

        if (this.pausa) {
            // this.mensaje.dibujar();
        }
    }


    procesarControles() {
        if (controles.continuar) {
            controles.continuar = false;
            this.pausa = false;
        }

        // Eje X
        if (controles.moverX > 0) {
            this.jugador.moverX(1); // TODO Cambiar a cambiarVelocidad

        } else if (controles.moverX < 0) {
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }
        // Eje Y
        if (controles.saltar) {
            this.jugador.invertirGravedad()
        }
    }

    cargarMapa(ruta) {
        let fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function () {
            let texto = fichero.responseText;
            let lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length - 1) * 8;
            for (let i = 0; i < lineas.length; i++) {
                let linea = lineas[i];
                for (let j = 0; j < linea.length; j++) {
                    let simbolo = linea[j];
                    let x = j * 8; // Esquina superior izuqierda
                    let y = i * 8;
                    this.cargarObjetoMapa(simbolo, x, y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y) {
        switch (simbolo) {
            case "+":
                let bloqueFondo = new Bloque(imagenes.bloque_fondo_sin_bordes, x, y);
                bloqueFondo.x += bloqueFondo.ancho / 2;
                bloqueFondo.y += bloqueFondo.alto / 2;
                this.bloques.push(bloqueFondo);
                break;
            case "P":
                let pinchoDer = new Bloque(imagenes.pincho_derecha, x, y);
                pinchoDer.x += pinchoDer.ancho / 2;
                pinchoDer.y += pinchoDer.alto / 2;
                this.pinchos.push(pinchoDer);
                break;
            case "p":
                let pinchoIz = new Bloque(imagenes.pincho_izquierda, x, y);
                pinchoIz.x += pinchoIz.ancho / 2;
                pinchoIz.y += pinchoIz.alto / 2;
                this.pinchos.push(pinchoIz);
                break;
            case "R":
                let pinchoAba = new Bloque(imagenes.pincho_abajo, x, y);
                pinchoAba.x += pinchoAba.ancho / 2;
                pinchoAba.y += pinchoAba.alto / 2;
                this.pinchos.push(pinchoAba);
                break;
            case "r":
                let pinchoAr = new Bloque(imagenes.pincho_arriba, x, y);
                pinchoAr.x += pinchoAr.ancho / 2;
                pinchoAr.y += pinchoAr.alto / 2;
                this.pinchos.push(pinchoAr);
                break;
            case "J":
                if (this.jugador == null) {
                    this.jugador = new Jugador(x, y);
                    this.jugador.x += this.jugador.ancho / 2;
                    this.jugador.y += this.jugador.alto / 2;
                    this.ultimoGuardado = {
                        nivel: nivelInicial,
                        x: this.jugador.x,
                        y: this.jugador.y,
                        orientacion: {
                            x: orientaciones.x.derecha,
                            y: orientaciones.y.normal
                        }
                    };
                }
                break;
            case "#":
                let bloqueBorde = new Bloque(imagenes.bloque_sin_bordes, x, y);
                bloqueBorde.x += bloqueBorde.ancho / 2;
                bloqueBorde.y += bloqueBorde.alto / 2;
                this.bloques.push(bloqueBorde);
                this.espacio.agregarCuerpoBloqueante(bloqueBorde);
                break;
            case "E":
                let enemigo1 = new Enemigo1(imagenes.enemigo1, x, y, sentidoMov.abajo);
                enemigo1.x += enemigo1.ancho / 2;
                enemigo1.y += enemigo1.alto / 2;
                this.enemigos.push(enemigo1);
                this.espacio.agregarCuerpoDinamico(enemigo1);
                break;
            case "e":
                let enemigo2 = new Enemigo2(imagenes.enemigo2, x, y, sentidoMov.izquierda);
                enemigo2.x += enemigo2.ancho / 2;
                enemigo2.y += enemigo2.alto / 2;
                this.enemigos.push(enemigo2);
                this.espacio.agregarCuerpoDinamico(enemigo2);
                break;
            case "C":
                let checkpoint = new Checkpoint(x, y, orientaciones.y.normal);
                checkpoint.x += checkpoint.ancho / 2;
                checkpoint.y += checkpoint.alto / 2;
                this.checkpoints.push(checkpoint);
                break;
            case "c":
                let checkpointInv = new Checkpoint(x, y, orientaciones.y.inversa);
                checkpointInv.x += checkpointInv.ancho / 2;
                checkpointInv.y += checkpointInv.alto / 2;
                this.checkpoints.push(checkpointInv);
                break;
            case "_":
                let plataformaTemporal = new PlataformaTemporal(x, y);
                plataformaTemporal.x += plataformaTemporal.ancho / 2;
                plataformaTemporal.y += plataformaTemporal.alto / 2;
                this.plataformasTemporales.push(plataformaTemporal);
                this.espacio.agregarCuerpoBloqueante(plataformaTemporal);
                break;
            case ">":
                let plataformaMovil = new PlataformaMovil(x, y, sentidoMov.derecha);
                plataformaMovil.x += plataformaMovil.ancho / 2;
                plataformaMovil.y += plataformaMovil.alto / 2;
                this.plataformasMoviles.push(plataformaMovil);
                this.espacio.agregarCuerpoBloqueante(plataformaMovil);
                this.espacio.agregarCuerpoDinamico(plataformaMovil);
                break;
            case "1":
            case "2":
            case "3":
            case "4":
                if (this.jugador != null && !this.jugador.tesoros.includes(simbolo)) {
                    let tesoro = new Tesoro(x, y, simbolo);
                    tesoro.x += tesoro.ancho / 2;
                    tesoro.y += tesoro.alto / 2;
                    this.tesoros.push(tesoro);
                }

                break;
        }
    }

    calcularPulsaciones(pulsaciones) {
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        this.botonSalto.pulsado = false;
        // suponemos que el pad está sin tocar
        controles.moverX = 0;
        // Suponemos a false
        controles.continuar = false;

        for (let i = 0; i < pulsaciones.length; i++) {
            // MUY SIMPLE SIN BOTON cualquier click en pantalla lo activa
            if (pulsaciones[i].tipo === tipoPulsacion.inicio) {
                controles.continuar = true;
            }

            if (this.pad.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                let orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if (orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = 1;
                }
                if (orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = -1;
                }
            }

            if (this.botonDisparo.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                this.botonDisparo.pulsado = true;
                if (pulsaciones[i].tipo === tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

            if (this.botonSalto.contienePunto(pulsaciones[i].x, pulsaciones[i].y)) {
                this.botonSalto.pulsado = true;
                if (pulsaciones[i].tipo === tipoPulsacion.inicio) {
                    controles.saltar = true;
                }
            }
        }

        // No pulsado - Boton Disparo
        if (!this.botonDisparo.pulsado) {
            controles.disparo = false;
        }

        // No pulsado - Boton Salto
        if (!this.botonSalto.pulsado) {
            controles.saltar = false;
        }
    }

    cambiarNivel() {
        let siguienteNivel = {
            x: this.nivelActual.x,
            y: this.nivelActual.y
        };

        if (this.jugador.fuera.arriba) {
            siguienteNivel.y++;
            this.jugador.y = altoNativo - this.jugador.alto / 2;
        }
        if (this.jugador.fuera.abajo) {
            siguienteNivel.y--;
            this.jugador.y = this.jugador.alto / 2;
        }
        if (this.jugador.fuera.izquierda) {
            siguienteNivel.x--;
            this.jugador.x = anchoNativo - this.jugador.ancho / 2;
        }
        if (this.jugador.fuera.derecha) {
            siguienteNivel.x++;
            this.jugador.x = this.jugador.ancho / 2;
        }

        if (siguienteNivel.x > nivelMaximo.x)
            siguienteNivel.x = 0;
        else if (siguienteNivel.x < 0)
            siguienteNivel.x = nivelMaximo.x;
        if (siguienteNivel.y > nivelMaximo.y)
            siguienteNivel.y = 0;
        else if (siguienteNivel.y < 0)
            siguienteNivel.y = nivelMaximo.y;

        this.iniciarNivel(siguienteNivel.x, siguienteNivel.y);
    }

}
