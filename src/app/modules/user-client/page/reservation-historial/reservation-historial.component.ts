import { Component, OnInit } from '@angular/core';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { TableContractComponent } from "../../../user-admin/components/table-contract/table-contract.component";
import { UserData } from '../../../../core/models/user';
import { AuthStateService } from '../../../../shared/services/user/auth-state.service';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservation-historial',
  standalone: true,
  imports: [TableContractComponent, RouterModule],
  templateUrl: './reservation-historial.component.html',
  styleUrl: './reservation-historial.component.scss'
})
export class ReservationHistorialComponent implements OnInit {
  user!: UserData

  constructor(
    private authService: AuthStateService,
    private userFBService: UserfbService
  ) { }

  async ngOnInit() {
    try {
      const currentUserUID = await this.authService.credentialUserUID;
      if (currentUserUID) {
        this.userFBService.listenToUserChanges(currentUserUID);
        this.userFBService.user$.subscribe(userData => {
          if (userData) {
            this.user = new UserData(currentUserUID, userData);
          }
        });
      }
    } catch (error) {
      console.error('Error al obtener el UID o al escuchar cambios en el usuario:', error);
    }
  }

}
