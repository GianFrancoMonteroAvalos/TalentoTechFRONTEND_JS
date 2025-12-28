/**
 * Servicio para gestionar autenticación y roles
 * Maneja login, logout y verificación de permisos
 */
class AuthService {
    constructor() {
        this.storageKey = 'auth_user';
        this.currentUser = this.loadUser();
    }

    /**
     * Carga el usuario desde localStorage
     * @returns {Object|null} Usuario actual o null
     */
    loadUser() {
        try {
            const userData = localStorage.getItem(this.storageKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            return null;
        }
    }

    /**
     * Guarda el usuario en localStorage
     * @param {Object} user - Datos del usuario
     */
    saveUser(user) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(user));
            this.currentUser = user;
        } catch (error) {
            console.error('Error al guardar usuario:', error);
        }
    }

    /**
     * Inicia sesión
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Object} {success: boolean, user: Object|null, message: string}
     */
    login(email, password) {
        // Usuarios predefinidos (en producción esto vendría de un backend)
        const users = {
            'admin@gggrowshop.com': {
                id: 1,
                email: 'admin@gggrowshop.com',
                password: 'admin123', // En producción esto debería estar hasheado
                name: 'Administrador',
                role: 'admin'
            },
            'comprador@gggrowshop.com': {
                id: 2,
                email: 'comprador@gggrowshop.com',
                password: 'comprador123',
                name: 'Comprador',
                role: 'comprador'
            }
        };

        const user = users[email];

        if (!user) {
            return {
                success: false,
                user: null,
                message: 'Usuario no encontrado'
            };
        }

        if (user.password !== password) {
            return {
                success: false,
                user: null,
                message: 'Contraseña incorrecta'
            };
        }

        // Eliminar password antes de guardar
        const { password: _, ...userWithoutPassword } = user;
        this.saveUser(userWithoutPassword);

        return {
            success: true,
            user: userWithoutPassword,
            message: 'Inicio de sesión exitoso'
        };
    }

    /**
     * Cierra sesión
     */
    logout() {
        localStorage.removeItem(this.storageKey);
        this.currentUser = null;
    }

    /**
     * Obtiene el usuario actual
     * @returns {Object|null} Usuario actual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} role - Rol a verificar ('admin' o 'comprador')
     * @returns {boolean}
     */
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    /**
     * Verifica si el usuario es administrador
     * @returns {boolean}
     */
    isAdmin() {
        return this.hasRole('admin');
    }

    /**
     * Verifica si el usuario es comprador
     * @returns {boolean}
     */
    isComprador() {
        return this.hasRole('comprador');
    }

    /**
     * Requiere autenticación - redirige si no está autenticado
     * @param {string} redirectUrl - URL a la que redirigir
     */
    requireAuth(redirectUrl = 'login.html') {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    /**
     * Requiere un rol específico - redirige si no tiene el rol
     * @param {string} role - Rol requerido
     * @param {string} redirectUrl - URL a la que redirigir
     */
    requireRole(role, redirectUrl = 'index.html') {
        if (!this.hasRole(role)) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}

