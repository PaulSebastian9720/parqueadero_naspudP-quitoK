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
import { Timestamp } from '@angular/fire/firestore';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { LoadingService } from '../../../../shared/services/dialog/dialogLoading.service';

@Component({
  selector: 'app-edit-spot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-spot.component.html',
})
export class EditSpotComponent implements OnChanges {
  @Input() spaceData!: SpaceData | null;
  userFB!: UserFB | null;
  contractFB!: ManagementFB | null;
  dateToday!: Date;
  totalPrice!: number;
  @Output() eventReloadMatriz = new EventEmitter<void>();

  constructor(
    private userService: UserfbService,
    private contracService: ContractManFBService,
    private spotService: ParkinLotService,
    private dialogService: DialogService,
    private notyfyService: NotificationService,
    private loadingService: LoadingService

  ) {}


  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (!this.spaceData) return;
    if (changes['spaceData'] && changes['spaceData'].currentValue) {
      this.notyfyService.notify(`Spot seleccionado ${this.spaceData.spaceFB.location}`, 'info', 3000)
      if (this.spaceData.spaceFB.state === 'Y') {
        this.userFB = null;
        this.contractFB = null;
        return;
      }
      await this.reloadData();
      if(this.contractFB?.type === 'R'){
      const startDate =  new Date((this.contractFB?.startDate as any).seconds * 1000)
      this.totalPrice =this.calculateCost(
                startDate, this.contractFB?.rate.timeUnit!,
                this.contractFB?.rate.quantity!, 
                this.contractFB?.rate.unitRate!
      )} 
    }
  }

  async reloadData() {
    try {
      const userUID = this.spaceData!.spaceFB.idFBCliente;
      const contractID = this.spaceData!.spaceFB.idFBManagement;
      this.userFB = await this.userService.getUser(userUID);
      this.contractFB = await this.contracService.getContract(contractID);
    } catch (e) {}
  }

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

  formateToday() {
    this.dateToday = new Date(Date.now());
    const year = this.dateToday.getFullYear();
    const month = String(this.dateToday.getMonth() + 1).padStart(2, '0');
    const day = String(this.dateToday.getDate()).padStart(2, '0');
    const minute = String(this.dateToday.getMinutes()).padStart(2, '0');
    const hour = String(this.dateToday.getHours()).padStart(2, '0');
    return `${day}/${month}/${year}  ${hour}h:${minute}m`;
  }

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

  async onClickPay() {
    if (!this.spaceData || !this.contracService || !this.userFB) {
      this.notyfyService.notify(`Error con los datos`, 'warning', 3000);
      return;
    }
  
    const confirmed = await this.dialogService.confirm({
      title: '¡Advertencia!',
      question: '¿Estás seguro de continuar con esta acción?',
      highlight: `Esto realiza cambios al Spot ${this.spaceData.spaceFB.location}`,
      icon: 'fa fa-refresh',
    });
  
    if (confirmed) {
      this.loadingService.open("Realizando la Transacción, espere un momento");
  
      const contractUpdate = { ...this.contractFB };
      const spaceOfParking = { ...this.spaceData!.spaceFB };
      const contracID = this.spaceData!.spaceFB.idFBManagement;
      const spaceID = this.spaceData!.spaceFB.location;
  
      spaceOfParking.state = 'Y';
      spaceOfParking.idFBCliente = '';
      spaceOfParking.idFBManagement = '';
      contractUpdate.state = 'I';
  
      try {
        if (this.contractFB?.type === 'M') {
          await this.contracService.updatoContract(contracID, contractUpdate);
          await this.spotService.updateParkigSpace(spaceID, spaceOfParking);
        } 
        else if (this.contractFB?.type === 'R') {
          const startDate = new Date((this.contractFB?.startDate as any).seconds * 1000);
          const costTotal = this.calculateCost(
            startDate,
            this.contractFB?.rate.timeUnit!,
            this.contractFB?.rate.quantity!,
            this.contractFB?.rate.unitRate!
          );
  
          contractUpdate.totalPrice = costTotal;
          contractUpdate.endDate = new Date(Date.now());
  
          await this.contracService.updatoContract(contracID, contractUpdate);
          await this.spotService.updateParkigSpace(spaceID, spaceOfParking);
        }
        this.spaceData = null;
        this.userFB = null;
        this.contractFB = null;
        this.totalPrice = 0;
        this.eventReloadMatriz.emit();

        this.loadingService.closeDialog();
  
      } catch (e) {
        this.loadingService.updateTransactionStatus("error", "Transaccion erronea", "Error: " + e as string)
        this.notyfyService.notify("Hubo un error en la transacción", 'error', 5000);
      }
    } else {
      this.notyfyService.notify("No se realizaron cambios", 'warning', 5000);
    }
  }
  

  calculateCost(
    startDate: Date, 
    timeUnit: string, 
    unitValue: number, 
    ratePerUnit: number 
): number {
    const now: Date = new Date();

    const elapsedMilliseconds: number = now.getTime() - startDate.getTime();

    if (elapsedMilliseconds < 0) {
        return 0;
    }

    const elapsedMinutes: number = elapsedMilliseconds / (1000 * 60);

    let totalUnits: number;
    if (timeUnit === "minutes") {
        totalUnits = Math.ceil(elapsedMinutes / unitValue);
    } else if (timeUnit === "hours") {
        totalUnits = Math.ceil(elapsedMinutes / (unitValue * 60));
    } else {
        return 0.00
    }

    const totalCost: number = totalUnits * ratePerUnit;
    
    return Number(totalCost.toFixed(2));
}
}
