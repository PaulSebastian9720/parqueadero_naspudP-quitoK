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
    private dialog: MatDialog
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
      console.log(letterRow)
      if(letterRow !== ""){
        console.log("add new spot", letterRow)
        this.parkingLotService.addNewSpot(letterRow!)
        this.reloadParkingLot()
        this.dialog.closeAll()
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
      }
    })
  }
  
    
}
