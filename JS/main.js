import { FortnitePlayer } from "./FortnitePlayer.js";

const input = document.querySelector("#nametag-input");
const form = document.querySelector("#search-form");
const contenedorJugador = document.querySelector(".jugador-buscado");
const contenedorJugadorFavorito = document.querySelector(".jugadores-favoritos");

let skinsCache = null;

async function getFortniteStats(namePlayer) {
    const API_KEY = (typeof CONFIG !== 'undefined' && CONFIG.FORTNITE_API_KEY) 
        ? CONFIG.FORTNITE_API_KEY 
        : 'TU_API_KEY_AQUI';

    const respuesta = await fetch(
        `https://fortnite-api.com/v2/stats/br/v2?name=${namePlayer}`,
        {
            method: 'GET',
            headers: {
                'Authorization': API_KEY
            }
        }
    );

    if (!respuesta.ok) {
        throw new Error(`HTTP error: ${respuesta.status} - ${respuesta.statusText}`);
    }

    const datosFortnite = await respuesta.json();
    return datosFortnite;
}

async function getRandomSkin() {
    try {
        if (!skinsCache) {
            const respuesta = await fetch('https://fortnite-api.com/v2/cosmetics/br');
            
            if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo de cosméticos");
            
            const datos = await respuesta.json();

            const items = datos.data || [];
            skinsCache = items.filter(item => 
                item.type?.value === 'outfit' || item.type?.displayValue?.toLowerCase() === 'outfit'
            );
        }

        if (!skinsCache || skinsCache.length === 0) return null;

        const skinAleatoria = skinsCache[Math.floor(Math.random() * skinsCache.length)];
        
        return skinAleatoria.images?.icon || skinAleatoria.images?.featured || skinAleatoria.images?.smallIcon || null;

    } catch (error) {
        console.error("Error al obtener la skin:", error);
        return null; 
    }
}

function mostrarJugadoresFavoritos(listaJugadoresFavoritos) {
    contenedorJugadorFavorito.innerHTML = "";

    if (!listaJugadoresFavoritos || listaJugadoresFavoritos.length === 0) return;

    const tituloJugadoresFavoritos = document.createElement("h2");
    tituloJugadoresFavoritos.textContent = "Jugadores Favoritos";
    contenedorJugadorFavorito.append(tituloJugadoresFavoritos);

    for (const player of listaJugadoresFavoritos) {
        const cartFavoritos = document.createElement("article");
        cartFavoritos.classList.add("jugador-cart");

        cartFavoritos.innerHTML = `
            <div class="cart-principal">
                <div class="avatar">
                    <img id="jugador-avatar" src="${player.avatarSkin}" referrerpolicy="no-referrer" alt="Avatar">
                    <span id="victorias-jugador" class="id-article"><strong>Victorias: ${player.victorias}</strong></span>
                </div>

                <div class="info-jugador">
                    <h2 id="jugador-nombre">${player.cuentaNombre}</h2>
                    <p id="jugador-pb">Nivel del Pase de Batalla: ${player.nivelPaseBatalla}</p>
                    <div class="stats-mini">
                        <span id="tiempo-jugado">${player.horasJugadas}</span>
                        <span id="player-tasawins">Tasa de Victorias: ${player.tasaVictorias}%</span>
                    </div>
                </div>
            </div>

            <ul class="stats-grid">
                <li id="stat-kills"><strong>Kills:</strong> ${player.eliminaciones}</li>
                <li id="stat-kd"><strong>K/D:</strong> ${player.kd}</li>
                <li id="stat-muertes"><strong>Muertes:</strong> ${player.muertes}</li>
                <li id="stat-partidas"><strong>Partidas:</strong> ${player.partidas}</li>
                <li id="favorite-button"><button class="favorito-activo"><span class="material-symbols-outlined">bookmark</span></button></li>
            </ul>
        `;

        const botonFavorito = cartFavoritos.querySelector("#favorite-button button");

        botonFavorito.addEventListener("click", () => {
            let listaActual = JSON.parse(localStorage.getItem("Jugadores favoritos")) || [];

            listaActual = listaActual.filter(jugador => jugador.cuentaNombre !== player.cuentaNombre);
            alert(`¡${player.cuentaNombre} fue eliminado de favoritos!`);

            localStorage.setItem("Jugadores favoritos", JSON.stringify(listaActual));
            mostrarJugadoresFavoritos(listaActual);

            const botonBuscado = contenedorJugador.querySelector("#favorite-button button");
            const nombreBuscado = contenedorJugador.querySelector("#jugador-nombre");
            if (botonBuscado && nombreBuscado && nombreBuscado.textContent === player.cuentaNombre) {
                botonBuscado.classList.remove("favorito-activo");
            }
        });

        contenedorJugadorFavorito.append(cartFavoritos);
    }
}

function mostrarStatsJugador(player) {
    contenedorJugador.innerHTML = "";

    const cart = document.createElement("article");
    cart.classList.add("jugador-cart");
    
    cart.innerHTML = `
        <div class="cart-principal">
            <div class="avatar">
                <img id="jugador-avatar" src="${player.avatarSkin}" referrerpolicy="no-referrer" alt="Avatar">
                <span id="victorias-jugador" class="id-article"><strong>Victorias: ${player.victorias}</strong></span>
            </div>

            <div class="info-jugador">
                <h2 id="jugador-nombre">${player.cuentaNombre}</h2>
                <p id="jugador-pb">Nivel del Pase de Batalla: ${player.nivelPaseBatalla}</p>
                <div class="stats-mini">
                    <span id="tiempo-jugado">${player.horasJugadas}</span>
                    <span id="player-tasawins">Tasa de Victorias: ${player.tasaVictorias}%</span>
                </div>
            </div>
        </div>

        <ul class="stats-grid">
            <li id="stat-kills"><strong>Kills:</strong> ${player.eliminaciones}</li>
            <li id="stat-kd"><strong>K/D:</strong> ${player.kd}</li>
            <li id="stat-muertes"><strong>Muertes:</strong> ${player.muertes}</li>
            <li id="stat-partidas"><strong>Partidas:</strong> ${player.partidas}</li>
            <li id="favorite-button"><button><span class="material-symbols-outlined">bookmark</span></button></li>
        </ul>
    `;
    contenedorJugador.appendChild(cart);
    const botonFavorito = cart.querySelector("#favorite-button button");

    let jugadoresFavoritos = JSON.parse(localStorage.getItem("Jugadores favoritos")) || [];
    let sonFavoritos = jugadoresFavoritos.some(jugador => jugador.cuentaNombre === player.cuentaNombre);
    if (sonFavoritos) {
        botonFavorito.classList.add("favorito-activo");
    }

    botonFavorito.addEventListener("click", () => {
        let listaJugadoresFavoritos = JSON.parse(localStorage.getItem("Jugadores favoritos")) || [];
        
        let favoritos = listaJugadoresFavoritos.some(jugador => jugador.cuentaNombre === player.cuentaNombre);

        if (favoritos) {
            listaJugadoresFavoritos = listaJugadoresFavoritos.filter(jugador => jugador.cuentaNombre !== player.cuentaNombre);
            botonFavorito.classList.remove("favorito-activo");
            alert(`¡${player.cuentaNombre} fue eliminado de favoritos!`);
        } else {
            listaJugadoresFavoritos.push(player);
            botonFavorito.classList.add("favorito-activo");
            alert(`¡${player.cuentaNombre} agregado a favoritos!`);
        }

        localStorage.setItem("Jugadores favoritos", JSON.stringify(listaJugadoresFavoritos));
        mostrarJugadoresFavoritos(listaJugadoresFavoritos); 
    });
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const namePlayer = input.value.trim();
    if (!namePlayer) return;

    contenedorJugador.innerHTML = `
    <div class="loader-wrapper">
        <div class="loader">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
    </div>
    `;

    let skinPromise;
    if (namePlayer.toUpperCase() === "GHOSTSCP141") {
        skinPromise = Promise.resolve("https://fortnite-api.com/images/cosmetics/br/character_kelplinenmagnesium/icon.png");
    } else {
        skinPromise = getRandomSkin();
    }

    try {
        const [stats, skinUrl] = await Promise.all([getFortniteStats(namePlayer), skinPromise]);
        
        const player = new FortnitePlayer(stats, skinUrl);
        mostrarStatsJugador(player);
        input.value = "";

        console.log(`Nombre del jugador: ${player.cuentaNombre}`);
        console.log(`Ultima actualizacion de datos: ${player.ultimaModificacion}\n`);

    } catch (error) {
        contenedorJugador.innerHTML = `<p style="color: #ff4d4d;">${error.message}</p>`;
    }
});

async function actualizarStatsFavoritos() {
    let favoritosGuardados = JSON.parse(localStorage.getItem("Jugadores favoritos")) || [];

    if (favoritosGuardados.length === 0) return [];

    const favoritosActualizados = await Promise.all(
        favoritosGuardados.map(async (jugadorGuardado) => {
            try {
                const statsActualizadas = await getFortniteStats(jugadorGuardado.cuentaNombre);
                const jugadorActualizado = new FortnitePlayer(statsActualizadas, jugadorGuardado.avatarSkin);
                return jugadorActualizado;
            } catch (error) {
                console.warn(`No se pudo actualizar a ${jugadorGuardado.cuentaNombre}: ${error.message}`);
                return jugadorGuardado;
            }
        })
    );

    localStorage.setItem("Jugadores favoritos", JSON.stringify(favoritosActualizados));
    return favoritosActualizados;
}

window.addEventListener("DOMContentLoaded", async () => {
    let favoritosActualizados = await actualizarStatsFavoritos();
    mostrarJugadoresFavoritos(favoritosActualizados);
})