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

@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-contract.component.html',
})
export class CreateContractComponent implements OnChanges{
  @Input() userData!: UserData | null;
  @Input() spaceData!: SpaceData | null;
  @Input() rateData!: RateData | null;
  @Input() automobile!: Automobile | null 
  @Output() updateMapEvent = new EventEmitter<void>();
  price: number = 0

  startDate = new Date()
  endDate = new Date()

  constructor(
    private userService: UserfbService,
    private contractService: ContractManFBService,
    private parkinkLot: ParkinLotService
  ) {}

 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rateData'] && changes['rateData'].currentValue) {
      this.price = 0
    }
  }

  getStartDate() {
    return this.formatDate(this.startDate)
  }

  getEndDate() {
    if (!this.rateData)
      return '--/--/----'
    return this.formatDate(this.endDate)
  }

  getMenssage(): string {
    if (!this.spaceData) return ''
    if (this.spaceData.spaceFB.state === 'Y') {
      return 'Dispnible'
    } else if (this.spaceData.spaceFB.state === 'N') {
      return 'No disponible'
    } else {
      return 'Ocupado'
    }
  }

  onClickButtonML(months: number) {
    if ( !this.rateData) return
    if (this.endDate.getTime() === this.startDate.getTime() && months < 0)
      return
    this.endDate.setMonth(this.endDate.getMonth() + months)
    this.price =
      months > 0
        ? this.price + this.rateData.rateFB.unitRate
        : this.price - this.rateData.rateFB.unitRate
  }

  private formatDate(dateC: Date): string {
    const date = new Date(dateC)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  async onClickSaveContract() {
    if (!this.userData || !this.spaceData || !this.rateData) {
      console.log('Faltas los datos');
      return;
    }

    if (
      this.spaceData.spaceFB.state === 'N' ||
      this.spaceData.spaceFB.state === 'NP'
    ) {
      console.log('El espacio no esta disponible, ya esta ocupado');
      return;
    }
    if (this.endDate.getTime() === this.startDate.getTime()) {
      console.log('Seleccione por lo menos un mes');
      return;
    }

    if (this.spaceData.spaceFB.state === 'O') {
      console.log(
        'El espacio esta ocupado, pero dispnible proximanente desea ocuparlo'
      )
    }

    try {
      const userID: string = this.userData.crendentialUserUID;
      const userFB = await this.userService.getUser(userID);
      const idUserForManagent = this.userData.crendentialUserUID.slice(0, 4);
      const managementId: string = `man-${idUserForManagent}-${userFB?.listManagement?.length}`

      const automobile = 
        this.automobile? {id :this.automobile.id, plate : this.automobile.plate, brand :this.automobile.brand, model :this.automobile.model}:
        {id :"0000", plate : "aaaa-1111", brand: "GENERICO", model: "GENERICO"}

      const contractFb = new ManagementFB(
        "M",
        userID,
        this.startDate,
        this.endDate,
        this.price,
        true,
        this.spaceData.id,
        [],
        automobile
      )

      console.log(contractFb.autmobile)

      const spaceUpdate =  new SpaceFB(
        this.spaceData.spaceFB.location,
        'N',
        userID,
        managementId
      )

      await this.contractService.createContract(managementId, contractFb)
      console.log('contract created')
      userFB?.listManagement?.push(managementId)
      await this.userService.updateUser(userID, userFB!)
      console.log('client updated')
      await this.parkinkLot.updateParkigSpace(
        this.spaceData.spaceFB.location,
        spaceUpdate
      )
      console.log('space updated')
      this.updateMapEvent.emit()
      this.userData = null
      this.spaceData = null
      this.automobile = null
      this.rateData = null
    } catch (e) {
      console.error('Error ', e)
    }
  }
}
