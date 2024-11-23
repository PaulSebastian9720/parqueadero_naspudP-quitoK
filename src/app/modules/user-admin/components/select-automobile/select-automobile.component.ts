import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Automobile } from '../../../../core/models/automobile';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-select-automobile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-automobile.component.html',
})
export class SelectAutomobileComponent {
  selectAutomovile : string = ''

  @Input() listAutomobile : Automobile[] = []
  @Output() eventAutomobile = new EventEmitter<Automobile>()

  onClickAutmovile(){
    if (!this.selectAutomovile) {
      return
    }
    const rateData = this.listAutomobile.find(value => value.id === this.selectAutomovile)
    this.eventAutomobile.emit(rateData)   
    this.selectAutomovile = '' 
  }

}
