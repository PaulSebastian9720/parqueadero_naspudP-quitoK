import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Observable para transmitir notificaciones
  private notificationSubject = new Subject<{ message: string; type: 'success' | 'error' | 'info' | 'warning'; duration: number }>();
  notification$ = this.notificationSubject.asObservable();

  /**
   * Envía una notificación.
   * @param message El mensaje a mostrar.
   * @param type El tipo de notificación (success, error, info, warning).
   * @param duration Tiempo en milisegundos antes de desaparecer.
   */
  notify(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number) {
    this.notificationSubject.next({ message, type, duration });
  }
  
}
