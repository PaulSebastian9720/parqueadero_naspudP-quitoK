import { Routes, RouterModule, Route } from '@angular/router';
import { RentSpaceComponent } from './page/rent-space/rent-space.component';
import { PayParkingComponent } from './page/pay-parking/pay-parking.component';
import { ReservationHistorialComponent } from './page/reservation-historial/reservation-historial.component';
import { MailComponent } from './page/mail/mail.component';
import { AbountUserComponent } from './page/abount-user/abount-user.component';

export default [
 
  {  
      path: "",
      component : AbountUserComponent
    
  },
  {  
      path: "reservation-history",
      component : ReservationHistorialComponent

  },

  {  
      path: "mail",
      component : MailComponent

  },
  {  
      path: "pay-parking",
      component : PayParkingComponent

  },
  {  
      path: "rent-space",
      component : RentSpaceComponent

  },

] as Routes

