import { Routes} from '@angular/router';
import { CreateAccountComponent } from './page/create-account/create-account.component';
import { SignInComponent } from './page/sign-in/sign-in.component';

export default [
  {  
      path: "sign-in",
      component : SignInComponent
    
  },
  {  
      path: "create-account",
      component : CreateAccountComponent
    
  },

] as Routes

