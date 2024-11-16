import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RateData } from '../../../../core/models/rate';
import { RateService } from '../../../../shared/services/rate/rate.service';

@Component({
  selector: 'app-list-rates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-rates.component.html',
})
export class ListRatesComponent implements OnInit {
  listRate : RateData [] = []
  constructor(private rateServices : RateService) { }

  async ngOnInit(): Promise<void> {
      this.initListRates()
  }

  async initListRates() {
    this.listRate = await this.rateServices.getListRate()
  }
}
