import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ManagementFB } from '../../../../core/models/management';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RateFB } from '../../../../core/models/rate';
import { UserService } from '../../../../shared/services/api/user/user.service';
import { User } from '../../../../core/interfaces/person';
import { DealBase } from '../../../../core/interfaces/dealBase';

@Component({
  selector: 'app-table-contract',
  templateUrl: './table-contract.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TableContractComponent implements OnChanges {
  @Input() contractList: DealBase[] = [];
  contractListFilter: DealBase[] = [];

  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  pages: number[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dealBaseList'] && changes['dealBaseList'].currentValue) {
      this.totalPages = Math.ceil(this.contractList.length / this.itemsPerPage);
      this.contractListFilter = this.getPaginatedData();
      this.updatePages();
    }
  }

  getDateFormat(date: Date): string {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).toString();
  }

  showMenssageState(status: string) {
    return status === 'AC'
      ? 'ACTIVO'
      : status === 'CL'
      ? 'CANCELADO'
      : status === 'WT'
      ? 'ESPERA'
      : status === 'IN'
      ? 'INACTICO'
      : '';
  }

  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.contractList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.contractListFilter = this.getPaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.contractListFilter = this.getPaginatedData();
    }
  }

  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.contractListFilter = this.getPaginatedData();
  }

  updateItemsPerPage() {
    this.currentPage = 1;
    this.itemsPerPage = Number(this.itemsPerPage);
    this.totalPages = Math.ceil(this.contractList.length / this.itemsPerPage);
    this.contractListFilter = this.getPaginatedData();
    this.updatePages();
  }
}
