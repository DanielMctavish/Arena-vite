export function formatTimeToHoursAndMinutes(hours) {
    if (!hours) return '0h';
    
    // Converte horas para minutos
    const totalMinutes = hours * 60;
    
    // Calcula horas e minutos
    const hoursCount = Math.floor(totalMinutes / 60);
    const minutesCount = Math.round(totalMinutes % 60);
    
    // Formata a string de retorno
    if (hoursCount === 0) {
        return `${minutesCount}min`;
    }
    
    if (minutesCount === 0) {
        return `${hoursCount}h`;
    }
    
    return `${hoursCount}h ${minutesCount}min`;
} 