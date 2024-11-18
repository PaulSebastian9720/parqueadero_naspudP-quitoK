import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SpaceData } from '../../../../core/models/space';
import { UserData, UserFB } from '../../../../core/models/user';
import { ManagementData, ManagementFB } from '../../../../core/models/management';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { ContractManFBService } from '../../../../shared/services/contract-management/contract-manfb.service';
import { ParkinLotService } from '../../../../shared/services/space/parkink-lot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-spot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-spot.component.html',
})
export class EditSpotComponent implements OnChanges  {
 
  @Input() spaceData!: SpaceData
  userFB!: UserFB | null
  contractFB!: ManagementFB | null


  constructor(
    private userService: UserfbService, 
    private contracService: ContractManFBService,
    private spotService: ParkinLotService
  ){}
  async ngOnChanges(changes: SimpleChanges): Promise<void> {

    if(changes["spaceData"] && changes["spaceData"].currentValue){
      if(!this.spaceData) return
      if(this.spaceData.spaceFB.state === "Y") return
      this.reloadData()
    }
   
  }


  async reloadData(){
    try {
      const userUID = this.spaceData.spaceFB.idFBCliente
      const contractID = this.spaceData.spaceFB.idFBManagement
      this.userFB = await this.userService.getUser(userUID)
      this.contractFB = await this.contracService.getContract(contractID)
    }catch(e){
      console.error('Error al cargar datos del parqueadero o cliente' ,e);
      return;
    }
  }

  formatDate(firebaseTimestamp: any): string {
    if (!firebaseTimestamp || !firebaseTimestamp.seconds) {
        return "00/00/0000";
    }

    const dateC = new Date(firebaseTimestamp.seconds * 1000); 

    const date = new Date(dateC);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');

    return `${day}/${month}/${year}  ${hour}h:${minute}m`;
    
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
      return 'Dispnible';
    } else if (this.spaceData.spaceFB.state === 'N') {
      return 'No disponible';
    } else {
      return 'Ocupado';
    }
  }

  
  
  onClickSaveContract(){

  }

}
