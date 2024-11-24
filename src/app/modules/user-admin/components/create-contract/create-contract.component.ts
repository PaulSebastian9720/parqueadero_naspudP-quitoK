import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserData } from '../../../../core/models/user';
import { CommonModule } from '@angular/common';
import { SpaceData, SpaceFB } from '../../../../core/models/space';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { ManagementFB } from '../../../../core/models/management';
import { ParkinLotService } from '../../../../shared/services/space/parkink-lot.service';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { RateData } from '../../../../core/models/rate';
import { Automobile } from '../../../../core/models/automobile';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { LoadingService } from '../../../../shared/services/dialog/dialogLoading.service';

@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-contract.component.html',
})
export class CreateContractComponent implements OnChanges {

  // Propiedades de entrada y salida del componente
  @Input() userData!: UserData | null;  // Datos del usuario recibidos como entrada, pueden ser nulos si no hay usuario.
  @Input() spaceData!: SpaceData | null;  // Datos del espacio recibido como entrada, puede ser nulo si no hay espacio.
  @Input() rateData!: RateData | null;  // Datos de la tarifa recibidos como entrada, puede ser nulo si no se selecciona tarifa.
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
    if (!this.rateData) return '--/--/----';  // Si no hay datos de tarifa, retorna fecha no válida.
    return this.formatDate(this.endDate);  // Formatea y retorna la fecha de finalización.
  }

  /**
   * Método que retorna un mensaje sobre el estado del espacio.
   * Retorna 'Disponible', 'No disponible' u 'Ocupado' dependiendo del estado del espacio.
   */
  getMenssage(): string {
    if (!this.spaceData) return '';  // Si no hay datos de espacio, retorna cadena vacía.
    if (this.spaceData.spaceFB.state === 'Y') {
      return 'Disponible';  // Espacio disponible.
    } else if (this.spaceData.spaceFB.state === 'N') {
      return 'No disponible';  // Espacio no disponible.
    } else {
      return 'Ocupado';  // Espacio ocupado.
    }
  }

  /**
   * Método que ajusta la fecha de finalización sumando o restando meses.
   * Cambia el precio dependiendo de los meses seleccionados.
   */
  onClickButtonML(months: number) {
    if (!this.rateData) return;  // Si no hay datos de tarifa, no hace nada.
    if (this.endDate.getTime() === this.startDate.getTime() && months < 0) return;  // No permite reducir la fecha si no hay un mes completo.
    this.endDate.setMonth(this.endDate.getMonth() + months);  // Ajusta la fecha de finalización.
    // Cambia el precio sumando o restando según los meses seleccionados.
    this.price = months > 0
      ? this.price + this.rateData.rateFB.unitRate
      : this.price - this.rateData.rateFB.unitRate;
  }

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
  async onClickSaveContract() {
    if (!this.userData || !this.spaceData || !this.rateData) {
      this.notyfyService.notify(`Seleccione todos los datos necesarios`, 'info', 4000);  // Notifica si faltan datos.
      return;
    }

    // Verifica que el espacio esté disponible.
    if (this.spaceData.spaceFB.state === 'N' || this.spaceData.spaceFB.state === 'NP' || this.spaceData.spaceFB.state === 'O') {
      this.notyfyService.notify(`El espacio no está disponible`, 'error', 4000);  // Notifica si el espacio no está disponible.
      return;
    }

    // Verifica que la fecha de inicio sea diferente a la de finalización.
    if (this.endDate.getTime() === this.startDate.getTime()) {
      this.notyfyService.notify(`Seleccione por lo menos un mes`, 'warning', 3000);  // Notifica si no se selecciona un mes completo.
      return;
    }

    try {
      // Abre el diálogo de carga mientras se procesa la transacción.
      this.loadingService.open("Realizando la Transacción, espere un momento");
      
      const userID: string = this.userData.crendentialUserUID;  // Obtiene el ID del usuario.
      const userFB = await this.userService.getUser(userID);  // Obtiene los datos del usuario desde Firebase.
      const idUserForManagent = this.userData.crendentialUserUID.slice(0, 4);  // Genera un ID para la gestión del contrato.
      const managementId: string = `man-${idUserForManagent}-${userFB?.listManagement?.length}`;  // Crea un ID único para la gestión del contrato.

      // Define los datos del automóvil (si hay).
      const automobile = this.automobile
        ? { id: this.automobile.id, plate: this.automobile.plate, brand: this.automobile.brand, model: this.automobile.model }
        : { id: "0000", plate: "aaaa-1111", brand: "GENERICO", model: "GENERICO" };

      // Crea el contrato en Firebase.
      const contractFb = new ManagementFB(
        "M", 
        userID, 
        this.startDate, 
        this.endDate, 
        this.price, 
        "A", 
        this.spaceData.id, 
        this.rateData.rateFB, 
        [], 
        automobile
      );

      // Actualiza los datos del espacio en Firebase.
      const spaceUpdate = new SpaceFB(
        this.spaceData.spaceFB.location,
        'N',
        userID,
        managementId
      );

      // Realiza las operaciones de creación y actualización.
      await this.contractService.createContract(managementId, contractFb);  // Crea el contrato.
      userFB?.listManagement?.push(managementId);  // Añade el ID de la gestión a la lista del usuario.
      await this.userService.updateUser(userID, userFB!);  // Actualiza los datos del usuario.
      await this.parkinkLot.updateParkigSpace(
        this.spaceData.spaceFB.location,
        spaceUpdate
      );  // Actualiza el espacio de parqueo.

      // Emite el evento de actualización del mapa y resetea los datos.
      this.updateMapEvent.emit();  
      this.userData = null;
      this.spaceData = null;
      this.automobile = null;
      this.rateData = null;

      // Cierra el diálogo de carga y notifica el éxito.
      this.loadingService.closeDialog();
      this.notyfyService.notify(`Transacción realizada con éxito`, 'success', 3000);

    } catch (e) {
      // En caso de error, actualiza el estado de la transacción y notifica el error.
      this.loadingService.updateTransactionStatus("error", "Transacción errónea", "Error: " + e as string);
      this.notyfyService.notify(`Al parecer hubo un error`, 'error', 3000);
    }
  }
}
