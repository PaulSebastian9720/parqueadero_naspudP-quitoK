import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserData } from '../../../../core/models/user';
import { CommonModule } from '@angular/common';
import { SpaceData, SpaceFB } from '../../../../core/models/space';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { ManagementFB } from '../../../../core/models/management';
import { ParkinLotService } from '../../../../shared/services/space/parkink-lot.service';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { RateData } from '../../../../core/models/rate';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { LoadingService } from '../../../../shared/services/dialog/dialogLoading.service';
import { User } from '../../../../core/interfaces/person';
import { ParkingSpace } from '../../../../core/interfaces/parkingSpace';
import { Rate } from '../../../../core/interfaces/rate';
import { Automobile } from '../../../../core/interfaces/automobile';

@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-contract.component.html',
})
export class CreateContractComponent implements OnChanges {

  // Propiedades de entrada y salida del componente
  @Input() user!: User | null;  // Datos del usuario recibidos como entrada, pueden ser nulos si no hay usuario.
  @Input() parkingSpace!: ParkingSpace | null;  // Datos del espacio recibido como entrada, puede ser nulo si no hay espacio.
  @Input() rate!: Rate | null;  // Datos de la tarifa recibidos como entrada, puede ser nulo si no se selecciona tarifa.
  @Input() automobile!: Automobile | null;  // Datos del automóvil recibido, puede ser nulo si no se edita un automóvil.
  @Output() updateMapEvent = new EventEmitter<void>();  // Evento para notificar que el mapa debe actualizarse.
  
  price: number = 0;  // Precio de la transacción, inicializado a 0.
  
  startDate = new Date();  // Fecha de inicio del contrato, inicializada al día actual.
  endDate = new Date();  // Fecha de finalización del contrato, inicializada al día actual.

  constructor(
    private userService: UserfbService,  // Servicio para interactuar con la base de datos de usuarios de Firebase.
    private contractService: ContractManFBService,  // Servicio para manejar la creación de contratos en Firebase.
    private parkinkLot: ParkinLotService,  // Servicio para interactuar con el parqueo de autos.
    private notyfyService: NotificationService,  // Servicio para mostrar notificaciones.
    private loadingService: LoadingService  // Servicio para manejar el estado de carga.
  ) {}

  /**
   * Método que se ejecuta cuando cambian los datos de entrada del componente.
   * Se utiliza para resetear el precio cuando cambia la tarifa.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rateData'] && changes['rateData'].currentValue) {
      this.price = 0;  // Resetea el precio si la tarifa cambia.
    }
  }

  /**
   * Método que retorna la fecha de inicio formateada como 'DD/MM/YYYY'.
   */
  getStartDate() {
    return this.formatDate(this.startDate);  // Formatea y retorna la fecha de inicio.
  }

  /**
   * Método que retorna la fecha de finalización formateada como 'DD/MM/YYYY'.
   * Si no hay datos de tarifa, retorna un mensaje de fecha no válida.
   */
  getEndDate() {
    if (!this.rate) return '--/--/----';  // Si no hay datos de tarifa, retorna fecha no válida.
    return this.formatDate(this.endDate);  // Formatea y retorna la fecha de finalización.
  }

  /**
   * Método que retorna un mensaje sobre el estado del espacio.
   * Retorna 'Disponible', 'No disponible' u 'Ocupado' dependiendo del estado del espacio.
   */
 

  /**
   * Método que ajusta la fecha de finalización sumando o restando meses.
   * Cambia el precio dependiendo de los meses seleccionados.
   */


  /**
   * Método privado que formatea una fecha como 'DD/MM/YYYY'.
   */
  private formatDate(dateC: Date): string {
    const date = new Date(dateC);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Formatea el mes con dos dígitos.
    const day = String(date.getDate()).padStart(2, '0');  // Formatea el día con dos dígitos.
    return `${day}/${month}/${year}`;  // Retorna la fecha formateada.
  }

  /**
   * Método que se ejecuta al guardar el contrato.
   * Realiza validaciones y crea el contrato si todo es válido.
   */
  
}
