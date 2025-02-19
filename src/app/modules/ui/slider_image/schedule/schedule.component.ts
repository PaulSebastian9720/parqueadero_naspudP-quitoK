import { Component, OnInit } from '@angular/core';
import { ScheduleFbService } from '../../../../shared/services/schedule/schedule.service';
import { WorkDayFB } from '../../../../core/models/shedule';
import { CommonModule, } from '@angular/common';



@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
})


export class ScheduleComponent implements OnInit {
  listWorkDays: WorkDayFB[] = [];
  groupedDays: { days: string[], open: string, close: string }[] = [];

  private dayOrder = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  constructor(private scheduleService: ScheduleFbService) {}

  async ngOnInit(): Promise<void> {
    this.listWorkDays = CANCHE_LIST_DAT
    this.getDayCommon()
  }

  getDayCommon() {
    const grouped = new Map<string, { days: string[], open: string, close: string }>();

    for (const day of this.listWorkDays) {
      const key = `${day.openingTime}-${day.closingTime}`;
      if (!grouped.has(key)) {
        grouped.set(key, { days: [], open: day.openingTime, close: day.closingTime })
      }
      grouped.get(key)!.days.push(day.dayName)
    }

    this.groupedDays = Array.from(grouped.values()).map(group => ({
      ...group,
      days: group.days.sort((a, b) => this.dayOrder.indexOf(a.toLowerCase()) - this.dayOrder.indexOf(b.toLowerCase()))
    }));

    this.groupedDays.sort((a, b) => this.dayOrder.indexOf(a.days[0].toLowerCase()) - this.dayOrder.indexOf(b.days[0].toLowerCase()))
  }
}

const CANCHE_LIST_DAT  = [ 
  new WorkDayFB(1, 'R', 'lunes', '08:00', '17:00'),
  new WorkDayFB(2, 'R', 'martes', '08:00', '17:00'),
  new WorkDayFB(3, 'R', 'miércoles', '08:00', '17:00'),
  new WorkDayFB(4, 'R', 'jueves', '08:00', '21:00'),
  new WorkDayFB(5, 'R', 'viernes', '08:00', '17:00'),
  new WorkDayFB(6, 'R', 'sábado', '08:00', '12:00'),
  new WorkDayFB(7, 'R', 'domingo', '07:00', '14:00'),
]


