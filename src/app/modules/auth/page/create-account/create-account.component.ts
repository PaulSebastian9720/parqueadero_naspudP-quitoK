import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthFbService } from '../../services/auth-fb/auth-fb.service';
import { IUsernAuth } from '../../utils/interfaceRegisterFom';
import {
  isRequired,
  hasEmailError,
  isNotSamePassword,
  isShortParameter,
} from '../../utils/validator';
import { CommonModule, formatDate } from '@angular/common';
import { ButtonWGoogleComponent } from '../../ui/button-w-google/button-w-google.component';
import { Router } from '@angular/router';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UserFB } from '../../../../core/models/user';
import { UserCurrentService } from '../../../../shared/services/user/user-cache.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { AuthService } from '../../../../shared/services/auth/auth/auth.service';
import { AuthRequest } from '../../../../core/interfaces/auth/registerRequest';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonWGoogleComponent,
  ],
  templateUrl: './create-account.component.html',
})
export class CreateAccountComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private form: FormBuilder,
    private authService: AuthFbService,
    private router: Router,
    private userService: UserfbService,
    private currenUserCanche: UserCurrentService,
    private noficationService: NotificationService,
    private authMyApuService: AuthService
  ) {}

  isRequired(
    fiel:
      | 'name'
      | 'password'
      | 'name'
      | 'last_name'
      | 'correo'
      | 'confirmPassword'
  ) {
    return isRequired(fiel, this.registerForm);
  }

  isEmailRequired() {
    return hasEmailError(this.registerForm);
  }

  isNotSamePassword() {
    return isNotSamePassword(this.registerForm);
  }

  isShortParameter(
    fiel: 'password' | 'name' | 'last_name',
    minLength: number = 3
  ) {
    return isShortParameter(fiel, this.registerForm, minLength);
  }

  ngOnInit(): void {
    this.registerForm = this.form.group<IUsernAuth>(
      {
        name: this.form.control('', Validators.required),
        last_name: this.form.control('', Validators.required),
        correo: this.form.control('', [Validators.required, Validators.email]),
        password: this.form.control('', Validators.required),
        confirmPassword: this.form.control('', Validators.required),
        birthday: this.form.control(''),
      },
      {}
    );
  }

  async onSubmitWithGoogle() {
    try {
      const userCredential = await this.authService.signInWithGoogle();
      if (!userCredential.user) return;

      const user = userCredential.user;
      const exists: boolean = await this.userService.userExists(user.uid);

      if (!exists) {
        const userData: UserFB = {
          name: user.displayName?.split(' ')[0] || '',
          last_name: user.displayName?.split(' ')[1] || '',
          correo: user.email || '',
          rol: 'C',
          state: true,
          birthDay: new Date(),
          direction: '',
          city: '',
          phone: '',
          correoS: '',
          listAutomobile: [],
          listManagement: [],
        };
        await this.userService.createUserInFirestore(user.uid, userData);
      } else {
        const currenUser = await this.userService.getUser(user.uid);
      }
      this.router.navigateByUrl('/');
      this.noficationService.notify('Bienvenido a Auto Spot', 'success', 4000);
    } catch (error) {
      this.noficationService.notify('Error al ingresar', 'error', 4000);
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const { name, last_name, correo, password, confirmPassword } =
      this.registerForm.value;
    const birthday = this.registerForm.get('birthday')?.value;

    if (!name || !correo || !password || !confirmPassword || !last_name) return;

    if (password !== confirmPassword) return;

    if (name.length < 3 || last_name.length < 3 || password.length < 8) return;

    const authReques: AuthRequest = {
      credentials: {
        mailUser: correo,
        password: password,
      },
      user: {
        name: name,
        lastName: last_name,
        birthDay: birthday,
      },
    };
    this.authMyApuService.signUp(authReques).subscribe(
      (response) => {
        if (response) {
          
          this.authMyApuService.setToken(response.jwt);
          this.noficationService.notify(
            'Cuenta creada con éxito',
            'success',
            4000
          );
          this.currenUserCanche.setUser(response.user);
          this.router.navigate(['/']);
        }
      },
      (error) => {
        console.log(error);
        this.noficationService.notify(error.error, 'error', 4000);
      }
    );
  }
}
