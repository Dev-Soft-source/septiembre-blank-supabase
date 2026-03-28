const PanelAdminSafe: React.FC = () => {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      textAlign: 'center',
      backgroundColor: '#7E26A6',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#fff' }}>🛡️ Panel de Administración – Modo Seguro</h1>
      <p style={{ color: '#fff' }}>Bienvenido, Fernando.</p>
      <p style={{ color: '#ccc' }}>Estás accediendo al entorno de desarrollo de Hotel Living.</p>

      <p style={{ marginTop: '30px', fontWeight: 'bold', color: '#fff' }}>
        Este panel bypassa todos los sistemas de login y carga directamente en modo seguro.
      </p>

      <p style={{ marginTop: '20px', color: '#eee' }}>
        Puedes usar este punto de acceso incluso si fallan otros componentes del sistema.
      </p>

      <div style={{
        marginTop: '50px',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h2 style={{ color: '#7E26A6' }}>Panel de gestión interno</h2>

        <ul style={{ marginTop: '30px', lineHeight: '2.2em', fontSize: '16px' }}>
          <li><a href="/adminHotels" style={{ color: '#7E26A6', textDecoration: 'none' }}>📦 Ver y aprobar hoteles registrados</a></li>
          <li><a href="/adminStats" style={{ color: '#7E26A6', textDecoration: 'none' }}>📈 Ver estadísticas globales del sistema</a></li>
          <li><a href="/adminCommissions" style={{ color: '#7E26A6', textDecoration: 'none' }}>💰 Revisar comisiones por asociaciones</a></li>
          <li><a href="/adminPromos" style={{ color: '#7E26A6', textDecoration: 'none' }}>🛠️ Gestionar promociones y contenido destacado</a></li>
          <li><a href="/adminTranslations" style={{ color: '#7E26A6', textDecoration: 'none' }}>🗃️ Controlar traducciones y keys multilingües</a></li>
          <li><a href="/adminReload" style={{ color: '#7E26A6', textDecoration: 'none' }}>🔄 Recargar caché o volver a ejecutar scripts</a></li>
        </ul>

        <p style={{ marginTop: '30px', color: '#444', fontStyle: 'italic' }}>
          * Este panel no requiere sesión ni rol de administrador. Está diseñado como acceso de emergencia.
        </p>
      </div>
    </div>
  );
};

export default PanelAdminSafe;
