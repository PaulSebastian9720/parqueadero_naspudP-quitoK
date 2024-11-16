import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RateService } from '../../../../shared/services/rate/rate.service';
import { RateFB } from '../../../../core/models/rate';

@Component({
  selector: 'app-edit-rate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-rate.component.html',
})
export class EditRateComponent implements OnInit  {
  rateName: string = ''
  timeUnit: string = 'minutes'
  quantity: number = 1
  unitRate: number = 1
  quantityOptions: number[] = [] 

  
  constructor(private rateService: RateService) {}
  
  ngOnInit(): void {
    this.updateQuantityOptions() 
  }

  updateQuantityOptions() {
    switch (this.timeUnit) {
      case 'minutes':
        this.quantityOptions = Array.from({ length: 60 }, (_, i) => i + 1)
        break
      case 'hours':
        this.quantityOptions = Array.from({ length: 24 }, (_, i) => i + 1)
        break
      case 'days':
        this.quantityOptions = Array.from({ length: 30 }, (_, i) => i + 1)
        break
      case 'month':
        this.quantityOptions = [1]
        break
    }
  }

  validateUnitRate() {
    this.unitRate = parseFloat(this.unitRate.toFixed(2))
  }

   

  async onSubmit() {
    if(!this.rateName){
      console.log("Ingrese nombre")
      return
    }

    if(this.quantity <  0){
      console.log("Cantidad no puede ser negativa")
      return
    }
    try {
      const rateRef  = new RateFB(
        this.rateName,
        this.timeUnit,
        this.unitRate,
        this.quantity
      )

      await this.rateService.createRate( rateRef)
      console.log('Tarifa agregada:', rateRef)
    }catch(e){}
 }
}