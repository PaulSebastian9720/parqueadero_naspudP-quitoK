import { Component,  ViewChild } from '@angular/core';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { MatrixSpacesComponent } from "../../../../shared/components/matrix-spaces/matrix-spaces.component";
import { SpaceData } from '../../../../core/models/space';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { CreateContractComponent } from "../../components/create-contract/create-contract.component";
import { UserData } from '../../../../core/models/user';
import { SelectUserComponent } from "../../../../shared/components/select-user/select-user.component";
import { SelectRateComponent } from "../../components/select-rate/select-rate.component";
import { RateData } from '../../../../core/models/rate';

@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [HeaderServiceComponent, MatrixSpacesComponent, CommonModule, FormsModule, CreateContractComponent, SelectUserComponent, SelectRateComponent],
  templateUrl: './contract-management.component.html',
})
export class ContractManagementComponent {
  
  userFb! : UserData | null
  spaceFB! : SpaceData | null
  rateFb! : RateData | null

  @ViewChild('mapaSpaces') mapa!: MatrixSpacesComponent

  onClickUser(userData : UserData){
    this.userFb = userData
  }

  onClickRate(rateData : RateData){
    this.rateFb = rateData
  }
   
  onClinkSpace(space: SpaceData) {
    this.spaceFB = space
  }
  
  updateMap(){
    this.userFb = null
    this.spaceFB = null
    this.mapa.initParkingLotService()
  }
}
