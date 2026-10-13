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

let skinsCache = null;

async function getRandomSkin() {
    try {
        if (!skinsCache) {
            const respuesta = await fetch('https://fortnite-api.com/v2/cosmetics/br');
            
            if (!respuesta.ok) throw new Error("No se pudo cargar el catálogo de cosméticos");
            
            const datos = await respuesta.json();

            const items = datos.data || [];
            skinsCache = items.filter(item => item.type?.value === 'outfit' || item.type?.displayValue?.toLowerCase() === 'outfit');
        }

        if (!skinsCache || skinsCache.length === 0) return null;

        const skinAleatoria = skinsCache[Math.floor(Math.random() * skinsCache.length)];
        
        return skinAleatoria.images?.icon || skinAleatoria.images?.featured || skinAleatoria.images?.smallIcon || null;
    } catch (error) {
        console.error("Error al obtener la skin:", error);
        return null; 
    }
}

class FornitePlayer 
{
    constructor(stats, skinUrl = null) 
    {
        this.avatarSkin = skinUrl || 'https://fortnite.gg/img/items/52/gradient.jpg?12';

        this.cuentaNombre = stats.data.account.name;
        this.nivelPaseBatalla = stats.data.battlePass.level;
        this.eliminaciones = stats.data.stats.all.overall.kills;
        this.kd = stats.data.stats.all.overall.kd;
        this.muertes = stats.data.stats.all.overall.deaths;
        this.partidas = stats.data.stats.all.overall.matches;
        this.ultimaModificacion = this.formatearFecha(stats.data.stats.all.overall.lastModified);
        this.horasJugadas = this.formatearTiempoJugado(stats.data.stats.all.overall.minutesPlayed);
        this.tasaVictorias = stats.data.stats.all.overall.winRate;
        this.victorias = stats.data.stats.all.overall.wins;
    }

    formatearFecha(fechaUTC) 
    {
        if (!fechaUTC) return 'No disponible';

        const fecha = new Date(fechaUTC);
        
        return fecha.toLocaleString('es-VE', {
            timeZone: 'America/Caracas',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    formatearTiempoJugado(minutos) 
    {
        if (!minutos || typeof minutos !== 'number') return '0 h';

        const horas = Math.floor(minutos / 60);
        const minsRestantes = minutos % 60;

        return minsRestantes > 0 ? `${horas} h ${minsRestantes} min` : `${horas} h`;
    }
}

const input = document.querySelector("#nametag-input");
const form = document.querySelector("#search-form");
const contenedorJugador = document.querySelector(".jugador-buscado");
const contenedorJugadorFavorito = document.querySelector(".jugadores-favoritos");

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

    contenedorJugador.innerHTML = "<p>Buscando estadísticas del jugador...</p>";

    let skinPromise;
    if (namePlayer.toUpperCase() === "GHOSTSCP141") {
        skinPromise = Promise.resolve("https://fortnite-api.com/images/cosmetics/br/character_kelplinenmagnesium/icon.png");
    } else {
        skinPromise = getRandomSkin();
    }

    try {
        const [stats, skinUrl] = await Promise.all([getFortniteStats(namePlayer), skinPromise]);
        
        const player = new FornitePlayer(stats, skinUrl);
        mostrarStatsJugador(player);
        input.value = "";

        console.log(`Nombre del jugador: ${player.cuentaNombre}`);
        console.log(`Ultima actualizacion de datos: ${player.ultimaModificacion}\n`);

    } catch (error) {
        contenedorJugador.innerHTML = `<p style="color: #ff4d4d;">${error.message}</p>`;
    }
});

window.addEventListener("DOMContentLoaded", ()=> {
    let favoritosIniciales = JSON.parse(localStorage.getItem("Jugadores favoritos")) || [];
    mostrarJugadoresFavoritos(favoritosIniciales);
})