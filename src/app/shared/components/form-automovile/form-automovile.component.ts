import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Automobile } from '../../../core/models/automobile';
import { FormsModule } from '@angular/forms';
import { UserData } from '../../../core/models/user';
import { CommonModule } from '@angular/common';
import { UserfbService } from '../../services/user/userfb.service';

@Component({
  selector: 'app-form-automovile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-automovile.component.html',
})
export class FormAutomovileComponent {

  constructor(private userService: UserfbService){}

  @Input() userData !: UserData
  @Input() automobileData!: Automobile | null 
  @Output() eventUpateUser = new EventEmitter()

  automobile: Automobile = new Automobile("","", "","")

  ngOnInit() {
    if (this.automobileData) {
      this.automobile = { ...this.automobileData }
    }
  }

  clearForm() {
    this.automobile = new Automobile("","", "","")
  }

  async onSubmit() {
    if(!this.userData){
      console.log("No hay usario")
      return
    }
    if (!this.automobile.model || !this.automobile.plate || !this.automobile.brand) {
      console.log("Llene los campos")
    }

    if(!this.automobileData){

      const userFb =  {...this.userData.user}
      const idAutomovile = this.userData.user.listAutomobile ? this.userData.user.listAutomobile.length.toString() : "0" 
      this.automobile.id = idAutomovile
      const automobileData = {
        id: this.automobile.id,
        model: this.automobile.model,
        plate: this.automobile.plate,
        brand: this.automobile.brand
      }
      userFb.listAutomobile?.push(automobileData)      
      await this.userService.updateUser(this.userData.crendentialUserUID, userFb)
      console.log("create new")
      this.eventUpateUser.emit()
      return
    }     
    
    const userUpdate = { ...this.userData.user };

    userUpdate.listAutomobile = userUpdate.listAutomobile!.map(automobile =>
      automobile.id === this.automobile.id ? { ...this.automobile } : automobile
    )
    
    await this.userService.updateUser(this.userData.crendentialUserUID, userUpdate)
    this.eventUpateUser.emit()
    this.clearForm()
  }
}
