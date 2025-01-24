import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/daygrid';
import { WorkDayFB } from '../../../core/models/shedule';

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

  @Output() sendDateEvevnt = new EventEmitter<{ star: Date; end: Date }>();

  workDays: WorkDayFB[] = [
    new WorkDayFB(1, 'R', 'lunes', '08:00', '17:00'),
    new WorkDayFB(2, 'R', 'martes', '08:00', '17:00'),
    new WorkDayFB(3, 'R', 'miércoles', '08:00', '17:00'),
    new WorkDayFB(4, 'R', 'jueves', '08:00', '21:00'),
    new WorkDayFB(5, 'R', 'viernes', '08:00', '17:00'),
    new WorkDayFB(6, 'R', 'sábado', '08:00', '12:00'),
    new WorkDayFB(7, 'R', 'domingo', '07:00', '14:00'),
    new WorkDayFB(8, 'E', '', '10:00', '14:00', '2025-01-15'),
    new WorkDayFB(9, 'E', '', '00:00', '00:00', '2025-01-25'),
    new WorkDayFB(11, 'NO', '', '00:00', '00:00', '2025-01-2'),
    new WorkDayFB(13, 'E', '', '06:00', '22:30', '2025-01-31'),
    new WorkDayFB(14, 'E', '', '11:00', '23:59', '2025-01-2'),
    new WorkDayFB(15, 'E', '', '11:00', '23:59', '2025-01-4'),
    new WorkDayFB(16, 'NO', '', '00:00', '00:00', '2025-01-10'),
    new WorkDayFB(17, 'NO', '', '00:00', '00:00', '2025-01-11'),
    new WorkDayFB(18, 'E', '', '00:00', '00:00', '2025-01-12'),
  ];

  ngOnInit(): void {
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
      // customButtons: {
      //   prev: {
      //     click: () => this.handlePrev(),
      //   },
      //   // next: {
      //   //   // click: () => this.handleNext(),
      //   // },

      // },
      eventContent: (arg) => {
        return {
          html: createResponsiveEvent(arg.event.title, arg.event.extendedProps['open'], arg.event.extendedProps['close'], arg.event.backgroundColor),
        };
      },
      eventClick: (info) => {
        this.sendDateEvevnt.emit({
          star: info.event.start!,
          end: info.event.end!,
        });
      },
    };
  }

  handlePrev() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    console.log('hola mundo');
    this.calendarOptions.events = this.generateEventsForMonth(this.currentDate);
  }

  handleNext() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    console.log('hola mundo');
    console.log(this.currentDate);
    this.calendarOptions.events = this.generateEventsForMonth(this.currentDate);
  }

  generateEventsForMonth(currentMonth: Date) {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    const events: any[] = [];
    const occupiedDaysSet = new Set<string>();

    this.workDays.forEach((workDay) => {
      if (workDay.state === 'R') return;
      const eventColor = this.getColorByState(workDay.state);
      const startDate = new Date(workDay.date!);
      startDate.setHours(
        parseInt(workDay.open.split(':')[0]),
        parseInt(workDay.open.split(':')[1]),
        0
      );

      const endDate = new Date(workDay.date!);
      endDate.setHours(
        parseInt(workDay.close.split(':')[0]),
        parseInt(workDay.close.split(':')[1]),
        0
      );

      const eventKey = startDate.toISOString().split('T')[0];
      if (!occupiedDaysSet.has(eventKey)) {
        events.push({
          title: workDay.state === 'E' ? 'EXCEPCIÓN' : 'CERRADO',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          backgroundColor: eventColor,
          extendedProps: { open: workDay.open, close: workDay.close },
        });
        occupiedDaysSet.add(eventKey);
      }
    });

    this.workDays.forEach((workDay) => {
      if (workDay.state === 'R') {
        const eventColor = this.getColorByState(workDay.state);

        for (
          let day = new Date(startOfMonth);
          day <= endOfMonth;
          day.setDate(day.getDate() + 1)
        ) {
          const dayOfWeek = day.toLocaleString('es-ES', { weekday: 'long' });
          const eventKey = day.toISOString().split('T')[0]; // Clave única para el día

          if (
            workDay.dayOfWeek === dayOfWeek &&
            !occupiedDaysSet.has(eventKey)
          ) {
            const startDate = new Date(day);
            startDate.setHours(
              parseInt(workDay.open.split(':')[0]),
              parseInt(workDay.open.split(':')[1]),
              0
            );

            const endDate = new Date(day);
            endDate.setHours(
              parseInt(workDay.close.split(':')[0]),
              parseInt(workDay.close.split(':')[1]),
              0
            );

            events.push({
              title: 'ABIERTO',
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              backgroundColor: eventColor,
              extendedProps: { open: workDay.open, close: workDay.close },
            });
            occupiedDaysSet.add(eventKey);
          }
        }
      }
    });

    return events;
  }

  getColorByState(state: 'R' | 'E' | 'NO'): string {
    return state === 'R' ? '#6EC1E4' : state === 'E' ? '#F2A7D2' : '#FFB28C';
  }
}


const createResponsiveEvent = (
  title: string,
  open: string,
  close: string,
  backgroundColor: string
): string => `
  <div 
    class="responsive-container" 
    style="background-color: ${backgroundColor};"
  >
    <div class="event-content">
      <strong class="event-title">${title}</strong>
      <div class="event-time-container">
        <span class="event-time">Abierto: ${open}</span>
        <span class="event-time">Cerrado: ${close}</span>
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
      gap: 10px;
      width: 100%;
      flex-direction: column; /* Ensures that the time is displayed in column on small screens */
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
        flex-direction: column; /* Keeps the time displayed in column layout on small screens */
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
        flex-direction: row;
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
