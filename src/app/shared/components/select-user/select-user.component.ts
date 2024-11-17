import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserfbService } from '../../services/user/userfb.service';
import { UserData } from '../../../core/models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './select-user.component.html',
})
export class SelectUserComponent implements OnInit {
  selectedUser: string = ""
  listUserFb : UserData [] = []
  listUserFBFilter : UserData[] = []

  @Output() userEventEmitter = new EventEmitter<UserData>();
  constructor(
    private userfbService: UserfbService
  ) {}
  
  async ngOnInit(): Promise<void> {
   await this.initListUsers()
  }
  
  onClickUser(){
    const userData =this.listUserFb.find(
      userData => userData.crendentialUserUID === this.selectedUser
    )
    this.userEventEmitter.emit(userData) 
  }

  async initListUsers(){
    try {
      const list = await this.userfbService.getListUsers()
      this.listUserFb = list
      this.listUserFBFilter = this.listUserFb.filter(userData => userData.user.rol !== "CF")
     }catch (e) {}
  }
} 
