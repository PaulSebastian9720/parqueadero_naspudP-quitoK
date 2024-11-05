import { Component, OnInit } from '@angular/core';
import { UserfbService } from '../../services/user/userfb.service';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/user/auth-state.service';
import { UpdateFormUserComponent } from "../../components/update-form-user/update-form-user.component";
import { NgModel } from '@angular/forms';
import { UserData, UserFB } from '../../../core/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UpdateFormUserComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit{

  user! : UserData


  constructor(
    private userFBSerivce : UserfbService,
    private authService : AuthStateService 
    
  ){}

  async ngOnInit(): Promise<void> {
    const currentUserUID = await this.authService.credentialUserUID
    if(currentUserUID){
      const userCurrent = await  this.userFBSerivce.getUser(currentUserUID!)
      const userData : UserFB = UserFB.fromJsson(userCurrent)
      this.user = new UserData(currentUserUID,userData)
    }
  }
}


