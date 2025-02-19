import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { Schedule } from '../../../../core/interfaces/schedule';
import { ScheduleService } from '../../../../shared/services/api/schedules/schedule.service';

@Component({
  selector: 'app-edit-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-schedules.component.html',
})
export class EditSchedulesComponent implements OnChanges{
  showWorkSchedule: boolean = false;
  showException: boolean = false;

  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  selectedStartDay: string  = ""
  selectedEndDay  : string  = ""
  selectStartTime : string  = ""
  selectEndTime   : string  = ""

  @Input() schedulerEdit!: Schedule
  @Output() eventUpdateSchedule = new EventEmitter<void>()

  scheduleService: ScheduleService = inject(ScheduleService)
  notyfyService: NotificationService = inject(NotificationService)

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schedule'] && changes['schedule'].currentValue) {
      console.log(changes['schedule'].currentValue)
      this.selectStartTime = this.schedulerEdit.openingTime?.toISOString()?.split('T')[1] || ""
      this.selectEndTime = this.schedulerEdit.closingTime?.toISOString()?.split('T')[1] || ""
    }
  }

  getFilteredEndDays(): string[] {
    if (this.selectedStartDay === null) return this.daysOfWeek;
    
    const startIndex = this.daysOfWeek.indexOf(this.selectedStartDay);
    return this.daysOfWeek.slice(startIndex);
  }

//   async onCLickSetDasy(){
//     if(!this.selectedStartDay) {
//       return 
//     }
//     if(!this.selectStartTime || !this.selectEndTime){
//       return
//     }

//     if(this.selectStartTime > this.selectEndTime ){
//       return
//     }

//     try {
//       if (this.selectedEndDay) {
//         const indexStart = this.daysOfWeek.indexOf(this.selectedStartDay);
//         const indexEnd = this.daysOfWeek.indexOf(this.selectedEndDay);
//         console.log(indexStart, indexEnd);
      
//         // Obtiene la fecha más próxima que cae en el día seleccionado
//         const currentDate = new Date(); // Fecha actual
//         // const targetDate = this.getNextDayOfWeek(currentDate, indexStart); // Busca el próximo día correcto
      
//         // Combina la fecha correcta con la hora seleccionada
//         const openingDateTime = new Date(currentDate + 'T' + this.selectStartTime);
//         openingDateTime.setHours(+this.selectStartTime.split(':')[0], +this.selectStartTime.split(':')[1]);
      
//         const closingDateTime = new Date(currentDate + 'T' + this.selectEndTime);
//         closingDateTime.setHours(+this.selectEndTime.split(':')[0], +this.selectEndTime.split(':')[1]);

//         if (openingDateTime.getHours() === 0 && openingDateTime.getMinutes() === 0 && openingDateTime.getSeconds() === 0 &&
//     closingDateTime.getHours() === 0 && closingDateTime.getMinutes() === 0 && closingDateTime.getSeconds() === 0) {
//     console.log('Ambos tiempos son 00:00:00');
// }


//         const workDay: Schedule = {
//           dayName: this.selectedStartDay.toLowerCase(),
//           openingTime: openingDateTime,
//           closingTime: closingDateTime,
//           status: 'R'
//         };
      
//         console.log(workDay);
      
    
      
//         // for (let i = indexStart; i < indexEnd + 1; i++){
//         //   const day = this.daysOfWeek[i]
//         //   const workDay: WorkDayFB = {
//         //     dayOfWeek: day,
//         //     open: this.selectStartTime,
//         //     close: this.selectEndTime,
//         //   }

//         //   await this.scheduleService.updateDay(day.toLowerCase(), workDay)
//         //}
//       }else {
//         // const workDay: WorkDayFB = {
//         //   dayOfWeek: this.selectedStartDay,
//         //   open: this.selectStartTime,
//         //   close: this.selectEndTime,
//         // }
//         // await this.scheduleService.updateDay(this.selectedStartDay.toLowerCase(), workDay)
        
//       }
//       this.selectEndTime = ""
//       this.selectStartTime = ""
//       this.selectedEndDay = ""
//       this.selectedStartDay = ""
//       this.notyfyService.notify(`Horario actualizaco`, 'success', 4000)

//       this.eventUpdateSchedule.emit()
//     }catch(e){}
//   }
onClickSetDay() {
  if (!this.selectedStartDay || !this.selectStartTime || !this.selectEndTime) {
    this.handleError('Todos los campos son obligatorios');
    return;
  }

  if (this.selectStartTime > this.selectEndTime) {
    this.handleError('La hora de inicio no puede ser mayor que la de fin');
    return;
  }

  const idDay = this.daysOfWeek.indexOf(this.selectedStartDay) + 1;

  const openingDateTime = this.combineDateTime(this.selectStartTime);
  const closingDateTime = this.combineDateTime(this.selectEndTime);

  const status = this.isMidnight(openingDateTime) && this.isMidnight(closingDateTime) ? 'NW' : 'R';

const workDay: Schedule = {
  idDay,  
  dayName: this.selectedStartDay.toLowerCase(),
  openingTime: openingDateTime,
  closingTime: closingDateTime,
  status, 
};


  console.log('Horario actualizado:', workDay);

  this.scheduleService.updateSchedule(workDay).subscribe(
    () => {
      this.clearForm();
      this.handleSuccess(`Horario actualizado con éxito (ID: ${idDay ?? 'Nuevo'})`);
      this.eventUpdateSchedule.emit(); 
    },
    () => {
      this.handleError('Error al actualizar el horario');
    }
  );
}


private combineDateTime(time: string): Date {
  const now = new Date();
  const dateTime = new Date(now.toISOString().split('T')[0] + 'T' + time);
  dateTime.setHours(+time.split(':')[0], +time.split(':')[1]);
  return dateTime;
}

private isMidnight(date: Date): boolean {
  return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
}

private clearForm(): void {
  this.selectedStartDay = "";
  this.selectedEndDay = "";
  this.selectStartTime = "";
  this.selectEndTime = "";
}



  public validators(): boolean {
    if(this.schedulerEdit) return false
    const today = new Date()
    const todayOnlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const dateFromSchedule = this.schedulerEdit['openingTime  '] as Date
    const dateOnlyCompare = new Date(dateFromSchedule.getFullYear(), dateFromSchedule.getMonth(), dateFromSchedule.getDate())
    return todayOnlyDate.getTime() <= dateOnlyCompare.getTime()
  }


  private handleSuccess(message: string) {
    this.notyfyService.notify(message, 'success', 4000);
    // this.clear();
    // this.initExceptionDays();
  }

  private handleError(message: string) {
    this.notyfyService.notify(message, 'error', 4000);
  }

  getNextDayOfWeek(date: Date, dayOfWeek: number): Date {
    const resultDate = new Date(date);
    resultDate.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7)); // Encuentra el siguiente día correcto
    return resultDate;
  }
  
}
