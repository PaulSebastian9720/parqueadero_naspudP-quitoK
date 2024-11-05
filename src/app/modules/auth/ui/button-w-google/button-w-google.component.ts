import { Component, EventEmitter, Output, output } from '@angular/core';

@Component({
  selector: 'app-button-w-google',
  standalone: true,
  imports: [],
  templateUrl: './button-w-google.component.html',
  styles: ``
})
export class ButtonWGoogleComponent {
  @Output() onClickEvent: EventEmitter<void> = new EventEmitter()

  onClick(){
    this.onClickEvent.emit()
  }
}
