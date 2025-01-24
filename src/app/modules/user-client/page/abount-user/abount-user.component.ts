import { Component } from '@angular/core';
import { UserData } from '../../../../core/models/user';
import { Automobile } from '../../../../core/models/automobile';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { AuthStateService } from '../../../../shared/services/user/auth-state.service';
import { ListAutomobileComponent } from '../../../../shared/components/list-automobile/list-automobile.component';
import { CommonModule } from '@angular/common';
import { TableContractComponent } from '../../../user-admin/components/table-contract/table-contract.component';
import { AutomobileService } from '../../../../shared/services/automovile/automobile.service';

@Component({
  selector: 'app-abount-user',
  standalone: true,
  imports: [CommonModule, ListAutomobileComponent, TableContractComponent],
  templateUrl: './abount-user.component.html',
  styleUrl: './abount-user.component.scss',
})
export class AbountUserComponent {
  user!: UserData;
  vehiculos!: Automobile[];

  constructor(
    private userFBSerivce: UserfbService,
    private authService: AuthStateService,
    private automobileService: AutomobileService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.fetchAutomobiles();
    const automobiles = await this.automobileService.getAutomobileByIdPerson(2)
    console.log(automobiles)

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
}
