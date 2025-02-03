import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { EditSchedulesComponent } from '../../components/edit-schedules/edit-schedules.component';
import { ListWorkdayComponent } from '../../../../shared/components/list-workday/list-workday.component';
import { SpotCalenderComponent } from '../../../../shared/components/spot-calender/spot-calender.component';
import { CommonModule } from '@angular/common';
import { WorkDayFB } from '../../../../core/models/shedule';
import { Schedule } from '../../../../core/interfaces/schedule';

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

  
  schedule : Schedule | null = null

  @ViewChild('schedule') listCalendar!: ListWorkdayComponent;
  @ViewChild('calendar') calendar!: SpotCalenderComponent;

  container: 'calendar' | 'table' = 'calendar';

  showFormSchedule = false;

  /**
   * Método para actualizar la lista de horarios.
   * Llama al método 'initWorkDayList' del componente 'schedule' para actualizar la lista de horarios de trabajo.
   */
  updateSchedule() {
    this.listCalendar.initWorkDayList(); // Actualiza la lista de horarios de trabajo
  }

  toggleContainer(container: 'calendar' | 'table') {
    this.container = container;
  }


  toggleShowFormSchedule() {
    this.showFormSchedule = !this.showFormSchedule;
  }


  eventSelectDay( scheduleEvent : Schedule){
    this.schedule = scheduleEvent;
  }
}
