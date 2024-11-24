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
export class EditRateComponent implements OnInit, OnChanges {

  // Propiedades para almacenar los datos de la tarifa
  rateName: string = ''  // Nombre de la tarifa
  timeUnit: string = 'minutes'  // Unidad de tiempo (por defecto minutos)
  quantity: number = 1  // Cantidad de unidades
  unitRate: number = 1  // Tarifa por unidad
  quantityOptions: number[] = []  // Opciones disponibles para la cantidad según la unidad de tiempo

  // Propiedades de entrada y salida del componente
  @Input() rateData !: RateData | null  // Datos de la tarifa recibidos como entrada
  @Output() eventUpdateRates = new EventEmitter<void>()  // Evento para notificar la actualización de las tarifas

  // Inyección de dependencias a través del constructor
  constructor(
    private rateService: RateService,  // Servicio para manejar las tarifas
    private notyfyService: NotificationService  // Servicio para mostrar notificaciones
  ) {}

  /**
   * Método que se ejecuta cuando hay cambios en las propiedades de entrada.
   * Se actualizan los datos de la tarifa si los datos de 'rateData' cambian.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rateData'] && changes['rateData'].currentValue) {
      this.rateName = this.rateData!.rateFB.name  // Nombre de la tarifa
      this.timeUnit = this.rateData!.rateFB.timeUnit  // Unidad de tiempo de la tarifa
      this.quantity = this.rateData!.rateFB.quantity  // Cantidad de unidades de la tarifa
      this.unitRate = this.rateData!.rateFB.unitRate  // Tarifa por unidad
    }
  }
  
  /**
   * Método que se ejecuta al inicializar el componente.
   * Se utiliza para configurar las opciones disponibles para la cantidad según la unidad de tiempo.
   */
  ngOnInit(): void {
    this.updateQuantityOptions()  // Actualiza las opciones disponibles para la cantidad
  }

  /**
   * Método para actualizar las opciones de cantidad según la unidad de tiempo.
   * Dependiendo de la unidad de tiempo (minutos, horas, días, mes), se establecen las opciones correspondientes.
   */
  updateQuantityOptions() {
    switch (this.timeUnit) {
      case 'minutes':
        this.quantityOptions = Array.from({ length: 60 }, (_, i) => i + 1)  // 1-60 minutos
        break
      case 'hours':
        this.quantityOptions = Array.from({ length: 24 }, (_, i) => i + 1)  // 1-24 horas
        break
      case 'days':
        this.quantityOptions = Array.from({ length: 30 }, (_, i) => i + 1)  // 1-30 días
        break
      case 'month':
        this.quantityOptions = [1]  // Solo un mes
        break
    }
  }

  /**
   * Método para validar la tarifa por unidad.
   * Se asegura de que la tarifa esté con dos decimales.
   */
  validateUnitRate() {
    this.unitRate = parseFloat(this.unitRate.toFixed(2))  // Redondea la tarifa a dos decimales
  }

  /**
   * Método para manejar el envío del formulario de tarifa.
   * Si la cantidad o tarifa es negativa, muestra una notificación.
   * Si todo es válido, actualiza o crea la tarifa y emite un evento de actualización.
   */
  async onSubmit() {
    if(this.quantity <  0  || this.unitRate < 0){  // Verifica si los valores son negativos
      this.notyfyService.notify(`Ingrese valores reales`, 'warning', 3000)  // Muestra una advertencia
      return
    }
    try {
      const rateRef  = new RateFB(
        this.rateName,  // Nombre de la tarifa
        this.timeUnit,  // Unidad de tiempo
        this.unitRate,  // Tarifa por unidad
        this.quantity   // Cantidad de unidades
      )

      // Si ya existe una tarifa, la actualiza
      if(this.rateData){
        await this.rateService.updateRate(this.rateData.id, rateRef)
        this.eventUpdateRates.emit()  // Emite el evento de actualización
        this.clearCamps()  // Limpia los campos del formulario
        this.notyfyService.notify(`Se actualizo correctamente`, 'success', 4000)  // Muestra una notificación de éxito
        return
      }

      // Si no existe una tarifa, crea una nueva
      await this.rateService.createRate(rateRef)
      this.eventUpdateRates.emit()  // Emite el evento de creación
      this.notyfyService.notify(`Creo una nueva tarifa`, 'success', 4000)  // Muestra una notificación de éxito
      this.clearCamps()  // Limpia los campos del formulario
    }catch(e){
      console.error(e)  // Si hay un error, lo muestra en la consola
    }
  }

  /**
   * Método para limpiar los campos del formulario.
   * Restablece los valores a sus configuraciones predeterminadas.
   */
  clearCamps(){
    this.rateData = null  // Limpia los datos de la tarifa
    this.rateName = ''  // Restablece el nombre de la tarifa
    this.timeUnit = 'minutes'  // Restablece la unidad de tiempo
    this.quantity = 1  // Restablece la cantidad
    this.unitRate = 1  // Restablece la tarifa por unidad
  }
}
