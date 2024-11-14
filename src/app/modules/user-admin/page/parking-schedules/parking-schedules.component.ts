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
  @ViewChild("schedule") schedule! : ListWorkdayComponent

  updateSchedule(){
    this.schedule.initWorkDayList()
  }
  
}
