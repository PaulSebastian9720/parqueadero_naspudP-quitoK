import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../../../../core/models/user';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UpdateFormUserComponent } from "../../../../shared/components/update-form-user/update-form-user.component";
import { FormsModule } from '@angular/forms';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { TableContractComponent } from "../../components/table-contract/table-contract.component";
import { ListAutomobileComponent } from "../../../../shared/components/list-automobile/list-automobile.component";

@Component({
  selector: 'app-about-client',
  standalone: true,
  imports: [CommonModule, UpdateFormUserComponent, FormsModule, HeaderServiceComponent, TableContractComponent, ListAutomobileComponent],
  templateUrl: './about-client.component.html',
})

export class AboutClientComponent implements OnInit {
  constructor(private userService: UserfbService){}

  user!: UserData | null
  users: UserData[] = []
  filteredUsers: UserData[] = []  
  wordFilter: string = ""
  isEditing = false


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
    this.user = userData;
    this.isEditing = false
  } 

  async initUser(): Promise<void> {
    const users = await this.userService.getListUsers();
    this.users = users
    this.filteredUsers = users
    this.isEditing = false
    if(this.user){
      const userAux = this.user
      this.user = null
      this.user = this.filteredUsers.find(user => user.crendentialUserUID === userAux.crendentialUserUID)!
    }
  }

  toggleEdit() {
    if(!this.user) return
    if(this.user.user.rol === 'A' || this.user.user.rol === 'CF') return
    this.isEditing = !this.isEditing
  }
}
