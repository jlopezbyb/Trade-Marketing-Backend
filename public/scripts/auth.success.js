(function () {
  try {
    console.log('📥 Intentando recuperar datos de autenticación...');

    const token = window.__SAML_TOKEN__;
    const refreshToken = window.__SAML_REFRESH__;

    if (!token || !refreshToken) {
      throw new Error('❌ No se encontraron los tokens en el contexto global.');
    }

    const authData = {
      type: 'SAML_AUTH_SUCCESS',
      token,
      refreshToken
    };

    if (window.opener) {
      console.log('📤 Enviando datos al parent window...');
      window.opener.postMessage(authData, '*');

      setTimeout(() => {
        console.log('🧹 Cerrando ventana popup...');
        window.close();
      }, 500);
    } else {
      // ⚠️ No hacemos redirección: solo informamos al usuario
      document.body.innerHTML = `
        <div style="font-family:sans-serif;text-align:center;margin-top:4rem">
          <h2>⚠️ No se pudo comunicar con la ventana principal</h2>
          <p>Por favor cierre esta ventana manualmente.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('❌ Error en auth.success.js:', error);
    document.body.innerHTML = `
      <div style="font-family:sans-serif;text-align:center;margin-top:4rem">
        <h2>❌ Error en la autenticación</h2>
        <p>Ocurrió un error. Por favor intente de nuevo.</p>
      </div>
    `;
  }
})();
