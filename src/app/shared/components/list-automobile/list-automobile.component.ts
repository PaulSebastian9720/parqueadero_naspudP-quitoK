import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Automobile } from '../../../core/models/automobile';
import { UserData } from '../../../core/models/user';
import { UserfbService } from '../../services/user/userfb.service';
import { DialogService } from '../../services/dialog/dialogconfirm.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-automobile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-automobile.component.html',
})
export class ListAutomobileComponent implements OnChanges {
  listAutomobile : Automobile [] = []

  @Input() userData !: UserData

  constructor(
    private userService : UserfbService,
    private dialogService : DialogService,

  ) { }

  @Output() eventGetRateDate = new EventEmitter<void>;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["userData"]  && changes["userData"].currentValue){
      this.initList()
    }  
  }
  

  

  async initList() {
    const userFB = await this.userService.getUser(this.userData.crendentialUserUID)
    this.listAutomobile = userFB?.listAutomobile!
  }

  async onClickDeleteAutomobile(automobileDelete: Automobile){
    if(!this.userData) return
    this.dialogService
      .confirm({
        title: '¡Advertencia!',
        question: '¿Estás seguro de continuar con esta acción?',
        highlight: `Esto eliminará  ${automobileDelete.brand}-${automobileDelete.model}-${automobileDelete.plate}`,
        icon: 'fas fa-exclamation-circle',
      })
      .then((confirmed) => {
        if (confirmed) {
          const newList = this.listAutomobile.filter(automobile => automobile.id !== automobileDelete.id)
          const userUpdate = {...this.userData.user}
          userUpdate.listAutomobile = newList
          this.userService.updateUser(this.userData.crendentialUserUID, userUpdate)
          this.initList()
        } else {}
      });
  }
}
