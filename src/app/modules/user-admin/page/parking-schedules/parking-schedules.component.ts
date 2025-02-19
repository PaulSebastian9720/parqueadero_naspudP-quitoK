import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { EditSchedulesComponent } from '../../components/edit-schedules/edit-schedules.component';
import { ListWorkdayComponent } from '../../../../shared/components/list-workday/list-workday.component';
import { SpotCalenderComponent } from '../../../../shared/components/spot-calender/spot-calender.component';
import { CommonModule } from '@angular/common';
import { Schedule } from '../../../../core/interfaces/schedule';
import { ExceptiondayComponent } from '../../components/exceptionday/exceptionday/exceptionday.component';

@Component({
  selector: 'app-parking-schedules',
  standalone: true,
  imports: [
    EditSchedulesComponent,
    ListWorkdayComponent,
    SpotCalenderComponent,
    CommonModule,
    ExceptiondayComponent,
  ],
  templateUrl: './parking-schedules.component.html',
})
export class ParkingSchedulesComponent {

  
  schedule : Schedule | null = null

  @ViewChild('schedule') listCalendar!: ListWorkdayComponent;
  @ViewChild('calendar') calendar!: SpotCalenderComponent;
  @ViewChild('editSchedule') editSchedule!: EditSchedulesComponent
  @ViewChild('exceptionComponent') exceptionComponent!: ExceptiondayComponent;


  container: 'calendar' | 'table' | 'exception' = 'calendar';

  showFormSchedule = false;
  showFormException = false;

  /**
   * Método para actualizar la lista de horarios.
   * Llama al método 'initWorkDayList' del componente 'schedule' para actualizar la lista de horarios de trabajo.
   */
  updateSchedule() {
    this.listCalendar.initWorkDayList(); 
  }

  toggleContainer(container: 'calendar' | 'table' | 'exception') {  
    this.container = container;
  }

  eventSelectDay( scheduleEvent : Schedule){
    this.schedule = scheduleEvent;
  }
}
