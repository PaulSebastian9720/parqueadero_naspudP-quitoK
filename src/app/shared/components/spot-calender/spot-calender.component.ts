import { Component, EventEmitter, inject, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Schedule } from '../../../core/interfaces/schedule';
import { ScheduleService } from '../../services/api/schedules/schedule.service';

@Component({
  selector: 'app-spot-calender',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './spot-calender.component.html',

  styleUrl: './spot-calender.component.scss',
})
export class SpotCalenderComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  currentDate!: Date;

  private scheduleService = inject(ScheduleService);

  @Output() sendDateEvevnt = new EventEmitter<Schedule>();

  workDays: Schedule[] = [];

  ngOnInit(): void {
    this.workDays = this.getSchedule();
    this.currentDate = new Date();

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      events: this.generateEventsForMonth(this.currentDate),
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth',
      },
      plugins: [dayGridPlugin, interactionPlugin],
      eventContent: (arg) => {
        return {
          html: createResponsiveEvent(arg.event.title, arg.event.extendedProps['open'], arg.event.extendedProps['close'], arg.event.backgroundColor),
        };
      },
      eventClick: (info) => {
        
        const openingTime = new Date(info.event.start!)
        const closingTime = new Date(info.event.end!)
        const status : 'R' | 'E' | 'NW' = info.event.title === 'CERRADO' ? 'NW' : info.event.title ===   'EXCEPCIÓN' ? 'E' : 'R'
        const scheduleEvent : Schedule  =  {
          status: status ,
          openingTime: openingTime,
          closingTime: closingTime,
        }
        this.sendDateEvevnt.emit(scheduleEvent);
      },
    };
  }


  getSchedule(): Schedule[] {
    let schedulesList: Schedule[] = [];  
  
    this.scheduleService.getAllSchedules().subscribe({
      next: (schedules: Schedule[]) => {
        this.workDays = schedules;
        this.workDays.forEach((schedule: any) => {
          if (schedule.openingTime) {
            schedule.openingTime = new Date(schedule.openingTime); 
          }
          if (schedule.closingTime) {
            schedule.closingTime = new Date(schedule.closingTime); 
          }
        });
        schedulesList = this.workDays;  
        this.updateCalendar();  
      },
      error: (error) => {
        console.error('Error al obtener los horarios:', error);
      },
    });
  
    return schedulesList;  
  }
  
  generateEventsForMonth(currentMonth: Date) {
    console.log(this.workDays);
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() -1,
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 2,
      0
    );

    const events: any[] = [];
    const occupiedDaysSet = new Set<string>();

    this.workDays.forEach((workDay) => {
      if (workDay.status === 'R') return;
      if (workDay.status === 'NW' && workDay.exceptionDay === null) return;

      
      console.log('workDayException', workDay);
      const eventColor = this.getColorByState(workDay.status);

      const startDate = new Date(workDay.openingTime!);
      const endDate = new Date(workDay.closingTime!);

      console.log('startDate', startDate);
      console.log('endDate', endDate);
      if (!startDate.getTime() || !endDate.getTime()) {
        console.error('Error: las fechas no son válidas', workDay);
        return; 
      }

      const eventKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;

      console.log('eventKey', eventKey);
      if (!occupiedDaysSet.has(eventKey)) {
        events.push({
          title: workDay.status === 'E' ? 'FESTIVO' : 'CERRADO',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          backgroundColor: eventColor,
          extendedProps: { open: workDay.openingTime, close: workDay.closingTime },
        });
        occupiedDaysSet.add(eventKey);
        console.log('eventKey', eventKey);
      }
    });

    this.workDays.forEach((workDay) => {

      if (workDay.status === 'R' || (workDay.status === 'NW' && workDay.exceptionDay === null)) {
        const eventColor = this.getColorByState(workDay.status);
        for (
          let day = new Date(startOfMonth);
          day <= endOfMonth;
          day.setDate(day.getDate() + 1)
        ) {
          const dayOfWeek = day.toLocaleString('es-ES', { weekday: 'long' });
          const eventKey = day.toISOString().split('T')[0]; 

          if (
            workDay.dayName?.trim() === dayOfWeek &&
            !occupiedDaysSet.has(eventKey)
          ) {

            const startDate = new Date(day);
            if (workDay.openingTime) {
              const hours = workDay.openingTime.getHours();
              const minutes = workDay.openingTime.getMinutes();
              startDate.setHours(hours);
              startDate.setMinutes(minutes);
          
            }
            

            const endDate = new Date(day);
            endDate.setHours(
              workDay.openingTime?.getHours() ?? 0,  
              workDay.openingTime?.getMinutes() ?? 0  
            );
            

            events.push({
              title: workDay.status === 'R' ? 'ABIERTO' : 'CERRADO',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              backgroundColor: eventColor,
              extendedProps: { open: workDay.openingTime, close: workDay.closingTime },
            });
            occupiedDaysSet.add(eventKey);
          }
        }
      }
    });

    return events;
  }

  getColorByState(state: 'R' | 'E' | 'NW'): string {
    return state === 'R' ? '#6EC1E4' : state === 'E' ? '#F2A7D2' : '#FFB28C';
  }

  updateCalendar(): void {
    this.calendarOptions.events = this.generateEventsForMonth(this.currentDate);
  }
}


const createResponsiveEvent = (
  title: string,
  open: Date,
  close: Date,
  backgroundColor: string
): string => {
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return `
  <div 
    class="responsive-container" 
    style="background-color: ${backgroundColor};"
  >
    <div class="event-content">
      <strong class="event-title">${title}</strong>
      <div class="event-time-container">
        <span class="event-time">${formatTime(open)} - ${formatTime(close)}</span>
      </div>
      <i class="fa fa-calendar event-icon" aria-hidden="true"></i>
    </div>
  </div>

  <style>
    .responsive-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      height: 100%;
      padding: 15px;
      text-align: center;
      background-color: var(--background-color, #000000);
      box-sizing: border-box;
      border-radius: 8px;
      overflow: hidden;
    }

    .event-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      overflow: auto;
      width: 100%;
    }

    .event-title {
      font-size: 1rem;
      font-weight: bold;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .event-time-container {
      display: flex;
      justify-content: center;
      gap: 2px;
      width: 100%;
      flex-direction: column;
    }

    .event-time {
      font-size: 0.85rem;
      margin: 0;
      font-weight: 500;
      background: rgba(0, 0, 0, 0.2);
      padding: 5px;
      border-radius: 5px;
    }

    .event-icon {
      display: none;
      font-size: 1.5rem;
      margin-top: 10px;
    }

    @media (max-width: 576px) {
      .responsive-container {
        padding: 10px;
      }

      .event-title {
        font-size: 0.6rem;
      }

      .event-time {
        font-size: 0.5rem;
      }

      .event-icon {
        display: none;
      }

      .event-time-container {
        flex-direction: column;
        align-items: center;
      }
    }

    @media (min-width: 768px) {
      .event-title {
        font-size: 0.8rem;
      }

      .event-time {
        font-size: 0.6rem;
      }

      .event-icon {
        display: block;
      }

      .event-time-container {
        flex-direction: column;
        justify-content: space-between;
      }
    }

    @media (min-width: 1024px) {
      .event-title {
        font-size: 1rem;
      }

      .event-time {
        font-size: 0.8rem;
      }

      .event-icon {
        font-size: 1.5rem;
      }
    }
  </style>
`;
};
