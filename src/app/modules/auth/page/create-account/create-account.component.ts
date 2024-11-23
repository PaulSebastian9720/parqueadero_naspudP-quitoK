import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFbService } from '../../services/auth-fb/auth-fb.service';
import { IUsernAuth } from '../../utils/interfaceRegisterFom';
import { isRequired, hasEmailError, isNotSamePassword, isShortParameter } from '../../utils/validator';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonWGoogleComponent } from "../../ui/button-w-google/button-w-google.component";
import { Router } from '@angular/router';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UserFB } from '../../../../core/models/user';
import { UserCacheService } from '../../../../shared/services/user/user-cache.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';


@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ButtonWGoogleComponent],
  templateUrl: './create-account.component.html',
})
export class CreateAccountComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private form: FormBuilder, 
    private authService : AuthFbService,
    private router : Router,
    private userService : UserfbService,
    private currenUserCanche : UserCacheService,
    private noficationService : NotificationService
  ) {}


  isRequired(fiel : "name" | "password" | "name" | "last_name" | "correo" |"confirmPassword" ){
    return isRequired(fiel, this.registerForm)
  }

  isEmailRequired(){
    return hasEmailError(this.registerForm)
  }

  isNotSamePassword(){
    return isNotSamePassword(this.registerForm)
  }

  isShortParameter(fiel : "password" | "name" | "last_name" , minLength:  number = 3){
    return isShortParameter(fiel,this.registerForm, minLength)
  }

  ngOnInit(): void {
    this.registerForm = this.form.group<IUsernAuth>({
      name:            this.form.control('', Validators.required),
      last_name:       this.form.control('', Validators.required),
      correo:          this.form.control('', [
        Validators.required,
        Validators.email,
      ]), 
      password:       this.form.control('', Validators.required), 
      confirmPassword: this.form.control('', Validators.required),
      birthday:        this.form.control(null,)
    }, { });
  }


  async onSubmitWithGoogle() {
    try {
        const userCredential = await this.authService.signInWithGoogle()
        if (!userCredential.user) return;

        const user = userCredential.user
        const exists: boolean = await this.userService.userExists(user.uid)
        
        if (!exists) {
            const userData: UserFB = {
                name: user.displayName?.split(" ")[0] || "",
                last_name: user.displayName?.split(" ")[1] || "",
                correo: user.email || "",
                rol: 'C',
                state: true,
                birthDay: null,
                direction: "",
                city: "",
                phone: "",
                correoS: "",
                listAutomobile: [],
                listManagement: [],
            }
            await this.userService.createUserInFirestore(user.uid, userData)
            this.currenUserCanche.setUser(userData)
        } else {
            const currenUser = await this.userService.getUser(user.uid)
            this.currenUserCanche.setUser(currenUser as UserFB)
        }
        
        this.router.navigateByUrl('/');
    } catch (error) {
        console.error("Error during Google sign-in:", error)
    }
}
    
  
  
async onSubmit() {
      if (this.registerForm.invalid){
        this.noficationService.notify("Llene todos los campor nescesarios",'warning',3000)
        return
      };
    
      const { name, last_name, correo, password, confirmPassword, birthDay } = this.registerForm.value;
    
      if (!name || !correo || !password || !confirmPassword || !last_name) return;
    
      if (password !== confirmPassword) return;
    
      if (name.length < 3 || last_name.length < 3 || password.length < 6) return;
    
      try {

        const userCredential = await this.authService.createAccount({ correo, password });

        const user = userCredential.user;
        if (user) {
          const userData : UserFB = {
            name: name,
            last_name: last_name,
            correo: correo,
            rol: 'C', 
            state: true,
            birthDay: birthDay || null,
            direction: "",
            city: "",
            phone: "",
            correoS: "",
            listAutomobile: [],
            listManagement: [],
          } 
          await this.userService.createUserInFirestore(user.uid,userData);
          this.router.navigateByUrl('/auth/sign-in')
        } else {
          this.noficationService.notify('Erroe al crear la cuenta', 'error', 3000);
        }
      } catch (error) {}
  }
    
}
    

