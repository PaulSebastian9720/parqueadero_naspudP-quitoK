import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParkinLotService } from '../../../../../shared/services/space/parkink-lot.service';
import { SpaceData } from '../../../../../core/models/space';
import { filter, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-state',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-state.component.html',
})
export class UpdateStateComponent {
  spaceDataSelect!: SpaceData;
  selectRow = 0;
  selectSpaceId = '';
  listRows: number[] = [0, 1, 2, 3, 4, 5, 6];
  mapSlotFilter : SpaceData[][]= []
  listRowPosibilies: SpaceData[] = [];
  @Input() mapSlot!: SpaceData[][];
  @Output() sendSlot = new EventEmitter<SpaceData>();


  fromCharCode(index: number) {
    return String.fromCharCode(65 + index);
  }


  filterForEnable(){
    if(!this.mapSlot)return
    this.mapSlot.forEach((row)=> {
      const rowData : SpaceData [] = []
      row.forEach((space)=> {
        if (space.spaceFB.state === "Y") {
          rowData.push(space)
        }
      })
      this.mapSlotFilter.push(rowData)
    })
  }

  filterForddDisable(){
    if(!this.mapSlot)return
    this.mapSlot.forEach((row)=> {
      const rowData : SpaceData [] = []
      row.forEach((space)=> {
        if (space.spaceFB.state === "NP") {
          rowData.push(space)
        }
      })
      this.mapSlotFilter.push(rowData)
    })
  }


  selcetRowList() {
    this.listRowPosibilies = this.mapSlotFilter[this.selectRow];
  }

  selectSpace() {
    const space = this.listRowPosibilies.find(
      (value) => value.spaceFB.location === this.selectSpaceId
    );
    this.spaceDataSelect = {...space!}
  }

  onSendData(){
    if(!this.mapSlot || !this.spaceDataSelect)return
    this.sendSlot.emit(this.spaceDataSelect)
  }
}
