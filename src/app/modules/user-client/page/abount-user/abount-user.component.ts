import { Component } from '@angular/core';
import { UserData } from '../../../../core/models/user';
import { Automobile } from '../../../../core/models/automobile';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { AuthStateService } from '../../../../shared/services/user/auth-state.service';
import { ListAutomobileComponent } from '../../../../shared/components/list-automobile/list-automobile.component';
import { CommonModule } from '@angular/common';
import { TableContractComponent } from '../../../user-admin/components/table-contract/table-contract.component';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AutomobileService } from '../../../../shared/services/api/automovile/automobile.service';
import { UserCurrentService } from '../../../../shared/services/user/user-cache.service';

@Component({
  selector: 'app-abount-user',
  standalone: true,
  imports: [CommonModule, ListAutomobileComponent, TableContractComponent, FormsModule],
  templateUrl: './abount-user.component.html',
  styleUrl: './abount-user.component.scss',
})
export class AbountUserComponent {
  user!: UserData;
  vehiculos: Automobile[] = [];
  viewPage :  "/viewAutomobiles" |  "/viewContracts" = "/viewAutomobiles"
  loading: boolean = false

  constructor(
    private userCurrent: UserCurrentService,
    private automobileService: AutomobileService,
  ) {}

   ngOnInit(): void {
    this.loading = true;
    this.userCurrent.getUser().subscribe(user=> {
      if(user){
        this.automobileService.getAutomobileListByIdPerson(user.idPerson!).pipe(
          finalize(()=> this.loading = false)
        ).subscribe((results) => {
          this.vehiculos = results;
        })
      }
    }
  )
    
  
    

    // try {
    //   const currentUserUID = await this.authService.credentialUserUID;
    //   if (currentUserUID) {
    //     this.userFBSerivce.listenToUserChanges(currentUserUID);
    //     this.userFBSerivce.user$.subscribe((userData) => {
    //       if (userData) {
    //         this.user = new UserData(currentUserUID, userData);
    //       }
    //     });
    //   }
    // } catch (error) {
    //   console.error(
    //     'Error al obtener el UID o al escuchar cambios en el usuario:',
    //     error
    //   );
    // }
  }

  private async fetchAutomobiles() {
    // const currentUserUID = await this.authService.credentialUserUID;
    // if (currentUserUID) {
    //   this.userFBSerivce.listenToUserChanges(currentUserUID);
    //   this.userFBSerivce.user$.subscribe((userData) => {
    //     if (userData) {
    //       this.user = new UserData(currentUserUID, userData);
    //       this.vehiculos = this.user.user.listAutomobile || [];
    //     } else {
    //       this.vehiculos = [];
    //     }
    //   });
    // }
  }

  public changePage(namePage: "/viewContracts"   | "/viewAutomobiles"){
    this.viewPage = namePage;
  }

}
