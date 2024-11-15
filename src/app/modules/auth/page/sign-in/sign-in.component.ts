import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFbService } from '../../services/auth-fb/auth-fb.service';
import { hasEmailError, isRequired } from '../../utils/validator';
import {  IUserSingIn } from '../../utils/interfaceRegisterFom';
import { ButtonWGoogleComponent } from "../../ui/button-w-google/button-w-google.component";
import {  Router, RouterModule } from '@angular/router';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UserFB } from '../../../../core/models/user';
import { UserCacheService } from '../../../../shared/services/user/user-cache.service';

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
    private authService : AuthFbService,
    private router: Router,
    private userService : UserfbService,
    private currenUserCanche: UserCacheService

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
    try {
        const userCredential = await this.authService.signInWithGoogle()
        if (!userCredential.user) return

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
    } catch (error) {}
  }


  async onSubmit(){
    if (this.registerForm.invalid) return
    const {correo, password} = this.registerForm.value
    if( !correo || !password ) return

    try {
      const credential = await this.authService.signIn({correo,password})
      if(!credential.user) return
      const currentUser = await this.userService.getUser(credential.user.uid)
      this.currenUserCanche.setUser(currentUser as UserFB)
      this.router.navigateByUrl('/')
    }catch(error){}
  }
}
