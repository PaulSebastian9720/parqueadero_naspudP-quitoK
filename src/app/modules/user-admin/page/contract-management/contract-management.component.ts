import { Component, ViewChild } from '@angular/core';
import { HeaderServiceComponent } from '../../../../shared/components/header-service/header-service.component';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { SpaceData } from '../../../../core/models/space';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { CreateContractComponent } from '../../components/create-contract/create-contract.component';
import { UserData } from '../../../../core/models/user';
import { SelectUserComponent } from '../../../../shared/components/select-user/select-user.component';
import { SelectRateComponent } from '../../components/select-rate/select-rate.component';
import { RateData } from '../../../../core/models/rate';
import { MatDialog } from '@angular/material/dialog'; // Importa aquí
import { EditRateComponent } from '../../components/edit-rate/edit-rate.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectAutomobileComponent } from "../../components/select-automobile/select-automobile.component";
import { FormAutomovileComponent } from '../../../../shared/components/form-automovile/form-automovile.component';
import { Automobile } from '../../../../core/models/automobile';
import { CreateRentedComponent } from "../../components/create-rented/create-rented.component";
import { race } from 'rxjs';


@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [
    HeaderServiceComponent,
    MatrixSpacesComponent,
    CommonModule,
    FormsModule,
    CreateContractComponent,
    SelectUserComponent,
    SelectRateComponent,
    MatToolbarModule,
    SelectAutomobileComponent,
    CreateRentedComponent
],
  templateUrl: './contract-management.component.html',
})
export class ContractManagementComponent {
  
  userFb!: UserData | null
  spaceFB!: SpaceData | null
  rateFb!: RateData | null
  isSelected1 = true
  isSelected2 = false 
  filterList = true
  automobile!: Automobile | null

  @ViewChild('mapaSpaces') mapa!: MatrixSpacesComponent
  @ViewChild('selecttarifa') selectTarifa!: SelectRateComponent
  @ViewChild('selectUser') selectUser!: SelectUserComponent

  constructor(private dialog: MatDialog) {}

  selectOption(option: number) {
    if (option === 1) {
      this.isSelected1 = true
      this.isSelected2 = false
      this.selectTarifa.listFilter = this.selectTarifa.
        listRate.filter(value => value.rateFB.timeUnit === 'month')
      this.selectUser.listUserFBFilter = this.selectUser.
        listUserFb.filter(value => value.user.rol !== "CF")

    } else if (option === 2) {
      this.isSelected1 = false
      this.isSelected2 = true
      this.selectTarifa.listFilter = this.selectTarifa.
        listRate.filter(value => value.rateFB.timeUnit !== 'month')
        this.selectTarifa.listFilter = this.selectTarifa.
        listRate.filter(value => value.rateFB.timeUnit === 'month')
      this.selectUser.listUserFBFilter = this.selectUser.listUserFb
    }
    this.rateFb = null
    this.userFb = null
    this.spaceFB = null
  }

  onClickUser(userData: UserData) {
    this.userFb = userData
    this.automobile = null
  }

  onClickRate(rateData: RateData) {
    this.rateFb = rateData
  }

  onClinkSpace(space: SpaceData) {
    this.spaceFB = space
  }

  onClinkAutomobile(automobile: Automobile) {
    this.automobile = automobile

  }

  onAddRate() {
    const dialogRef = this.dialog.open(EditRateComponent)

    const instance = dialogRef.componentInstance

    instance.eventUpdateRates.subscribe(()=>{
      this.selectTarifa.initrates()
      this.dialog.closeAll()
    })
  }

  onAddAutomovile() {
    if(!this.userFb) return
    const dialogRef = this.dialog.open(FormAutomovileComponent)
    const instance = dialogRef.componentInstance
    instance.userData = this.userFb!
    instance.eventUpateUser.subscribe(()=>{
      this.selectUser.initListUsers()
      this.selectUser.selectedUser = ""
      this.userFb = null
      this.dialog.closeAll()
    })
  }

  updateMap() {
    this.userFb = null;
    this.spaceFB = null;
    this.mapa.initParkingLotService();
  }
}
