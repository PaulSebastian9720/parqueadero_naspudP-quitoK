import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { SpaceData } from '../../../../core/models/space';
import { UserData, UserFB } from '../../../../core/models/user';
import {
  ManagementData,
  ManagementFB,
} from '../../../../core/models/management';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { ParkinLotService } from '../../../../shared/services/space/parkink-lot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../../shared/services/dialog/dialogconfirm.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { LoadingService } from '../../../../shared/services/dialog/dialogLoading.service';

@Component({
  selector: 'app-edit-spot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-spot.component.html',
})
export class EditSpotComponent implements OnChanges {
  // Propiedades de entrada y salida
  @Input() spaceData!: SpaceData | null; // Datos del espacio recibidos como entrada
  userFB!: UserFB | null; // Información del usuario
  contractFB!: ManagementFB | null; // Información del contrato
  dateToday!: Date; // Fecha actual
  totalPrice!: number; // Precio total
  @Output() eventReloadMatriz = new EventEmitter<void>(); // Evento para recargar la matriz

  // Constructor donde se inyectan los servicios necesarios
  constructor(
    private userService: UserfbService, // Servicio para manejar los datos de usuario
    private contracService: ContractManFBService, // Servicio para manejar contratos
    private spotService: ParkinLotService, // Servicio para manejar los espacios de estacionamiento
    private dialogService: DialogService, // Servicio para manejar diálogos
    private notyfyService: NotificationService, // Servicio para mostrar notificaciones
    private loadingService: LoadingService // Servicio para manejar el estado de carga
  ) {}

  // Este método se ejecuta cuando hay cambios en los datos del componente (ngOnChanges)
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    // Si no hay datos de espacio (spaceData), termina la ejecución
    if (!this.spaceData) return;

    // Si hay cambios en el objeto spaceData, notifica al usuario el spot seleccionado
    if (changes['spaceData'] && changes['spaceData'].currentValue) {
      this.notyfyService.notify(
        `Spot seleccionado ${this.spaceData.spaceFB.location}`,
        'info',
        3000
      );

      // Si el estado del contrato es 'Y' (disponible), se resetean los datos y se termina
      if (this.spaceData.spaceFB.state === 'Y') {
        this.userFB = null;
        this.contractFB = null;
        return;
      }

      // Si el estado no es 'Y', recarga los datos del usuario y contrato
      await this.reloadData();

      // Si el contrato es de tipo "R", calcula el costo basado en la fecha de inicio del contrato
      if (this.contractFB?.type === 'R') {
        const startDate = new Date(
          (this.contractFB?.startDate as any).seconds * 1000
        );
        this.totalPrice = this.calculateCost(
          startDate,
          this.contractFB?.rate.timeUnit!,
          this.contractFB?.rate.quantity!,
          this.contractFB?.rate.unitRate!
        );
      }
    }
  }

  // Método que recarga los datos del usuario y contrato basados en los IDs proporcionados
  async reloadData() {
    try {
      // Obtiene el UID del usuario y el ID del contrato desde spaceData
      const userUID = this.spaceData!.spaceFB.idFBCliente;
      const contractID = this.spaceData!.spaceFB.idFBManagement;

      // Asigna los datos del usuario y contrato al componente
      this.userFB = await this.userService.getUser(userUID);
      this.contractFB = await this.contracService.getContract(contractID);
    } catch (e) {
      // Si ocurre un error, no hace nada en este bloque
    }
  }

  // Método que formatea un timestamp de Firebase a un formato de fecha legible
  formatDate(firebaseTimestamp: any): string {
    if (!firebaseTimestamp || !firebaseTimestamp.seconds) {
      return '00/00/0000';
    }

    const date = new Date(firebaseTimestamp.seconds * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');

    return `${day}/${month}/${year}  ${hour}h:${minute}m`;
  }

  // Método que devuelve la fecha y hora actual en un formato legible
  formateToday() {
    this.dateToday = new Date(Date.now());
    const year = this.dateToday.getFullYear();
    const month = String(this.dateToday.getMonth() + 1).padStart(2, '0');
    const day = String(this.dateToday.getDate()).padStart(2, '0');
    const minute = String(this.dateToday.getMinutes()).padStart(2, '0');
    const hour = String(this.dateToday.getHours()).padStart(2, '0');
    return `${day}/${month}/${year}  ${hour}h:${minute}m`;
  }

  // Método que convierte una unidad de tiempo y cantidad a su forma en español
  getNameSpanish(timeUnit: string, quantity: number): string {
    if (timeUnit === 'month') {
      return `${quantity} ${quantity > 1 ? 'Meses' : 'Mes'}`;
    } else if (timeUnit === 'days') {
      return `${quantity} ${quantity > 1 ? 'Días' : 'Día'}`;
    } else if (timeUnit === 'hours') {
      return `${quantity} ${quantity > 1 ? 'Horas' : 'Hora'}`;
    } else {
      return `${quantity} ${quantity > 1 ? 'Minutos' : 'Minuto'}`;
    }
  }

  // Método que determina el mensaje de estado del espacio de estacionamiento
  getMenssage(): string {
    if (!this.spaceData) return '';
    if (this.spaceData.spaceFB.state === 'Y') {
      return 'Disponible';
    } else if (this.spaceData.spaceFB.state === 'N') {
      return 'No disponible';
    } else {
      return 'Ocupado';
    }
  }

  // Método que desactiva un contrato (marca como cancelado) y actualiza el espacio de estacionamiento
  async onDisable() {
    // Verifica si faltan datos necesarios, y notifica error si es el caso
    if (!this.spaceData || !this.contracService || !this.userFB) {
      this.notyfyService.notify(`Error con los datos`, 'warning', 3000);
      return;
    }

    // Pregunta al usuario si está seguro de continuar con la acción de desactivación
    const confirmed = await this.dialogService.confirm({
      title: '¡Advertencia!',
      question: '¿Estás seguro de continuar con esta acción?',
      highlight: `Se anulara este contrato con ${this.userFB.name} ${this.userFB.last_name}`,
      icon: 'fa fa-file-alt',
    });

    // Si el usuario confirma la desactivación, se realiza la transacción
    if (confirmed) {
      this.loadingService.open('Realizando la Transacción, espere un momento');

      const contractUpdate = { ...this.contractFB };
      const spaceOfParking = { ...this.spaceData!.spaceFB };
      const contracID = this.spaceData!.spaceFB.idFBManagement;
      const spaceID = this.spaceData!.spaceFB.location;

      // Actualiza el estado del contrato y el espacio de estacionamiento
      contractUpdate.state = 'C';
      contractUpdate.endDate = new Date(Date.now());
      contractUpdate.totalPrice = 0;
      spaceOfParking.state = 'Y';
      spaceOfParking.idFBCliente = '';
      spaceOfParking.idFBManagement = '';

      try {
        // Realiza las actualizaciones de contrato y espacio de estacionamiento
        await this.contracService.updatoContract(contracID, contractUpdate);
        await this.spotService.updateParkigSpace(spaceID, spaceOfParking);

        // Reinicia los datos del espacio y contrato
        this.spaceData = null;
        this.userFB = null;
        this.contractFB = null;
        this.totalPrice = 0;
        this.loadingService.closeDialog();
        this.eventReloadMatriz.emit();
      } catch (e) {
        // Si ocurre un error en la transacción, se actualiza el estado de la transacción
        this.loadingService.updateTransactionStatus(
          'error',
          'Error en la transacción',
          ('Error: ' + e) as string
        );
      }
    } else {
      this.notyfyService.notify(`Operación cancelada`, 'info', 3000);
    }
  }

  // Método para procesar un pago y actualizar el estado de contrato y espacio de estacionamiento
  async onClickPay() {
    // Verifica si faltan datos y notifica error si es necesario
    if (!this.spaceData || !this.contracService || !this.userFB) {
      this.notyfyService.notify(`Error con los datos`, 'warning', 3000);
      return;
    }

    // Pregunta al usuario si está seguro de continuar con el pago
    const confirmed = await this.dialogService.confirm({
      title: '¡Advertencia!',
      question: '¿Estás seguro de continuar con esta acción?',
      highlight: `Esto realiza cambios al Spot ${this.spaceData.spaceFB.location}`,
      icon: 'fa fa-refresh',
    });

    // Si el usuario confirma, procesa la transacción
    if (confirmed) {
      this.loadingService.open('Realizando la Transacción, espere un momento');

      const contractUpdate = { ...this.contractFB };
      const spaceOfParking = { ...this.spaceData!.spaceFB };
      const contracID = this.spaceData!.spaceFB.idFBManagement;
      const spaceID = this.spaceData!.spaceFB.location;

      spaceOfParking.state = 'Y';
      spaceOfParking.idFBCliente = '';
      spaceOfParking.idFBManagement = '';
      contractUpdate.state = 'I';

      try {
        // Dependiendo del tipo de contrato, se realizan distintas actualizaciones
        if (this.contractFB?.type === 'M') {
          await this.contracService.updatoContract(contracID, contractUpdate);
          await this.spotService.updateParkigSpace(spaceID, spaceOfParking);
        } else if (this.contractFB?.type === 'R') {
          const startDate = new Date(
            (this.contractFB?.startDate as any).seconds * 1000
          );
          const costTotal = this.calculateCost(
            startDate,
            this.contractFB?.rate.timeUnit!,
            this.contractFB?.rate.quantity!,
            this.contractFB?.rate.unitRate!
          );

          // Calcula el costo total y actualiza el contrato
          contractUpdate.totalPrice = costTotal;
          contractUpdate.endDate = new Date(Date.now());

          await this.contracService.updatoContract(contracID, contractUpdate);
          await this.spotService.updateParkigSpace(spaceID, spaceOfParking);
        }

        // Reinicia los datos y notifica al usuario
        this.spaceData = null;
        this.userFB = null;
        this.contractFB = null;
        this.totalPrice = 0;
        this.loadingService.closeDialog();
        this.eventReloadMatriz.emit();
      } catch (e) {
        this.loadingService.updateTransactionStatus(
          'error',
          'Error en la transacción',
          ('Error: ' + e) as string
        );
      }
    } else {
      this.notyfyService.notify(`Operación cancelada`, 'info', 3000);
    }
  }

  calculateCost(
    startDate: Date,
    timeUnit: string,
    unitValue: number,
    ratePerUnit: number
  ): number {
    // Obtiene la fecha y hora actual
    const now: Date = new Date();

    // Calcula el tiempo transcurrido en milisegundos
    const elapsedMilliseconds: number = now.getTime() - startDate.getTime();

    // Si el tiempo transcurrido es negativo (lo que indica que startDate es en el futuro), devuelve 0
    if (elapsedMilliseconds < 0) {
      return 0;
    }

    // Convierte los milisegundos a minutos
    const elapsedMinutes: number = elapsedMilliseconds / (1000 * 60);

    // Declaración de la variable totalUnits para almacenar el número de unidades
    let totalUnits: number;

    // Calcula el número total de unidades basándose en la unidad de tiempo
    if (timeUnit === 'minutes') {
      totalUnits = Math.ceil(elapsedMinutes / unitValue);
    } else if (timeUnit === 'hours') {
      totalUnits = Math.ceil(elapsedMinutes / (unitValue * 60));
    } else {
      // Si no es 'minutes' ni 'hours', retorna 0
      return 0.0;
    }

    // Calcula el costo total multiplicando las unidades por la tarifa por unidad
    const totalCost: number = totalUnits * ratePerUnit;

    // Retorna el costo total redondeado a 2 decimales
    return Number(totalCost.toFixed(2));
  }
}
