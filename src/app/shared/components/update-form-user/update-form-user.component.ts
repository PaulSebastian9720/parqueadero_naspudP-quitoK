import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { isShortParameter, isRequired, isNumberPhone } from '../../../modules/auth/utils/validator';
import { UserfbService } from '../../services/user/userfb.service';
import { CommonModule } from '@angular/common';
import { UserData, UserFB } from '../../../core/models/user';
import { NotificationService } from '../../services/dialog/notificaion.service';



@Component({
  selector: 'app-update-form-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-form-user.component.html',
})


export class UpdateFormUserComponent implements OnInit, OnChanges {
  registerForm!: FormGroup;

  @Input() userData !: UserData
  @Input()   isEditing = false
  @Output() updateTable =  new EventEmitter<void>()

  constructor(
    private form: FormBuilder, 
    private userService : UserfbService,
    private notiticationService : NotificationService
  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    if(!this.registerForm) return
    if (changes['userData'] && changes['userData'].currentValue) {
      this.uploadForm()
    }
    if(changes['isEditing']){
      this.uploadForm()
    }
  }
  
  ngOnInit(): void {
    this.registerForm = this.form.group({
      name:            this.form.control('', Validators.required),
      last_name:       this.form.control('', Validators.required),
      correo:          this.form.control('', [
        Validators.required,
        Validators.email,
      ]), 
      correoS:          this.form.control('', [
        Validators.email,
      ]), 
      direction:       this.form.control(''), 
      city:       this.form.control('',),
      phone:       this.form.control('',),
      birthday: this.form.control(new Date())
 
    }, { });
    if(this.userData){

      this.uploadForm()
    }
  }

  isShortParameter(fiel : "password" | "name" | "last_name"| "number" , minLength:  number = 3){
    return isShortParameter(fiel,this.registerForm, minLength)
  }

  isRequired(fiel : "name" | "password" | "name" | "last_name" | "correo" ){
    return isRequired(fiel, this.registerForm)
  }

  isNotNumber(){
    return isNumberPhone(this.registerForm)
  }

  async onSubmit(){
    if(!this.userData) return
    
    if (this.registerForm.invalid) return;

    if(!this.isEditing){
      this.notiticationService.notify("No se puede editar", 'warning', 3000);
      return
    }
    
    const { name, last_name, birthDay, correoS, direction, city, phone } = this.registerForm.value;    
  
    if (name.length < 3 || last_name.length < 3 || (phone && phone.length != 10) ) return;

    try {
      const userData : UserFB = {
        name: name,
        last_name: last_name,
        correo: this.userData.user.correo,
        rol: this.userData.user.rol, 
        state: this.userData.user.state,
        birthDay: birthDay || null,
        city: city || "",
        phone: phone || "",
        direction: direction || "",
        correoS: correoS || "",
      }

      await this.userService.updateUser(this.userData.crendentialUserUID,userData);
      this.notiticationService.notify("Se actualizado correctamente", 'success', 3000);

      this.updateTable.emit()
    } catch (error) {
    }
  }

  uploadForm() {
    const datebirthDay = this.userData.user.birthDay ? 
      new Date((this.userData.user.birthDay as any).seconds * 1000).toISOString().split('T')[0]   
      : new Date("2001-01-01").toISOString().split('T')[0]; 
    this.registerForm.patchValue({
      name: this.userData.user.name || '',
      last_name: this.userData.user.last_name || '',
      correo: this.userData.user.correo || '',
      birthday: datebirthDay,
      phone: this.userData.user.phone || "",
      direction: this.userData.user.direction || "",
      city: this.userData.user.city || "",
      correoS: this.userData.user.correoS || "",
    });
  
  }
  
}

interface RegisterForm {
  last_name: FormControl<string>;
  correo: FormControl<string>;
  correoS: FormControl<string>;
  direction: FormControl<string>;
  city: FormControl<string>;
  phone: FormControl<string>;
  birthday: FormControl<Date>;
}