import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IUsernAuth } from '../../../modules/auth/utils/interfaceRegisterFom';
import { isShortParameter, isRequired, isNumberPhone } from '../../../modules/auth/utils/validator';
import { UserfbService } from '../../services/user/userfb.service';
import { CommonModule } from '@angular/common';
import { UserData, UserFB } from '../../../core/models/user';

@Component({
  selector: 'app-update-form-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-form-user.component.html',
})


export class UpdateFormUserComponent implements OnInit, OnChanges {
  registerForm!: FormGroup;
  isEditing = false;

  @Input() userData !: UserData
    @Output() updateTable =  new EventEmitter<void>()

  constructor(
    private form: FormBuilder, 
    private userService : UserfbService
  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && changes['userData'].currentValue) {
      this.registerForm.patchValue({
        name: this.userData.user.name || '',
        last_name: this.userData.user.last_name || '',
        correo: this.userData.user.correo || '',
        birthday: this.userData.user.birthDay || null,
        phone: this.userData.user.phone || null,
        direction : this.userData.user.direction || null,
        city: this.userData.user.city || null,
        correoS: this.userData.user.correoS || null,
      });

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
      birthday:        this.form.control(new Date())
    }, { });
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
    if (this.registerForm.invalid) return;
    
    const { name, last_name, correo,  birthDay, correoS, direction, city, phone } = this.registerForm.value;
    
    if (!name || !correo || !last_name) return;
    
  
    if (name.length < 3 || last_name.length < 3 || (phone && phone.length != 10) ) return;
    
    try {
      const userData : UserFB = {
        name: name,
        last_name: last_name,
        correo: correo,
        rol: 'C', 
        state: true,
        birthDay: birthDay || null,
        city: city || null,
        phone: phone || null,
        direction: direction || null,
        correoS: correoS || null,
      }

      await this.userService.updateUser(this.userData.crendentialUserUID,userData);
      this.updateTable.emit()

    } catch (error) {
      console.log("Error: " + error)
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing
  }

}