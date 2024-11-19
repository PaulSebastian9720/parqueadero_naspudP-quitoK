import { Component, OnInit, ViewChild } from '@angular/core';
import { MatrixSpacesComponent } from "../../../../shared/components/matrix-spaces/matrix-spaces.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { EditSpotComponent } from "../../components/edit-spot/edit-spot.component";
import { SpaceData } from '../../../../core/models/space';

@Component({
  selector: 'app-space-inventory',
  standalone: true,
  imports: [MatrixSpacesComponent, FormsModule, CommonModule, HeaderServiceComponent, EditSpotComponent, CommonModule],
  templateUrl: './space-inventory.component.html',
})
export class SpaceInventoryComponent implements OnInit{
  spaceData !: SpaceData | null

  @ViewChild("parkingLot") parkingLot ! : MatrixSpacesComponent

  query: string = '';
  results: string[] = [];
  items: string[] = ['Apple', 'Banana', 'Orange', 'Pineapple', 'Strawberry'];

  search() {
    if (this.query) {
      this.results = this.items.filter(item => 
        item.toLowerCase().includes(this.query.toLowerCase())
      );
    } else {
      this.results = [];
    }
  }
  

  reloarParkingLot(){
    this.parkingLot.initParkingLotService()
  }

  editSpot(spaceData: SpaceData): void {
    this.spaceData = spaceData;
  }

  async ngOnInit(): Promise<void> {
   
  }
  
  
}