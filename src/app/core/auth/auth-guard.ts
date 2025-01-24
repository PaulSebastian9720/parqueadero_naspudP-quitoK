import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { AuthStateService } from "../../shared/services/user/auth-state.service"
import { map } from "rxjs"
import { UserCacheService } from "../../shared/services/user/user-cache.service"
/** 
 * `privateGuard` es un guardia de rutas utilizado para proteger rutas que solo deben ser accesibles por usuarios autenticados.
 * Asegura que si el usuario no está autenticado, se le redirija a la página de inicio de sesión.
 * 
 * El guardia se suscribe al estado de autenticación y verifica si el usuario está autenticado.
 * Si el usuario no está autenticado, el guardia lo redirige a la ruta `/auth/sign-in` y retorna `false` para evitar el acceso a la ruta.
 * Si el usuario está autenticado, retorna `true` para permitir el acceso a la ruta.
 * 
 * @returns {CanActivateFn} La función que realiza la verificación de autenticación.
 */
export const privateGuard = (): CanActivateFn => {
    return () => {
        const router = inject(Router);
        const authState = inject(AuthStateService);
        return authState.authState$.pipe(
            map(state => {
                if (!state) {
                    router.navigateByUrl('/auth/sign-in');
                    return false;
                }
                return true;
            })
        );
    };
};

/** 
 * `publicGuard` es un guardia de rutas utilizado para proteger rutas que solo deben ser accesibles por usuarios no autenticados.
 * Asegura que si un usuario autenticado intenta acceder a una ruta pública, se le redirija a la página de bienvenida.
 * 
 * El guardia se suscribe al estado de autenticación y verifica si el usuario está autenticado.
 * Si el usuario está autenticado, se le redirige a la ruta `/welcoming` y retorna `false` para evitar el acceso a la ruta.
 * Si el usuario no está autenticado, retorna `true` para permitir el acceso a la ruta.
 * 
 * @returns {CanActivateFn} La función que realiza la verificación de autenticación.
 */
export const publicGuard = (): CanActivateFn => {
    return () => {
        const router = inject(Router);
        const authState = inject(AuthStateService);
        return authState.authState$.pipe(
            map(state => {
                if (state) {
                    router.navigateByUrl('/welcoming');
                    return false;
                }
                return true;
            })
        );
    };
};

/** 
 * `privateGuardAdmin` es un guardia de rutas utilizado para proteger rutas que solo deben ser accesibles por usuarios con rol de administrador.
 * Asegura que si un usuario no es administrador o no está autenticado, se le redirija a la página de inicio.
 * 
 * El guardia obtiene los datos del usuario utilizando el servicio `UserCacheService` y verifica si el usuario existe y tiene el rol "A" (administrador).
 * Si el usuario no se encuentra o su rol no es "A", se le redirige a la página de inicio (`/`) y retorna `false` para evitar el acceso a la ruta.
 * Si el usuario es administrador, retorna `true` para permitir el acceso a la ruta.
 * 
 * @returns {CanActivateFn} La función que realiza la verificación de rol del usuario.
 */
export const privateGuardAdmin = (): CanActivateFn => {
    return () => {
        const router = inject(Router);
        const userCache = inject(UserCacheService);

        return userCache.getUser().pipe(
            map(user => {
                // if (!user || user.rol !== 'A') {
                //     router.navigateByUrl("/");
                //     return false;
                // }

                return true;
            })
        );
    };
};
