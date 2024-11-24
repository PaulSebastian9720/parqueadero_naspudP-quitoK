import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Automobile } from '../../../../core/models/automobile';
import { ManagementFB } from '../../../../core/models/management';
import { RateData } from '../../../../core/models/rate';
import { SpaceData, SpaceFB } from '../../../../core/models/space';
import { UserData } from '../../../../core/models/user';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { ParkinLotService } from '../../../../shared/services/space/parkink-lot.service';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { LoadingService } from '../../../../shared/services/dialog/dialogLoading.service';

@Component({
  selector: 'app-create-rented',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-rented.component.html',
})
export class CreateRentedComponent implements OnChanges {

  // Propiedades de entrada para recibir datos desde el componente padre
  @Input() userData!: UserData | null;  // Datos del usuario, pueden ser nulos
  @Input() spaceData!: SpaceData | null;  // Datos del espacio, pueden ser nulos
  @Input() rateData!: RateData | null;  // Datos de la tarifa, pueden ser nulos
  @Input() automobile!: Automobile | null;  // Datos del automóvil, pueden ser nulos

  // Propiedad de salida para emitir eventos al componente padre
  @Output() updateMapEvent = new EventEmitter<void>();  // Evento para actualizar el mapa

  // Variables locales para manejar el precio y las fechas
  price: number = 0;  // Precio inicial del contrato
  startDate = new Date();  // Fecha de inicio del contrato
  endDate = new Date();  // Fecha de fin del contrato

  // Constructor con inyección de dependencias
  constructor(
    private userService: UserfbService,  // Servicio para gestionar usuarios
    private contractService: ContractManFBService,  // Servicio para gestionar contratos
    private parkinkLot: ParkinLotService,  // Servicio para gestionar espacios de estacionamiento
    private notyfyService: NotificationService,  // Servicio de notificaciones
    private loadingService: LoadingService  // Servicio para manejar la carga
  ) {}

  /**
   * Método que se ejecuta cuando cambian las propiedades de entrada.
   * Si cambia `rateData`, se resetea el precio.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rateData'] && changes['rateData'].currentValue) {
      this.price = 0;  // Resetea el precio cuando cambia `rateData`
    }
  }

  /**
   * Método para obtener la fecha de inicio formateada.
   */
  getStartDate() {
    return this.formatDate(this.startDate);  // Formatea la fecha de inicio
  }

  /**
   * Método para obtener la fecha de fin formateada.
   * Si no existe `rateData`, retorna una fecha por defecto.
   */
  getEndDate() {
    if (!this.rateData)
      return '--/--/---- --h/--';  // Si no existe tarifa, retorna un valor por defecto
    return this.formatDate(this.endDate);  // Formatea la fecha de fin
  }

  /**
   * Método que devuelve el nombre en español de una unidad de tiempo (mes, día, hora, minuto).
   */
  getNameSpanish(timeUnit: string, quantity: number): string {
    if (timeUnit === "month") {
      return `${quantity} ${quantity > 1 ? "Meses" : "Mes"}`;
    } else if (timeUnit === "days") {
      return `${quantity} ${quantity > 1 ? "Días" : "Día"}`;
    } else if (timeUnit === "hours") {
      return `${quantity} ${quantity > 1 ? "Horas" : "Hora"}`;
    } else {
      return `${quantity} ${quantity > 1 ? "Minutos" : "Minuto"}`;
    }
  }

  /**
   * Método para obtener el estado del espacio y mostrarlo como mensaje.
   */
  getMenssage(): string {
    if (!this.spaceData) return '';
    if (this.spaceData.spaceFB.state === 'Y') {
      return 'Disponible';  // Si está disponible
    } else if (this.spaceData.spaceFB.state === 'N') {
      return 'No disponible';  // Si no está disponible
    } else {
      return 'Ocupado';  // Si está ocupado
    }
  }

  /**
   * Método para ajustar la fecha de fin al hacer click en el botón (+ o -).
   * Cambia la fecha según la unidad de tiempo de la tarifa seleccionada.
   */
  onClickButtonML(moreOrLess: 1 | -1): void {
    if (!this.rateData) return;  // Si no hay datos de tarifa, no hace nada

    if (moreOrLess < 0 && this.endDate.getTime() === this.startDate.getTime()) return;  // No permite reducir el tiempo si la fecha de inicio y fin son iguales

    const quantity = this.rateData.rateFB.quantity;

    // Ajusta la fecha de fin según la unidad de tiempo
    if (this.rateData.rateFB.timeUnit === 'minutes') {
      this.endDate.setMinutes(this.endDate.getMinutes() + moreOrLess * quantity);
    } else if (this.rateData.rateFB.timeUnit === 'days') {
      this.endDate.setDate(this.endDate.getDate() + moreOrLess * quantity);
    } else {
      this.endDate.setHours(this.endDate.getHours() + moreOrLess * quantity);
    }

    // Actualiza el precio según el cambio en el tiempo
    const updatedPrice = this.price + moreOrLess * this.rateData.rateFB.unitRate;
    this.price = Math.max(0, updatedPrice);  // Asegura que el precio no sea negativo
  }

  /**
   * Método privado para formatear las fechas a un formato específico (DD/MM/YYYY HH:MM).
   */
  private formatDate(dateC: Date): string {
    const date = new Date(dateC);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}h:${minute}`;  // Retorna la fecha formateada
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Guardar contrato".
   * Realiza la transacción de creación del contrato y actualiza el espacio de estacionamiento.
   */
  async onClickSaveContract() {
    if (!this.userData || !this.spaceData || !this.rateData) {
      this.notyfyService.notify(`Seleccione todos los datos necesarios`, 'info', 4000);
      return;  // Si falta algún dato, muestra un mensaje de advertencia
    }

    // Verifica si el espacio está disponible antes de proceder
    if (
      this.spaceData.spaceFB.state === 'N' ||
      this.spaceData.spaceFB.state === 'NP' ||
      this.spaceData.spaceFB.state === 'O' 
    ) {
      this.notyfyService.notify(`El espacio no está disponible`, 'error', 4000);
      return;  // Si el espacio no está disponible, muestra un mensaje de error
    }

    try {
      this.loadingService.open("Realizando la Transacción, espere un momento");

      // Obtiene el ID del usuario y lo usa para crear el contrato
      const userID: string = this.userData.crendentialUserUID;
      const userFB = await this.userService.getUser(userID);
      const idUserForManagent = this.userData.crendentialUserUID.slice(0, 4);
      const managementId: string = `man-${idUserForManagent}-${userFB?.listManagement?.length}`;

      // Si no se ha proporcionado un automóvil, asigna valores por defecto
      const automobile = this.automobile
        ? {
            id: this.automobile.id,
            plate: this.automobile.plate,
            brand: this.automobile.brand,
            model: this.automobile.model,
          }
        : {
            id: '0000',
            plate: 'aaaa-1111',
            brand: 'GENERICO',
            model: 'GENERICO',
          };

      // Crea el contrato y actualiza el espacio de estacionamiento
      const contractFb = new ManagementFB(
        "R", userID, this.startDate, this.endDate, this.rateData.rateFB.quantity, "A", 
        this.spaceData.id, this.rateData.rateFB, [], automobile
      );

      const spaceUpdate = new SpaceFB(
        this.spaceData.spaceFB.location,
        'O', userID, managementId
      );

      // Realiza las operaciones de actualización
      await this.contractService.createContract(managementId, contractFb);
      userFB?.listManagement?.push(managementId);
      await this.userService.updateUser(userID, userFB!);
      await this.parkinkLot.updateParkigSpace(this.spaceData.spaceFB.location, spaceUpdate);

      // Cierra el diálogo de carga y emite el evento de actualización
      this.loadingService.closeDialog();
      this.updateMapEvent.emit();

      // Resetea los datos de entrada y muestra una notificación de éxito
      this.userData = null;
      this.spaceData = null;
      this.automobile = null;
      this.rateData = null;
      this.notyfyService.notify(`Transacción realizada con éxito`, 'success', 3000);

    } catch (e) {
      // Si ocurre un error, muestra un mensaje de error
      this.loadingService.updateTransactionStatus("error", "Transacción errónea", "Error: " + e as string);
    }
  }
}
