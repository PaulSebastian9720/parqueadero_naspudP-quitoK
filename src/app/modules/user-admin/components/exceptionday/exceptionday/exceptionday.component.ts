import { Component, inject, OnInit } from '@angular/core';
import { Schedule } from '../../../../../core/interfaces/schedule';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../../../shared/services/api/schedules/schedule.service';
import { NotificationService } from '../../../../../shared/services/dialog/notificaion.service';

@Component({
  selector: 'app-exceptionday',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exceptionday.component.html',
})
export class ExceptiondayComponent implements OnInit {
  exceptionDay: string = '';
  startTime: string = '';
  endTime: string = '';
  exceptions: Schedule[] = [];
  isEditMode: boolean = false; 
  selectedIdDay: number | undefined; 

  scheduleService: ScheduleService = inject(ScheduleService);
  notificationService: NotificationService = inject(NotificationService);

  ngOnInit(): void {
    this.initExceptionDays();
  }

  editException(index: number) {
    const exception = this.exceptions[index];
    if (
      !exception.openingTime ||
      !exception.closingTime ||
      !exception.exceptionDay
    )
      return;

    this.exceptionDay = this.formatDate(exception.exceptionDay);
    this.startTime = this.formatTime(exception.openingTime);
    this.endTime = this.formatTime(exception.closingTime);
    this.isEditMode = true;
    this.selectedIdDay = exception.idDay;
  }

  saveException() {
    let newException: Schedule;

    const inputExceptionDate = new Date(this.exceptionDay + 'T' + this.startTime);
    inputExceptionDate.setHours(19, 0, 0, 0);
    console.log('Fecha de excepción:', inputExceptionDate);

  const existingException = this.exceptions.find((e) => {
    if (!e.exceptionDay) return false; 
    console.log('Fecha de excepción existente:', e.exceptionDay);
  
    const existingDate = new Date(e.exceptionDay ?? 0); 
    existingDate.setHours(19, 0, 0, 0);
    console.log('Fecha existente:', existingDate);
    
    const xd = existingDate.getTime() === inputExceptionDate.getTime();
    console.log('Comparación de fechas:', xd);
    return xd;
  });

  if (existingException) {
    this.isEditMode = true;
    this.selectedIdDay = existingException.idDay;
  }
  
    if (this.isEditMode && this.selectedIdDay) {
      const exceptionToEdit = this.exceptions.find(
        (e) => e.idDay === this.selectedIdDay
      );
  
      if (exceptionToEdit) {
        newException = {
          ...exceptionToEdit,
          exceptionDay: new Date(this.exceptionDay + 'T' + this.startTime), 
          openingTime: new Date(this.exceptionDay + 'T' + this.startTime),
          closingTime: new Date(this.exceptionDay + 'T' + this.endTime),
          status: 'E',
        };
      } else {
        this.handleError('No se pudo encontrar la excepción para editar');
        return;
      }
    } else {
      newException = {
        dayName: new Date(this.exceptionDay).toLocaleDateString('es-ES', {
          weekday: 'long',
        }),
        exceptionDay: new Date(this.exceptionDay + 'T' + this.startTime), 
        openingTime: new Date(this.exceptionDay + 'T' + this.startTime),
        closingTime: new Date(this.exceptionDay + 'T' + this.endTime),
        status: 'E',
      };
    }
  
    if (this.isEditMode) {
      this.scheduleService.updateSchedule(newException).subscribe(
        (response) => {
          this.handleSuccess('Día editado con éxito');
        },
        (error) => {
          this.handleError('Error al editar el día');
        }
      );
    } else {
      this.scheduleService.insertSchedule(newException).subscribe(
        (response) => {
          this.handleSuccess('Día agregado con éxito');
        },
        (error) => {
          this.handleError('Error al agregar el día');
        }
      );
    }
  }
  

  deleteException(index: number): void {
    const exception = this.exceptions[index];
    if (!exception.idDay) return;

    if (confirm('¿Estás seguro de que quieres eliminar esta excepción?')) {
      this.scheduleService.deleteSchedule(exception.idDay).subscribe(
        (response) => {
          this.handleSuccess('Día eliminado con éxito');
        },
        (error) => {
          this.handleError('Error al eliminar el día');
        }
      );
    }
  }


  initExceptionDays() {
    this.scheduleService.getAllSchedules().subscribe((exceptions) => {
      this.exceptions = exceptions.filter(
        (exception) => exception.status === 'E'
      );
      console.log('Excepciones:', this.exceptions);

      this.exceptions.forEach((exception) => {
        if (
          exception.openingTime &&
          exception.closingTime &&
          exception.exceptionDay
        ) {
          exception.openingTime = new Date(exception.openingTime);
          exception.closingTime = new Date(exception.closingTime);
          exception.exceptionDay = new Date(exception.exceptionDay);
        }
      });

      console.log('Excepciones con fechas convertidas:', this.exceptions);
    });
  }

  clear() {
    this.exceptionDay = '';
    this.startTime = '';
    this.endTime = '';
    this.isEditMode = false;
    this.selectedIdDay = undefined;
  }

  private handleSuccess(message: string) {
    this.notificationService.notify(message, 'success', 4000);
    this.clear();
    this.initExceptionDays();
  }

  private handleError(message: string) {
    this.notificationService.notify(message, 'error', 4000);
  }

  private formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  
}
