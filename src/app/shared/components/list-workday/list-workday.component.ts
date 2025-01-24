import { Component, OnInit } from '@angular/core';
import { WorkDayFB } from '../../../core/models/shedule';
import { ScheduleFbService } from '../../services/schedule/schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-workday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-workday.component.html',
})
export class ListWorkdayComponent implements OnInit {
  workDays : WorkDayFB [] = []

  constructor (private scheduler: ScheduleFbService){}

  async ngOnInit(): Promise<void> {
    this.initWorkDayList()
  }

  async initWorkDayList() {
  //   const listDays = await this.scheduler.getListDay()
  //   const weekOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  //   this.workDays = listDays.sort((a, b) => {
  //     return weekOrder.indexOf(a.dayOfWeek) - weekOrder.indexOf(b.dayOfWeek)
  //   });
   }
  
} 
