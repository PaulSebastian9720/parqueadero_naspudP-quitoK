import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkDayFB } from '../../../../core/models/shedule';
import { ScheduleFbService } from '../../../../shared/services/schedule/schedule.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';

@Component({
  selector: 'app-edit-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-schedules.component.html',
})
export class EditSchedulesComponent {

  @Output() eventUpdateSchedule = new EventEmitter<void>()
  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  selectedStartDay: string  = ""
  selectedEndDay  : string  = ""
  selectStartTime : string  = ""
  selectEndTime   : string  = ""

  constructor(
    private scheduleService: ScheduleFbService,
    private notyfyService: NotificationService

  ){}

  getFilteredEndDays(): string[] {
    if (this.selectedStartDay === null) return this.daysOfWeek;
    
    const startIndex = this.daysOfWeek.indexOf(this.selectedStartDay);
    return this.daysOfWeek.slice(startIndex);
  }

  async onCLickSetDay(){
    if(!this.selectedStartDay) {
      return 
    }
    if(!this.selectStartTime || !this.selectEndTime){
      return
    }

    if(this.selectStartTime > this.selectEndTime ){
      return
    }

    try {
      if(this.selectedEndDay){
        const indexStart = this.daysOfWeek.indexOf(this.selectedStartDay)
        const indexEnd = this.daysOfWeek.indexOf(this.selectedEndDay)
        for (let i = indexStart; i < indexEnd + 1; i++){
          const day = this.daysOfWeek[i]
          const workDay: WorkDayFB = {
            dayOfWeek: day,
            open: this.selectStartTime,
            close: this.selectEndTime,
          }

          await this.scheduleService.updateDay(day.toLowerCase(), workDay)
        }
      }else {
        const workDay: WorkDayFB = {
          dayOfWeek: this.selectedStartDay,
          open: this.selectStartTime,
          close: this.selectEndTime,
        }
        await this.scheduleService.updateDay(this.selectedStartDay.toLowerCase(), workDay)
        
      }
      this.selectEndTime = ""
      this.selectStartTime = ""
      this.selectedEndDay = ""
      this.selectedStartDay = ""
      this.notyfyService.notify(`Horario actualizaco}`, 'success', 4000)

      this.eventUpdateSchedule.emit()
    }catch(e){}
  }
}
