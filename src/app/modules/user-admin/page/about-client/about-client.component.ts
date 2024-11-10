import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { UserData } from '../../../../core/models/user';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UpdateFormUserComponent } from "../../../../shared/components/update-form-user/update-form-user.component";
import { FormsModule } from '@angular/forms';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";

@Component({
  selector: 'app-about-client',
  standalone: true,
  imports: [CommonModule, UpdateFormUserComponent, FormsModule, HeaderServiceComponent],
  templateUrl: './about-client.component.html',
})

export class AboutClientComponent implements OnInit {
  constructor(private userService: UserfbService){}

  user!: UserData
  users: UserData[] = []
  filteredUsers: UserData[] = []  
  wordFilter: string = ""

  async ngOnInit(): Promise<void> {
    this.initUser()
  }

  onSearch(): void {
    this.filteredUsers = this.users.filter(userData =>
      userData.user.name.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
      userData.user.last_name.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
      userData.user.correo.toLowerCase().includes(this.wordFilter.toLowerCase()) 
    );
  }

  onClick(userData: UserData): void {
    console.log(userData);
    this.user = userData;
  }

  async initUser(): Promise<void> {
    const users = await this.userService.getListUsers();
    this.users = users.filter(UserData => UserData.user.rol != 'A')
    this.filteredUsers = [...this.users];
  }
}
