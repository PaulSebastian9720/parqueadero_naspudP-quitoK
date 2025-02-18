import { Routes} from '@angular/router';
import { ReservationHistorialComponent } from './page/reservation-historial/reservation-historial.component';
import { MailComponent } from './page/mail/mail.component';
import { AbountUserComponent } from './page/abount-user/abount-user.component';
import { RentSpaceComponent } from './page/rent-space/rent-space.component';

export default [
 
  {  
      path: "",
      component : AbountUserComponent
    
  },
  {  
      path: "mail",
      component : MailComponent

  },
  {  
      path: "rent-space",
      component : RentSpaceComponent

  },

] as Routes

