import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DealBase } from '../../../core/interfaces/dealBase';


@Component({
  selector: 'app-show-deal-base',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './show-deal-base.component.html',
  styleUrl: './show-deal-base.component.scss',
})
export class ShowDealBaseComponent {
  @Input() dealBase: DealBase = {};

  get startDate(): string {
    const dealStartDate = this.dealBase.startDate;
    return dealStartDate
    ? new Date(dealStartDate).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  : '';
  }

  get endDate(): string {
    const dealEndDate = this.dealBase.endDate;
    return dealEndDate
    ? new Date(dealEndDate).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  : '';
  }
}
