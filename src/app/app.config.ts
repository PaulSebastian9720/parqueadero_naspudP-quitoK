import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AuthInterceptor } from './shared/services/auth/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'p-auto-spot',
        appId: '1:123731332897:web:339785831ead889f983860',
        storageBucket: 'p-auto-spot.firebasestorage.app',
        apiKey: 'AIzaSyCySf1fTgJg_uLm7blUK1Otv-WNezVFLiA',
        authDomain: 'p-auto-spot.firebaseapp.com',
        messagingSenderId: '123731332897',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
