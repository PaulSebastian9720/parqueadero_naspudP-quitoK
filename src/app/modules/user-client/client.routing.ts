import { Routes} from '@angular/router';

import { AbountUserComponent } from './page/abount-user/abount-user.component';
import { RentSpaceComponent } from './page/rent-space/rent-space.component';

export default [
 
  {  
      path: "",
      component : AbountUserComponent
    
  },
//   {  
//       path: "mail",
//       component : MailComponent

//   },
  {  
      path: "rent-space",
      component : RentSpaceComponent

  },

] as Routes

