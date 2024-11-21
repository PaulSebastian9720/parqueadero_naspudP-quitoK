import { Component } from '@angular/core';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { AuthStateService } from '../../../../shared/services/user/auth-state.service';
import { UserData, UserFB } from '../../../../core/models/user';
import { CommonModule } from '@angular/common';
import { Automobile } from '../../../../core/models/automobile';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { ListAutomobileComponent } from '../../../../shared/components/list-automobile/list-automobile.component';

@Component({
  selector: 'app-view-vehicules',
  standalone: true,
  imports: [CommonModule, HeaderServiceComponent, ListAutomobileComponent],
  templateUrl: './view-vehicules.component.html',
  styleUrl: './view-vehicules.component.scss'
})
export class ViewVehiculesComponent {

  user! : UserData
  vehiculos!: Automobile []


  constructor(
    private userFBSerivce : UserfbService,
    private authService : AuthStateService,
    
  ){}

  async ngOnInit(): Promise<void> {
   await this.fetchAutomobiles()
  }

  private async fetchAutomobiles() {
    const currentUserUID = await this.authService.credentialUserUID
    if(currentUserUID){
      this.userFBSerivce.listenToUserChanges(currentUserUID)
      this.userFBSerivce.user$.subscribe(userData => {
        if(userData){
          this.user = new UserData(currentUserUID,userData)
          this.vehiculos = this.user.user.listAutomobile || []
        } else {
          this.vehiculos = []
        }
      })
      
    }
  }
}

