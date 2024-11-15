import { Component, OnInit } from '@angular/core';
import { MatrixSpacesComponent } from "../../../../shared/components/matrix-spaces/matrix-spaces.component";
import { InfoSpaceComponent } from "../../components/info-space/info-space.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";

@Component({
  selector: 'app-space-inventory',
  standalone: true,
  imports: [MatrixSpacesComponent, InfoSpaceComponent, FormsModule, CommonModule, HeaderServiceComponent],
  templateUrl: './space-inventory.component.html',
})
export class SpaceInventoryComponent implements OnInit  {

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

  async ngOnInit(): Promise<void> {
   
  }
  
  
}