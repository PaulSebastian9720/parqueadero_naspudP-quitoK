import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RateService } from '../../../../shared/services/rate/rate.service';
import { RateData, RateFB } from '../../../../core/models/rate';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';

@Component({
  selector: 'app-edit-rate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-rate.component.html',
})
export class EditRateComponent implements OnInit, OnChanges  {

  rateName: string = ''
  timeUnit: string = 'minutes'
  quantity: number = 1
  unitRate: number = 1
  quantityOptions: number[] = [] 

  @Input() rateData !: RateData | null
  @Output() eventUpdateRates = new EventEmitter<void>

  constructor(
    private rateService: RateService,
    private notyfyService: NotificationService

  ) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rateData'] && changes['rateData'].currentValue) {
      this.rateName = this.rateData!.rateFB.name
      this.timeUnit = this.rateData!.rateFB.timeUnit
      this.quantity = this.rateData!.rateFB.quantity
      this.unitRate = this.rateData!.rateFB.unitRate
    }
  }
  
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
    
    if(this.quantity <  0  || this.unitRate< 0){
      this.notyfyService.notify(`Ingrese valores reales`, 'warning', 3000)
      return
    }
    try {

      const rateRef  = new RateFB(
        this.rateName,
        this.timeUnit,
        this.unitRate,
        this.quantity
      )

      if(this.rateData){
        await this.rateService.updateRate(this.rateData.id, rateRef)
        this.eventUpdateRates.emit()
        this.clearCamps()
        this.notyfyService.notify(`Se actualizo correctamente`, 'success', 4000)
        return
      }

      await this.rateService.createRate( rateRef)
      this.eventUpdateRates.emit()
      this.notyfyService.notify(`Creo una nueva tarifa`, 'success', 4000)
      this.clearCamps()
    }catch(e){
      console.error(e)
    }
 }

 clearCamps(){
  this.rateData = null
  this.rateName = ''
  this.timeUnit = 'minutes'
  this.quantity = 1
  this.unitRate = 1
 }
}