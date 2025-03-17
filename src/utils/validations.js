// utils/validations.js

// Validar que el nombre no esté vacío
export const validateName = (name) => {
  if (!name || typeof name !== "string") return false;

  // Expresión regular: solo letras y al menos dos palabras
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}$/;
  return regex.test(name.trim());
};

export const validateApellidoPaterno = (name) => {
    if (!name || typeof name !== "string") return false;
  
    // Expresión regular: solo letras y al menos dos palabras
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}$/;
    return regex.test(name.trim());
  };

  export const validateApellidoMaterno = (name) => {
    if (!name || typeof name !== "string") return false;
  
    // Expresión regular: solo letras y al menos dos palabras
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}$/;
    return regex.test(name.trim());
  };

// Validar la fecha de nacimiento (formato YYYY-MM-DD y mayor o igual a 18 años)
export const validateFechaNacimiento = (fechaNacimiento) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fechaNacimiento)) return false;

  const fechaNac = new Date(fechaNacimiento);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    return edad - 1 >= 18;
  }
  return edad >= 18;
};

// Validar que se haya seleccionado un sexo
export const validateSexo = (sexo) => {
  return sexo !== "";
};

// Validar que el teléfono tenga al menos 10 dígitos
export const validateTelefono = (telefono) => {
  const regex = /^\d{10}$/;
  return regex.test(telefono);
};

// Validar que el correo tenga un formato válido
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar que la contraseña cumpla con los requisitos
export const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};
