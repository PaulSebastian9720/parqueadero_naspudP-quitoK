import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../services/dialog/notificaion.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {
  message: string = '';
  type: "warning" | "info" | "error"  | "success" =  "success"; 
  visible: boolean = false;
  private notificationSub: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationSub = this.notificationService.notification$.subscribe(notification => {  
      this.message = notification.message;
      this.type = notification.type;
      this.visible = true;
  
      setTimeout(() => {
        this.visible = false;
      }, notification.duration);
    });
  }
  

  ngOnDestroy(): void {
      if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }


  getMessage(): string {
    return this.type === 'warning' ? "Posible Error":
           this.type === 'success' ? "Accion Exitosa": 
           this.type === 'info' ? "Atencion":
           "Error" ;
  }
}

