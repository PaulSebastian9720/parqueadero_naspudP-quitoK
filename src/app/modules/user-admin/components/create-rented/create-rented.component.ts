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

@Component({
  selector: 'app-create-rented',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-rented.component.html',
})
export class CreateRentedComponent implements OnChanges {
  @Input() userData!: UserData | null;
  @Input() spaceData!: SpaceData | null;
  @Input() rateData!: RateData | null;
  @Input() automobile!: Automobile | null;
  @Output() updateMapEvent = new EventEmitter<void>();
  price: number = 0;
  startDate = new Date();
  endDate = new Date();
  constructor(
    private userService: UserfbService,
    private contractService: ContractManFBService,
    private parkinkLot: ParkinLotService,
    private notyfyService: NotificationService

  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rateData'] && changes['rateData'].currentValue) {
      this.price = 0
    }
  }

  getStartDate() {
    return this.formatDate(this.startDate);
  }

  getEndDate() {
    if (!this.rateData)
      return '--/--/---- --h/--';
    return this.formatDate(this.endDate);
  }

  getNameSpanish(timeUnit: string, quantity: number): string{
    this
    if(timeUnit === "month"){
      return `${quantity} ${quantity > 1 ? "Meses" : "Mes"}`
    }else if (timeUnit === "days"){
      return  `${quantity} ${quantity > 1 ? "Días" : "Día"}`

    }else if (timeUnit === "hours"){
      return `${quantity} ${quantity > 1 ? "Horas" : "Hora"}`
    }else {
      return `${quantity} ${quantity > 1 ? "Minutos" : "Minuto"}`
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

  onClickButtonML(moreOrLess: 1 | -1): void {
    if ( !this.rateData) return;

    if (moreOrLess < 0 && this.endDate.getTime() === this.startDate.getTime()) return;

    const quantity = this.rateData.rateFB.quantity;

    if (this.rateData.rateFB.timeUnit === 'minutes') {
      this.endDate.setMinutes(this.endDate.getMinutes() + moreOrLess * quantity);
    } else if (this.rateData.rateFB.timeUnit === 'days') {
      this.endDate.setDate(this.endDate.getDate() + moreOrLess * quantity);
    } else {
      this.endDate.setHours(this.endDate.getHours() + moreOrLess * quantity);
    }

    const updatedPrice = this.price + moreOrLess * this.rateData.rateFB.unitRate;
    this.price = Math.max(0, updatedPrice);
  }

  private formatDate(dateC: Date): string {
    const date = new Date(dateC);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');

    return `${day}/${month}/${year} ${hour}h:${minute}`;
  }

  async onClickSaveContract() {
    if (!this.userData || !this.spaceData || !this.rateData) {
      this.notyfyService.notify(`Seleccione todos los datos nescesarios`, 'info', 4000)
      return;
    }

    if (
      this.spaceData.spaceFB.state === 'N' ||
      this.spaceData.spaceFB.state === 'NP' ||
      this.spaceData.spaceFB.state === 'O' 
    ) {
      this.notyfyService.notify(`El espacion no esta disponible`, 'error', 4000)
      return;
    }


    try {
      const userID: string = this.userData.crendentialUserUID;
      const userFB = await this.userService.getUser(userID);
      const idUserForManagent = this.userData.crendentialUserUID.slice(0, 4);
      const managementId: string = `man-${idUserForManagent}-${userFB?.listManagement?.length}`;

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
      
      const contractFb = new ManagementFB(
        "R",
        userID,
        this.startDate,
        this.endDate,
        this.rateData.rateFB.quantity,
        "A",
        this.spaceData.id,
        this.rateData.rateFB,
        [],
        automobile
      );

      const spaceUpdate = new SpaceFB(
        this.spaceData.spaceFB.location,
        'O',
        userID,
        managementId
      );

      await this.contractService.createContract(managementId, contractFb);
      userFB?.listManagement?.push(managementId);
      await this.userService.updateUser(userID, userFB!);
      await this.parkinkLot.updateParkigSpace(
        this.spaceData.spaceFB.location,
        spaceUpdate
      );
      this.updateMapEvent.emit();
      this.userData = null;
      this.spaceData = null;
      this.automobile = null;
      this.rateData = null;
      this.notyfyService.notify(`Transacción realizado con exito`, 'success', 3000)

    } catch (e) {
      this.notyfyService.notify(`Al parecer hubo un error`, 'error', 3000)

    }
  }
}
