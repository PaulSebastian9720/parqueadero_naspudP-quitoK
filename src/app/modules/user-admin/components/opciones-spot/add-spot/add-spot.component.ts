import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ParkinLotService } from '../../../../../shared/services/space/parkink-lot.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-spot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-spot.component.html',
})
export class AddSpotComponent {
  listRows = ["A", "B", "C", "D", "E", "F", "G"]
  selectRow = ""
  @Output() sendLetterRow = new EventEmitter<string>();
  
  onAddSpot(){
    if(this.selectRow === "") return
    this.sendLetterRow.emit(this.selectRow)
  }
}
