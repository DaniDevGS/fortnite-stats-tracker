export class FortnitePlayer
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