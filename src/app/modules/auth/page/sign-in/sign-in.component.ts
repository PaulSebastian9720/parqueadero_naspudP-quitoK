import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { hasEmailError, isRequired } from '../../utils/validator';
import {  IUserSingIn } from '../../utils/interfaceRegisterFom';
import { ButtonWGoogleComponent } from "../../ui/button-w-google/button-w-google.component";
import {  Router, RouterModule } from '@angular/router';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UserFB } from '../../../../core/models/user';
import { UserCurrentService } from '../../../../shared/services/user/user-cache.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { AuthService } from '../../../../shared/services/auth/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, ButtonWGoogleComponent, RouterModule],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit{
  registerForm!: FormGroup;

  constructor(
    private form : FormBuilder,
    private router: Router,
    private userService : UserfbService,
    private currenUserCanche: UserCurrentService,
    private notificationService: NotificationService,
    private authService: AuthService
  ){}

  isRequired(fiel : "password" | "correo"  ){
    return isRequired(fiel, this.registerForm)
  }

  isEmailRequired(){
    return hasEmailError(this.registerForm)
  }
  
  ngOnInit(): void {
    this.registerForm = this.form.group<IUserSingIn>({
      correo: this.form.control('', [
        Validators.required,
        Validators.email,
      ]), 
      password: this.form.control('', Validators.required), 
    }, { });
  }
  
  async onSubmitWithGoogle() {
    // try {
    //     const userCredential = await this.authService.signInWithGoogle()
    //     if (!userCredential.user) return

    //     const user = userCredential.user
    //     const exists: boolean = await this.userService.userExists(user.uid)
        
    //     if (!exists) {
    //         const userData: UserFB = {
    //             name: user.displayName?.split(" ")[0] || "",
    //             last_name: user.displayName?.split(" ")[1] || "",
    //             correo: user.email || "",
    //             rol: 'C',
    //             state: true,
    //             birthDay: "",
    //             direction: "",
    //             city: "",
    //             phone: "",
    //             correoS: "",
    //             listAutomobile: [],
    //             listManagement: [],
    //         }
    //         await this.userService.createUserInFirestore(user.uid, userData)
    //     } else {
    //         const currenUser = await this.userService.getUser(user.uid)
    //     }
    //     this.notificationService.notify("Ingreso correctamente", 'success', 3000);
    //     this.router.navigateByUrl('/');
    // } catch (error) {}
  }


  onSubmit(){
    if (this.registerForm.invalid){
      this.notificationService.notify("Ingrese todos los datos", 'warning', 3000);
      return
    }

    const {correo, password} = this.registerForm.value
    
    const credentials =  {
      credentials : {
        mailUser: correo,
        password: password,
      }
    }
    this.authService.signIn(credentials).subscribe(data => {
      if(data){
        this.authService.setToken(data.jwt)
        this.currenUserCanche.setUser(data.user)
        this.notificationService.notify(`Ingreso correctamente\nBienvenido de nuevo ${data.user.name || "Usuario"}`, 'success', 3000)
        this.router.navigate(['/'])
      }
    },(error) => {
      this.notificationService.notify(error.error, 'error', 3000)
      console.error(error.error)
    })
    
  }
}
