import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-rate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-rate.component.html',
})
export class EditRateComponent {
  rateName: string = ''
  timeUnit: string = 'minutes'
  quantity: number = 1
  unitRate: number = 1
  applicationPeriod: string = '1_week' 
  quantityOptions: number[] = [] 

  conversionFactors = new Map<string, number>([
    ['minutes-day', 1440],      
    ['minutes-week', 10080],     
    ['minutes-month', 43200],   
    ['hours-day', 24],
    ['hours-week', 168],        
    ['hours-month', 720],       
    ['days-week', 7],
    ['days-month', 30],         
    ['month-month', 1],
  ])

  constructor() {
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
        this.quantityOptions = Array.from({ length: 31 }, (_, i) => i + 1)
        break
      case 'month':
        this.quantityOptions = [1]
        break
    }
  }

  validateUnitRate() {
    this.unitRate = parseFloat(this.unitRate.toFixed(2))
  }

  calculateEstimatedCost(): string {
    const conversionKey = `${this.timeUnit}-${this.applicationPeriod}`
    const factor = this.conversionFactors.get(conversionKey) || 1
    const estimatedCost =  factor 
    return estimatedCost.toFixed(2)
  }

  onSubmit() {
    console.log('Tarifa agregada:', {
      nombre: this.rateName,
      unidadDeTiempo: this.timeUnit,
      cantidad: this.quantity,
      tarifaPorUnidad: this.unitRate,
      periodoAplicacion: this.applicationPeriod,
      costoEstimado: this.calculateEstimatedCost()
    })
 }
}