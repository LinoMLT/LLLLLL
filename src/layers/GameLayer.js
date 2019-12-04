class GameLayer extends Layer {

    constructor() {
        super();
        this.pausa = false;
        this.iniciar();
    }

    iniciar() {
        // reproducirMusica();
        this.botonSalto = new Boton(imagenes.boton_salto, anchoNativo * 0.9, altoNativo * 0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo, anchoNativo * 0.75, altoNativo * 0.83);
        this.pad = new Pad(anchoNativo * 0.14, altoNativo * 0.8);
        this.fondo = new Fondo(imagenes.fondo, anchoNativo * 0.5, altoNativo * 0.5);
        this.nivelActual = nivelInicial;
        this.ultimoGuardado = {};

        this.iniciarNivel(nivelInicial.x, nivelInicial.y);

    }

    iniciarNivel(nivelX, nivelY) {
        this.nivelActual = {x: nivelX, y: nivelY};

        this.espacio = new Espacio();
        this.bloques = [];
        this.pinchos = [];
        this.enemigos = [];

        this.cargarMapa("res/" + nivelX + "_" + nivelY + ".txt");
        this.espacio.agregarCuerpoDinamico(this.jugador);
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

        this.espacio.actualizar();
        this.fondo.actualizar();
        this.jugador.actualizar();

        if (this.jugador.estado === estados.muerto) {
            this.jugador.estado = estados.quieto;
            this.jugador.vx = 0;
            this.jugador.vy = 0;
            this.jugador.x = this.ultimoGuardado.x;
            this.jugador.y = this.ultimoGuardado.y;
            this.jugador.orientacion.x = this.ultimoGuardado.orientacion.x;
            this.jugador.orientacion.y = this.ultimoGuardado.orientacion.y; // this.ultimoGuardado.orientacion.y;

            this.iniciarNivel(this.ultimoGuardado.nivel.x, this.ultimoGuardado.nivel.y);
            return;
        }

        if (!this.jugador.estaEnPantalla())
            this.cambiarNivel();

        // colisiones
        for (let i = 0; i < this.pinchos.length; i++) {
            if (this.jugador.colisiona(this.pinchos[i])) {
                this.espacio.eliminarCuerpoDinamico(this.jugador);
                this.jugador.morir();
            }
        }

        // for (let i = 0; i < this.enemigos.length; i++) {
        //     if (this.jugador.colisiona(this.enemigos[i])) {
        //         this.jugador.morir();
        //         this.iniciarNivelActual();
        //     }
        // }
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
                let pincho = new Bloque(imagenes.pincho, x, y);
                pincho.x += pincho.ancho / 2;
                pincho.y += pincho.alto / 2;
                this.pinchos.push(pincho);
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
        if (this.jugador.fuera.arriba) {
            this.nivelActual.y--;
            this.jugador.y = altoNativo - this.jugador.alto / 2;
        }
        if (this.jugador.fuera.abajo) {
            this.nivelActual.y++;
            this.jugador.y = this.jugador.alto / 2;
        }
        if (this.jugador.fuera.izquierda) {
            this.nivelActual.x--;
            this.jugador.x = anchoNativo - this.jugador.ancho / 2;
        }
        if (this.jugador.fuera.derecha) {
            this.nivelActual.x++;
            this.jugador.x = this.jugador.ancho / 2;
        }

        if (this.nivelActual.x > nivelMaximo.x)
            this.nivelActual.x = 0;
        else if (this.nivelActual.x < 0)
            this.nivelActual.x = nivelMaximo.x;
        if (this.nivelActual.y > nivelMaximo.y)
            this.nivelActual.y = 0;
        else if (this.nivelActual.y < 0)
            this.nivelActual.y = nivelMaximo.y;

        this.iniciarNivel(this.nivelActual.x, this.nivelActual.y);
    }

}
