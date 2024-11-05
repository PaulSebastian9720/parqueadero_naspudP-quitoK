import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { AuthStateService } from "../../shared/services/user/auth-state.service"
import { map } from "rxjs"
import { UserCacheService } from "../../shared/services/user/user-cache.service"

export const privateGuard  = () : CanActivateFn => {
    return () => {
        const router = inject(Router)
        const authState = inject(AuthStateService)
        return authState.authState$.pipe(
            map(state => {
                if(!state){
                    router.navigateByUrl('/auth/sign-in')
                    return false
                }
                return true
            })
        )
    }
} 

export const publicGuard = () : CanActivateFn => {
    return () => {
        const router = inject(Router)
        const authState = inject(AuthStateService)
        return authState.authState$.pipe(
            map(state => {
                if(state){
                    router.navigateByUrl('/welcoming')
                    return false
                }
                return true
            })
        )
    }
}

export const privateGuardAdmin = (): CanActivateFn => {
    return () => {
        const router = inject(Router)
        const userCache = inject(UserCacheService)

        return userCache.getUser().pipe(
            map(user => {
                if (!user || user.rol !== 'A') {
                    router.navigateByUrl("/")
                    return false
                }

                return true 
            })
        );
    };
};

