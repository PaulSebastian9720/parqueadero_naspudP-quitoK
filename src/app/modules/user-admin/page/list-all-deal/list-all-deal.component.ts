import { Component, OnInit } from '@angular/core';
import { DealBase } from '../../../../core/interfaces/dealBase';
import { ContractService } from '../../../../shared/services/api/contract/contract';
import { TicketService } from '../../../../shared/services/api/ticket/ticket';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableContractComponent } from '../../components/table-contract/table-contract.component';

@Component({
  selector: 'app-list-all-deal',
  standalone: true,
  imports: [CommonModule, FormsModule, TableContractComponent],
  templateUrl: './list-all-deal.component.html',
  styleUrl: './list-all-deal.component.scss',
})
export class ListAllDealComponent implements OnInit {
  dealBaseList: DealBase[] = [];
  dealBaseFilter: DealBase[] = [];
  selectDealBase: string = '';
  selectByDay: string = '';
  selectByStatus: string = '';

  constructor(
    private contractService: ContractService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.contractService.getAllContracts().subscribe((contracts) => {
      this.dealBaseList = contracts;
      this.dealBaseFilter = contracts;
    });
  }

  changePage() {
    this.dealBaseList = [];
    this.dealBaseFilter = [];
    if (this.selectDealBase === 'CNT') {
      this.contractService.getAllContracts().subscribe((contracts) => {
        this.dealBaseList = contracts;
        this.dealBaseFilter = contracts;
      });
    } else {
      this.ticketService.getAllTickets().subscribe((tickets) => {
        this.dealBaseList = tickets;
        this.dealBaseFilter = tickets;
      });
    }
  }

  filterListByTypeDate() {
    this.selectByStatus = ""
    const now = new Date();

    const startOfWeek = (date: Date) => {
      const day = date.getDay(),
        diff = date.getDate() - day + (day == 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    };

    this.dealBaseFilter = this.dealBaseList.filter((dealBase) => {
      const startDate = new Date(dealBase.startDate!);

      switch (this.selectByDay) {
        case 'MNT':
          return (
            startDate.getMonth() === now.getMonth() &&
            startDate.getFullYear() === now.getFullYear()
          );

        case 'WEK':
          const startOfCurrentWeek = startOfWeek(new Date(now));
          return (
            startDate >= startOfCurrentWeek &&
            startDate <
              new Date(
                startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 7)
              )
          );

        case 'DAY':
          const diffDays =
            (now.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
          return diffDays <= 7;

        default:
          return true;
      }
    });
  }

  filterType() {
    this.selectByDay = ""
    if(this.selectByStatus === 'SF'){
      this.dealBaseFilter = this.dealBaseList
      return
    }
    this.dealBaseFilter = this.dealBaseList.filter(
      (deal) => deal.status === this.selectByStatus
    );
  }
}
