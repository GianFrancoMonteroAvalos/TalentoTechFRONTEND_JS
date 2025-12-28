/**
 * Archivo de configuración de Email
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo y renómbralo a: email-config.js
 * 2. Completa con tus credenciales de EmailJS o Formspree
 * 3. NO subas email-config.js a Git (agrégala a .gitignore)
 * 
 * Este archivo se carga automáticamente si existe
 */

// Configuración de EmailJS (Recomendado)
window.EMAIL_CONFIG = {
    emailjs: {
        serviceId: 'YOUR_SERVICE_ID',      // Reemplazar con tu Service ID de EmailJS
        templateId: 'YOUR_TEMPLATE_ID',    // Reemplazar con tu Template ID de EmailJS
        publicKey: 'YOUR_PUBLIC_KEY'       // Reemplazar con tu Public Key de EmailJS
    },
    ownerEmail: 'tu-email@gggrowshop.com', // Email donde recibirás los pedidos
    formspree: {
        endpoint: 'https://formspree.io/f/YOUR_FORM_ID' // Solo si usas Formspree como fallback
    }
};

