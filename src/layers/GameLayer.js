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

        this.iniciarNivelActual();

    }

    iniciarNivelActual() {
        this.espacio = new Espacio();
        this.bloques = [];
        this.enemigos = [];

        this.cargarMapa("res/" + nivelActual.x + "_" + nivelActual.y + ".txt");
        this.espacio.agregarCuerpoDinamico(this.jugador);
    }

    actualizar() {
        if (this.pausa) {
            return;
        }

        // GRAVEDAD TODO Mover de aquí
        this.jugador.vy += this.jugador.gravedad;

        // maxima velocidad de caida por gravedad
        if (this.jugador.vy > 10)
            this.jugador.vy = 10;
        else if (this.jugador.vy < -10)
            this.jugador.vy = -10;


        this.espacio.actualizar();
        this.fondo.actualizar();
        this.jugador.actualizar();
        if (!this.jugador.estaEnPantalla())
            this.cambiarNivel();

        for (let i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].actualizar();
        }

        // colisiones
        for (let i = 0; i < this.enemigos.length; i++) {
            if (this.jugador.colisiona(this.enemigos[i])) {
                this.jugador.morir();
                this.iniciar();
            }
        }
    }

    dibujar() {
        this.fondo.dibujar();

        for (let i = 0; i < this.bloques.length; i++) {
            this.bloques[i].dibujar();
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
            case "E":
                let enemigo = new Enemigo(x, y);
                enemigo.y = enemigo.y - enemigo.alto / 2;
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "J":
                if (this.jugador == null) {
                    this.jugador = new Jugador(x, y);
                    this.jugador.x += this.jugador.ancho / 2;
                    this.jugador.y += this.jugador.alto / 2;
                }
                break;
            case "#":
                let bloqueBorde = new Bloque(imagenes.bloque_sin_bordes, x, y);
                bloqueBorde.x += bloqueBorde.ancho / 2;
                bloqueBorde.y += bloqueBorde.alto / 2;
                this.bloques.push(bloqueBorde);
                this.espacio.agregarCuerpoEstatico(bloqueBorde);
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
            nivelActual.y--;
            this.jugador.y = altoNativo - this.jugador.alto / 2;
        }
        if (this.jugador.fuera.abajo) {
            nivelActual.y++;
            this.jugador.y = 0 + this.jugador.alto / 2;
        }
        if (this.jugador.fuera.izquierda) {
            nivelActual.x--;
            this.jugador.x = anchoNativo - this.jugador.ancho / 2;
        }
        if (this.jugador.fuera.derecha) {
            nivelActual.x++;
            this.jugador.x = 0 + this.jugador.ancho / 2;
        }

        if (nivelActual.x > nivelMaximo.x)
            nivelActual.x = 0;
        if (nivelActual.x < 0)
            nivelActual.x = nivelMaximo.x;
        if (nivelActual.y > nivelMaximo.y)
            nivelActual.y = 0;
        if (nivelActual.y < 0)
            nivelActual.y = nivelMaximo.y;

        this.iniciarNivelActual();
    }

}
