import { Component, OnInit } from '@angular/core';
import { TableContractComponent } from '../../../user-admin/components/table-contract/table-contract.component';
import { UserData } from '../../../../core/models/user';
import { AuthStateService } from '../../../../shared/services/user/auth-state.service';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { RouterModule } from '@angular/router';
import { User } from '../../../../core/interfaces/person';
import { UserCurrentService } from '../../../../shared/services/user/user-cache.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-reservation-historial',
  standalone: true,
  imports: [TableContractComponent, RouterModule],
  templateUrl: './reservation-historial.component.html',
  styleUrl: './reservation-historial.component.scss',
})
export class ReservationHistorialComponent implements OnInit {
  user!: User;

  constructor(
    private authService: AuthStateService,
    private userCurrent: UserCurrentService
  ) {}

  ngOnInit() {
    const user = this.userCurrent.getUser().pipe(
      map((user) => {
        return user;
      })
    );

    if(user){

    }
  }
}
