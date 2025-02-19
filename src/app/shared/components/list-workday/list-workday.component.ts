import { Component, inject, OnInit } from '@angular/core';
import { Schedule } from '../../../core/interfaces/schedule';
import { ScheduleService } from '../../services/api/schedules/schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-workday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-workday.component.html',
})
export class ListWorkdayComponent implements OnInit {

  

  workDays: Schedule[] = [];
  private schedulerService = inject(ScheduleService);

  ngOnInit() {
    this.initWorkDayList();
  }

  initWorkDayList() {
    this.schedulerService.getAllSchedules().subscribe({
      next: (schedules: Schedule[]) => {
        this.workDays = schedules.map(schedule => ({
          ...schedule,
          openingTime: schedule.openingTime ? new Date(schedule.openingTime) : undefined,
          closingTime: schedule.closingTime ? new Date(schedule.closingTime) : undefined,
        }));

        console.log("workdays",this.workDays);

        this.applyExceptions();
        this.sortWorkDaysByName();
      },
      error: (err) => console.error('Error al obtener los horarios:', err),
    });
  }

  applyExceptions() {
    const horariosRegulares = this.workDays.filter(h => h.status === 'R' || h.status === 'NW');
    console.log("hoRegu",horariosRegulares);
    const excepciones = this.workDays.filter(h => h.status === 'E' && h.openingTime && h.closingTime);
    console.log("excep",excepciones);

    const inicioSemana = new Date();
    inicioSemana.setDate(inicioSemana.getDate() - ((inicioSemana.getDay() + 6) % 7));
    inicioSemana.setHours(0, 0, 0, 0);

    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);

    excepciones.forEach(excepcion => {
      if (!excepcion.openingTime || !excepcion.closingTime) return;

      if (
        excepcion.openingTime.getTime() >= inicioSemana.getTime() &&
        excepcion.openingTime.getTime() <= finSemana.getTime()
      ) {
        console.log("entro aqui?")
        const index = horariosRegulares.findIndex(h => h.dayName === excepcion.dayName);
        console.log("index",index);

        if (index !== -1) {
          this.workDays[index].openingTime = excepcion.openingTime;
          this.workDays[index].closingTime = excepcion.closingTime;
        }
      }
    });

    console.log("workdays sin Filtrar",this.workDays);


    this.workDays = this.workDays.filter(h =>
      h.status !== 'E' || (h.openingTime && h.openingTime.getTime() >= inicioSemana.getTime() && h.openingTime.getTime() <= finSemana.getTime())
    );





    console.log("workdays Filtrado",this.workDays);
  }

  sortWorkDaysByName() {
    const diasDeLaSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  
    // Eliminar duplicados y ordenar por el índice de días en la semana
    this.workDays = this.workDays
      .filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.dayName && t.dayName.toLowerCase().trim() === value.dayName?.toLowerCase().trim()
        ))
      )
      .sort((a, b) => {
        const indiceA = a.dayName ? diasDeLaSemana.indexOf(a.dayName.toLowerCase().trim()) : -1;
        const indiceB = b.dayName ? diasDeLaSemana.indexOf(b.dayName.toLowerCase().trim()) : -1;
        return indiceA - indiceB;
      });
  
    // Limitar solo a los 7 primeros días
    this.workDays = this.workDays.slice(0, 7);
  }
  
  

  
  isClosed(openingTime: Date | string | undefined, closingTime: Date | string | undefined): boolean {
  if (!openingTime || !closingTime) return false;

  const opening = new Date(openingTime).getHours() === 0 && new Date(openingTime).getMinutes() === 0;
  const closing = new Date(closingTime).getHours() === 0 && new Date(closingTime).getMinutes() === 0;
  
  return opening && closing;
}

  
}
