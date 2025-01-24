import { Component, ViewChild } from '@angular/core';
import { EditSchedulesComponent } from '../../components/edit-schedules/edit-schedules.component';
import { ListWorkdayComponent } from '../../../../shared/components/list-workday/list-workday.component';
import { SpotCalenderComponent } from '../../../../shared/components/spot-calender/spot-calender.component';
import { CommonModule } from '@angular/common';
import { WorkDayFB } from '../../../../core/models/shedule';

@Component({
  selector: 'app-parking-schedules',
  standalone: true,
  imports: [
    EditSchedulesComponent,
    ListWorkdayComponent,
    SpotCalenderComponent,
    CommonModule,
  ],
  templateUrl: './parking-schedules.component.html',
})
export class ParkingSchedulesComponent {
  
  workDayAux: WorkDayFB = new WorkDayFB(
    1,
    'NO',
    '',
    '00:00',
    '00:00',
    '0000-00-00'
  )

  @ViewChild('schedule') schedule!: ListWorkdayComponent;
  @ViewChild('calendar') calendar!: SpotCalenderComponent;

  container: 'calendar' | 'table' = 'calendar';

  showFormSchedule = false;

  /**
   * Método para actualizar la lista de horarios.
   * Llama al método 'initWorkDayList' del componente 'schedule' para actualizar la lista de horarios de trabajo.
   */
  updateSchedule() {
    this.schedule.initWorkDayList(); // Actualiza la lista de horarios de trabajo
  }

  toggleContainer(container: 'calendar' | 'table') {
    this.container = container;
  }


  toggleShowFormSchedule() {
    this.showFormSchedule = !this.showFormSchedule;
  }


  eventSelectDay( dayOFCalendar: { star :Date , end: Date }){
    
    const starDay = `${dayOFCalendar.star.getHours().toString().padStart(2, '0')}:${dayOFCalendar.star.getMinutes().toString().padStart(2, '0')}`;
    
    const endDay = `${dayOFCalendar.end.getHours().toString().padStart(2, '0')}:${dayOFCalendar.end.getMinutes().toString().padStart(2, '0')}`;
    
    const startDateFormatted = `${dayOFCalendar.star.getFullYear()}-${(dayOFCalendar.star.getMonth() + 1).toString().padStart(2, '0')}-${dayOFCalendar.star.getDate().toString().padStart(2, '0')}`;
    
    const endDateFormatted = `${dayOFCalendar.end.getFullYear()}-${(dayOFCalendar.end.getMonth() + 1).toString().padStart(2, '0')}-${dayOFCalendar.end.getDate().toString().padStart(2, '0')}`;

    this.workDayAux.dayOfWeek = dayOFCalendar.star.toLocaleDateString('es-ES', { weekday: 'long' });
    this.workDayAux.open = starDay;
    this.workDayAux.close = endDay;
    this.workDayAux.date = startDateFormatted;

    this.toggleShowFormSchedule();
  }
  
}
