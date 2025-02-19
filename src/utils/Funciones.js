// Para formatear fecha Ejem: 15 febrero del 2025
const formatDate = (dateString) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const date = new Date(dateString); // Convertir la cadena en un objeto de fecha
  const day = date.getDate(); // Obtener el día
  const month = months[date.getMonth()]; // Obtener el mes
  const year = date.getFullYear(); // Obtener el año

  return { day, monthYear: `${month} del ${year}` };
};

// Para calcular dias Ejem: 8 Dias
const calcularDiasRestantes = (fechaObjetivo) => {
  const hoy = new Date(); // Obtener la fecha actual
  hoy.setHours(0, 0, 0, 0); // Establecer a medianoche para evitar diferencias de horas

  const objetivo = new Date(fechaObjetivo);
  objetivo.setHours(0, 0, 0, 0); // Ajustar a medianoche

  // Calcular la diferencia en milisegundos y convertir a días
  const diferencia = (objetivo - hoy) / (1000 * 60 * 60 * 24);

  return Math.max(Math.ceil(diferencia), 0); // Devolver el número de días restantes, asegurando que no sea negativo
};

// convierte a GB 
const convertirAGB = (mb) => {
  if (!mb || isNaN(mb)) return "0 GB"; // Validación para evitar errores

  const gb = mb / 1024; // 1 GB = 1024 MB
  return gb.toFixed(1) /* + " GB" */; // Redondear a 2 decimales
};

const restarSinRetorno = (a, b) => {
  const resultado = a - b;    
  return resultado;
};

export { formatDate, calcularDiasRestantes, convertirAGB, restarSinRetorno };
