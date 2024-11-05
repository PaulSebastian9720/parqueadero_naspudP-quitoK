import { Routes, RouterModule, Route } from '@angular/router';
import { RentSpaceComponent } from './page/rent-space/rent-space.component';
import { PayParkingComponent } from './page/pay-parking/pay-parking.component';
import { ReservationHistorialComponent } from './page/reservation-historial/reservation-historial.component';
import { ViewVehiculesComponent } from './page/view-vehicules/view-vehicules.component';

export default [
 
  {  
      path: "",
      component :ViewVehiculesComponent
    
  },
 
  {  
      path: "pay-parking",
      component : PayParkingComponent

  },
  {  
      path: "reservation-history",
      component : ReservationHistorialComponent

  },
 


] as Routes

