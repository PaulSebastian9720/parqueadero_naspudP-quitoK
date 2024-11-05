import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { UserData, UserFB } from '../../../../core/models/user';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UpdateFormUserComponent } from "../../../../shared/components/update-form-user/update-form-user.component";

@Component({
  selector: 'app-about-client',
  standalone: true,
  imports: [CommonModule, UpdateFormUserComponent],
  templateUrl: './about-client.component.html',
  styleUrl: './about-client.component.scss'
})

export class AboutClientComponent implements OnInit {
  constructor(private userService: UserfbService){}
  user !: UserData
  users: UserData [] = []

  async ngOnInit(): Promise<void> {
    const users = await this.userService.getListUsers()
    this.users = users
  }
  
  onClick(userData: UserData){

    this.user = userData
  }
}



