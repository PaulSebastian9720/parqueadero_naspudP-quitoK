import { Component } from '@angular/core';
import { Automobile } from '../../../../core/interfaces/automobile';
import { ListAutomobileComponent } from '../../../../shared/components/list-automobile/list-automobile.component';
import { CommonModule } from '@angular/common';
import { TableContractComponent } from '../../../user-admin/components/table-contract/table-contract.component';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AutomobileService } from '../../../../shared/services/api/automovile/automobile.service';
import { UserCurrentService } from '../../../../shared/services/user/user-cache.service';
import { User } from '../../../../core/interfaces/person';
import { Contract } from '../../../../core/interfaces/contract';
import { Ticket } from '../../../../core/interfaces/ticket';
import { ContractService } from '../../../../shared/services/api/contract/contract';
import { TicketService } from '../../../../shared/services/api/ticket/ticket';

@Component({
  selector: 'app-abount-user',
  standalone: true,
  imports: [
    CommonModule,
    ListAutomobileComponent,
    TableContractComponent,
    FormsModule,
  ],
  templateUrl: './abount-user.component.html',
  styleUrl: './abount-user.component.scss',
})
export class AbountUserComponent {
  user!: User;
  vehiculos: Automobile[] = [];
  contractList: Contract[] = [];
  ticketList: Ticket[] = [];

  viewPage: '/viewAutomobiles' | '/viewContracts' = '/viewAutomobiles';

  constructor(
    private userCurrent: UserCurrentService,
    private automobileService: AutomobileService,
    private contractService: ContractService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.userCurrent.getUser().subscribe((user) => {
      const userId = user?.idPerson ?? 0;
      if (userId > 0) {
        this.automobileService
          .getAutomobileListByIdPerson(userId)
          .subscribe((results) => {
            this.vehiculos = results;
          });
        this.contractService
          .getContractListByIdPerson(userId)
          .subscribe((results) => {
            this.contractList = results;
          });
        this.ticketService.getTicketsByIdPerson(userId).subscribe((results) => {
          this.ticketList = results;
        });
      }
    });
  }

  public changePage(namePage: '/viewContracts' | '/viewAutomobiles') {
    this.viewPage = namePage;
  }
}
