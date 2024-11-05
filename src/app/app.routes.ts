import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/page/home/home.component';
import { privateGuard, privateGuardAdmin, publicGuard } from './core/auth/auth-guard';
import { WelcomingComponent } from './shared/page/welcoming/welcoming.component';
import { NotFoudComponent } from './shared/page/not-foud/not-foud.component';
import { ProfileComponent } from './shared/page/profile/profile.component';


export const routes: Routes = [
    {
        path: "",
        component : HomeComponent
    },
    {
        canActivate: [privateGuard()],
        path: "profile",
        component: ProfileComponent
    },
    
    {
        canActivate: [privateGuard()],
        path: "welcoming",
        component : WelcomingComponent
    },

    {
        canActivateChild : [publicGuard()],
        path: "auth",
        loadChildren : () => import('./modules/auth/auth.routing')

    },
    {
        canActivateChild : [privateGuard()],
        path: "services-client",
        loadChildren : () => import('./modules/user-client/client.routing')

    },
    {
        canActivateChild : [privateGuardAdmin(),],
        path: "services-admin",
        loadChildren : () => import('./modules/user-admin/admin.routing')
    },
    {
        path: '**',
        component : NotFoudComponent
    },
    
];