import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-spot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-spot.component.html',
})
export class AddSpotComponent {
  selectRow = '';
  formLength: number = 1;

  @Input() length: number = 0;
  @Output() sendLetterRow = new EventEmitter<{ row: string; length: number }>();

  onAddSpot() {
    if (this.selectRow === '') return;
    const caseRow = this.selectRow === "NR" ? this.selectRow : `RW${this.selectRow}`

    this.sendLetterRow.emit(
      {
        row: caseRow,
        length: this.formLength,
      }
    );
  }

  getArray() {
    return Array.from({ length: this.length }, (_, i) =>
      String.fromCharCode(65 + i)
    );
  }
}
