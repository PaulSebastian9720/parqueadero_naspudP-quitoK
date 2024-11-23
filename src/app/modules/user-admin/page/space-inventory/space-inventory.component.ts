import { Component, OnInit, ViewChild } from '@angular/core';
import { MatrixSpacesComponent } from "../../../../shared/components/matrix-spaces/matrix-spaces.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { EditSpotComponent } from "../../components/edit-spot/edit-spot.component";
import { SpaceData } from '../../../../core/models/space';
import { ParkinLotService } from '../../../../shared/services/space/parkink-lot.service';
import { MatDialog } from '@angular/material/dialog';
import { AddSpotComponent } from '../../components/opciones-spot/add-spot/add-spot.component';
import { UpdateStateComponent } from '../../components/opciones-spot/update-state/update-state.component';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';

@Component({
  selector: 'app-space-inventory',
  standalone: true,
  imports: [MatrixSpacesComponent, FormsModule, CommonModule, HeaderServiceComponent, EditSpotComponent, CommonModule],
  templateUrl: './space-inventory.component.html',
})
export class SpaceInventoryComponent {
  spaceData !: SpaceData | null

  @ViewChild("parkingLot") parkingLot ! : MatrixSpacesComponent
  

  constructor(
    private parkingLotService: ParkinLotService,
    private dialog: MatDialog,
    private notyfyService: NotificationService
  ){}

  reloadParkingLot(){
    this.parkingLot.initParkingLotService()
  }

  editSpot(spaceData: SpaceData): void {
    this.spaceData = spaceData;
  }


  addSpot(){
    const dialogRef = this.dialog.open(AddSpotComponent)
    const instance = dialogRef.componentInstance
    instance.sendLetterRow.subscribe((letterRow : string)=> {
      if(letterRow !== ""){
        this.parkingLotService.addNewSpot(letterRow!)
        this.reloadParkingLot()
        this.dialog.closeAll()
        this.notyfyService.notify(`Nuevo Spot en la ROW-${letterRow}`, 'info', 3000)
      }
    })
   
  }


  onDisable(){
    const dialogRef = this.dialog.open(UpdateStateComponent)
    const instance = dialogRef.componentInstance
    instance.mapSlot = this.parkingLot.matrizSpaces.slice(1, 8)
    instance.filterForddDisable()
    instance.sendSlot.subscribe((slot)=>{
      if(slot.spaceFB.state === "NP"){
        const space = {...slot}
        space.spaceFB.state = "Y"
        this.parkingLotService.updateParkigSpace(space.spaceFB.location,space.spaceFB)
        this.reloadParkingLot()
        this.dialog.closeAll()
        this.notyfyService.notify(`Habilitado ${slot.spaceFB.location}`, 'success', 3000)

      }
    })
  }

  onEnable(){
    const dialogRef = this.dialog.open(UpdateStateComponent)
    const instance = dialogRef.componentInstance
    instance.mapSlot = this.parkingLot.matrizSpaces.slice(1, 8)
    instance.filterForEnable()
    instance.sendSlot.subscribe((slot)=>{
      if(slot.spaceFB.state === "Y"){
        const space = {...slot}
        space.spaceFB.state = "NP"
        this.parkingLotService.updateParkigSpace(space.spaceFB.location,space.spaceFB)
        this.reloadParkingLot()
        this.dialog.closeAll()
        this.notyfyService.notify(`Desabilitado ${slot.spaceFB.location}`, 'warning', 3000)
      }
    })
  }
  
    
}
