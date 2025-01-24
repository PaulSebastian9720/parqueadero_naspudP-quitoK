import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/page/home/home.component';
import { privateGuard, privateGuardAdmin, publicGuard } from './core/auth/auth-guard';
import { WelcomingComponent } from './shared/page/welcoming/welcoming.component';
import { NotFoudComponent } from './shared/page/not-foud/not-foud.component';
import { ProfileComponent } from './shared/page/profile/profile.component';
import { ContactUsComponent } from './shared/section/contact-us/contact-us.component';


/**
 * Configuración de rutas para la aplicación.
 *
 * @constant routes
 *
 * Esta constante define las rutas y sus respectivas configuraciones, incluidas las rutas protegidas por guardias,
 * las rutas de carga diferida y las rutas con componentes específicos.
 */
export const routes: Routes = [
    /**
     * Ruta raíz de la aplicación. Carga el componente HomeComponent.
     *
     * @path "" - Ruta raíz
     * @component HomeComponent - Componente principal de la página de inicio
     */
    {
        path: "",
        component : HomeComponent
    },

    /**
     * Ruta de perfil. Solo accesible para usuarios autenticados.
     * Usa un guardia de activación (`canActivate`) para asegurar que el usuario esté autenticado.
     *
     * @path "profile" - Ruta de perfil
     * @component ProfileComponent - Componente de perfil de usuario
     * @canActivate privateGuard() - Guardia de activación que asegura que solo los usuarios autenticados accedan a esta ruta
     */
    {
        canActivate: [privateGuard()],
        path: "profile",
        component: ProfileComponent
    },

    /**
     * Ruta de bienvenida. Solo accesible para usuarios autenticados.
     * Usa un guardia de activación (`canActivate`) para asegurar que el usuario esté autenticado.
     *
     * @path "welcoming" - Ruta de bienvenida
     * @component WelcomingComponent - Componente de bienvenida
     * @canActivate privateGuard() - Guardia de activación que asegura que solo los usuarios autenticados accedan a esta ruta
     */
    {
        canActivate: [privateGuard()],
        path: "welcoming",
        component : WelcomingComponent
    },

    /**
     * Ruta para el módulo de autenticación. Se carga de manera diferida (lazy loading) y solo es accesible para rutas públicas.
     *
     * @path "auth" - Ruta de autenticación
     * @canActivateChild publicGuard() - Guardia de activación de rutas hijas públicas
     * @loadChildren - Carga el módulo de autenticación de manera diferida
     */
    {
        canActivateChild : [publicGuard()],
        path: "auth",
        loadChildren : () => import('./modules/auth/auth.routing')
    },

    /**
     * Ruta para el módulo de servicios para clientes. Solo accesible para usuarios autenticados.
     * Carga el módulo de manera diferida (lazy loading).
     *
     * @path "services-client" - Ruta de servicios para el cliente
     * @canActivateChild privateGuard() - Guardia de activación de rutas hijas para usuarios autenticados
     * @loadChildren - Carga el módulo de servicios para clientes de manera diferida
     */
    {
        canActivateChild : [privateGuard()],
        path: "services-client",
        loadChildren : () => import('./modules/user-client/client.routing')
    },

    /**
     * Ruta para el módulo de servicios para administradores. Solo accesible para usuarios administradores autenticados.
     * Carga el módulo de manera diferida (lazy loading).
     *
     * @path "services-admin" - Ruta de servicios para administradores
     * @canActivateChild privateGuardAdmin() - Guardia de activación de rutas hijas para administradores autenticados
     * @loadChildren - Carga el módulo de servicios para administradores de manera diferida
     */
    {
        canActivateChild : [privateGuardAdmin()],
        path: "services-admin",
        loadChildren : () => import('./modules/user-admin/admin.routing')
    },

    /**
     * Ruta de contacto. Accesible de manera pública.
     *
     * @path "contact-us" - Ruta de contacto
     * @component ContactUsComponent - Componente para la página de contacto
     */
    {
        path: "contact-us",
        component : ContactUsComponent
    },

    /**
     * Ruta comodín para manejar rutas no encontradas.
     *
     * @path '**' - Ruta comodín para manejar rutas no definidas
     * @component NotFoudComponent - Componente que se muestra cuando la ruta no existe
     */
    {
        path: '**',
        component : NotFoudComponent
    },

];
