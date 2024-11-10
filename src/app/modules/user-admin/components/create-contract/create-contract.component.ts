import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserData } from '../../../../core/models/user';
import { CommonModule } from '@angular/common';
import { SpaceData, SpaceFB } from '../../../../core/models/space';
import { ClientFBService } from '../../../../shared/services/client/clientfb.service';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { ManagementFB } from '../../../../core/models/management';
import { ClientFB } from '../../../../core/models/client';
import { ParkinLotService } from '../../../../shared/services/space/parkink-lot.service';

@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-contract.component.html',
})
export class CreateContractComponent {
  @Input() userData !: UserData | null
  @Input() spaceData !: SpaceData | null  
  @Output() updateMapEvent = new EventEmitter<void>()


  constructor(
    private clientService: ClientFBService,
    private contractService: ContractManFBService,
    private parkinkLot: ParkinLotService
  ){}

  price : number = 0

  startDate = new Date()
  endDate = new Date()

  getStartDate(){
    return this.formatDate(this.startDate)
  }

  getEndDate(){
    if (!this.userData || !this.spaceData) return "--/--/----"
    return this.formatDate(this.endDate)
  }

  onClickButtonML( monts: number ) {
    if (!this.userData ||!this.spaceData) return
    if(this.endDate.getTime() === this.startDate.getTime() && monts < 0) return
    this.endDate.setMonth(this.endDate.getMonth() + monts)
    this.price = monts > 0 ? (this.price + 35) : (this.price - 35)
  }

  private formatDate(dateC :Date): string {
      const date = new Date(dateC)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${day}/${month}/${year}`  
  }
  
  async onClickSaveContract(){

    if(!this.userData || !this.spaceData){
      console.log("Faltas los datos")
      return
    }
    if(!this.spaceData.spaceFB.isAvailable) {
      console.log("El espacio no esta disponible, ya esta ocupado")
      return
    }
    if(this.endDate.getTime() === this.startDate.getTime()){ 
      console.log("Seleccione por lo menos un mes")
      return
    }

    try {
      const clientId : string = `cli-${this.userData.crendentialUserUID}`
      const existCient = await this.clientService.clientExists(clientId)
      console.log(existCient ? "ExistCient": "No existe creara")
      if (!existCient){
        const clientFB : ClientFB = {
          fbUIUser: this.userData.crendentialUserUID,
          fbUIManagementList: [],
          listAutomobile: []
        }
        this.clientService.createClient(clientId, clientFB)
        console.log("cliente creado")
      } 

      const clientFb = await this.clientService.getClient(clientId)
      console.log("cliente obtenido")
      const managementId : string = `man-${this.userData.crendentialUserUID}-${clientFb?.fbUIManagementList?.length}`

      const contractFb = new ManagementFB  (
        clientId,
        this.startDate,
        this.endDate,
        this.price,
        true,
        this.spaceData.id,
        []
      )

      const spaceUpdat = new  SpaceFB(
         this.spaceData.spaceFB.location,
         false,
         clientId,
         managementId
      )

      await this.contractService.createContract(managementId,contractFb)
      console.log("contract created")
      clientFb?.fbUIManagementList?.push(managementId)
      await this.clientService.updateClient(clientId,clientFb!)
      console.log("client updated")
      await this.parkinkLot.updateParkigSpace(this.spaceData.spaceFB.location, spaceUpdat)
      console.log("space updated")
      this.updateMapEvent.emit()
      this.userData = null
      this.spaceData = null
      

    } catch (e) {
      console.error("Error ", e)
    }   
  }
}
