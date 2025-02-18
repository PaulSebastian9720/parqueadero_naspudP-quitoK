import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DealBase } from '../../../../core/interfaces/dealBase';

@Component({
  selector: 'app-table-contract',
  templateUrl: './table-contract.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TableContractComponent implements OnChanges {
  @Input() dealList: DealBase[] = [];
  dealListFilter: DealBase[] = [];

  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  pages: number[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dealList'] && changes['dealList'].currentValue) {
      this.totalPages = Math.ceil(this.dealList.length / this.itemsPerPage);
      this.dealListFilter = this.getPaginatedData();
      this.updatePages();
    }
  }

  getDateFormat(date: Date): string {
    if (!date || isNaN(new Date(date).getTime())) return '';

    const isDateValid = new Date(date);
    return new Date(
      isDateValid.getFullYear(),
      isDateValid.getMonth(),
      isDateValid.getDate()
    )
      .toISOString()
      .split('T')[0];
  }

  showMenssageState(status: string) {
    return status === 'AC'
      ? 'ACTI'
      : status === 'CL'
      ? 'CANC'
      : status === 'WT'
      ? 'ESPE'
      : status === 'IN'
      ? 'INAC'
      : '';
  }

  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.dealList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.dealListFilter = this.getPaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.dealListFilter = this.getPaginatedData();
    }
  }

  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.dealListFilter = this.getPaginatedData();
  }

  updateItemsPerPage() {
    this.currentPage = 1;
    this.itemsPerPage = Number(this.itemsPerPage);
    this.totalPages = Math.ceil(this.dealList.length / this.itemsPerPage);
    this.dealListFilter = this.getPaginatedData();
    this.updatePages();
  }
}
