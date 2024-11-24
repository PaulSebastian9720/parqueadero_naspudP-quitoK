import { Component, ViewChild } from '@angular/core';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { EditSchedulesComponent } from "../../components/edit-schedules/edit-schedules.component";
import { ListWorkdayComponent } from "../../../../shared/components/list-workday/list-workday.component";

@Component({
  selector: 'app-parking-schedules',
  standalone: true,
  imports: [HeaderServiceComponent, EditSchedulesComponent, ListWorkdayComponent],
  templateUrl: './parking-schedules.component.html',
})
export class ParkingSchedulesComponent {
  @ViewChild("schedule") schedule!: ListWorkdayComponent;  // Referencia al componente de la lista de horarios

  /**
   * Método para actualizar la lista de horarios.
   * Llama al método 'initWorkDayList' del componente 'schedule' para actualizar la lista de horarios de trabajo.
   */
  updateSchedule() {
    this.schedule.initWorkDayList();  // Actualiza la lista de horarios de trabajo
  }
}

