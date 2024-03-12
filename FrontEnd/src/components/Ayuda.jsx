import { Link } from 'react-router-dom';

const PreguntasFrecuentes = () => {
  const faqs = [
    {
      id: 1,
      pregunta: '¿Cómo puedo registrarme en el sitio?',
      respuesta: 'Puedes registrarte haciendo clic en el botón "Registrarse" en la esquina superior derecha de la página de inicio.',
    },
    {
      id: 2,
      pregunta: '¿Cómo puedo restablecer mi contraseña?',
      respuesta: 'Puedes restablecer tu contraseña haciendo clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión y siguiendo las instrucciones proporcionadas.',
    },
    {
      id: 3,
      pregunta: '¿Cómo puedo actualizar mi información de perfil?',
      respuesta: 'Puedes actualizar tu información de perfil iniciando sesión y luego haciendo clic en tu nombre de usuario en la esquina superior derecha. Desde allí, selecciona "Editar perfil" y realiza los cambios necesarios.',
    },
    // Agrega más preguntas y respuestas según sea necesario
  ];

  return (
    <div className="flex flex-col h-screen items-left relative top-14 bg-gray-100 lg:ml-auto lg:mr-20 w-3/4 p-6 rounded-lg epilogue text-gray-800  dark:bg-rincon dark:text-gray-100">
      <h2 className="text-xl font-bold mb-4">Preguntas Frecuentes</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id}>
            <h3 className="text-lg font-semibold">{faq.pregunta}</h3>
            <p className="text-sm">{faq.respuesta}</p>
          </div>
        ))}
      </div>

      {/* Información de contacto */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Información de contacto</h3>
        <p className="text-sm">Para obtener ayuda adicional, contáctenos en <a href="mailto:info@ejemplo.com">TocoTurbo@gmail.com</a> o llame al <a href="tel:+123456789">+123456789</a>.</p>
      </div>

      {/* Sección de políticas */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Políticas</h3>
        <ul className="list-disc list-inside">
          <li><Link to="/politica-de-privacidad" className="text-blue-600 hover:underline">Política de privacidad</Link></li>
          <li><Link to="/terminos-de-servicio" className="text-blue-600 hover:underline">Términos de servicio</Link></li>
          <li><Link to="/politica-de-devolucion" className="text-blue-600 hover:underline">Política de devolución</Link></li>
        </ul>
      </div>

      {/* Sección de actualizaciones */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Actualizaciones</h3>
        <p className="text-sm">Mantente informado sobre las últimas actualizaciones y nuevas funciones visitando regularmente nuestra sección de <Link to="/actualizaciones" className="text-blue-600 hover:underline">Actualizaciones</Link>.</p>
      </div>
    </div>
  );
};

export default PreguntasFrecuentes;