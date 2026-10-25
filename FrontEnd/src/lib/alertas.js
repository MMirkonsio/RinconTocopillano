import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

export { toast } from "sonner";

// SweetAlert2 con los colores y botones de la app
const Alerta = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: "alerta-rincon",
    confirmButton: "btn-primario",
    cancelButton: "btn-secundario",
  },
});

// Pide confirmación antes de una acción destructiva. Devuelve true si acepta.
export const confirmar = async ({ titulo, texto, boton = "Eliminar" }) => {
  const { isConfirmed } = await Alerta.fire({
    title: titulo,
    text: texto,
    icon: "warning",
    iconColor: "#dc2626",
    showCancelButton: true,
    confirmButtonText: boton,
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "alerta-rincon",
      confirmButton: "btn-peligro",
      cancelButton: "btn-secundario",
    },
  });
  return isConfirmed;
};

// Mensaje de error legible a partir de un error de axios/fetch
export const mensajeError = (error, porDefecto = "Ocurrió un error. Inténtalo de nuevo.") =>
  error?.response?.data?.error || error?.response?.data?.message || porDefecto;
