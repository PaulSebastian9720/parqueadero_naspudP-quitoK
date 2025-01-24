import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
  import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-spot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-spot.component.html',
})
export class AddSpotComponent {
  // Lista de filas disponibles para seleccionar
  listRows = ["A", "B", "C", "D", "E", "F", "G"];

  // Fila seleccionada
  selectRow = "";

  // Evento de salida para enviar la fila seleccionada
  @Output() sendLetterRow = new EventEmitter<string>();

  // Método para agregar un espacio
  onAddSpot() {
    // Si no se ha seleccionado una fila, no hacer nada
    if (this.selectRow === "") return;

    // Emitir el valor de la fila seleccionada
    this.sendLetterRow.emit(this.selectRow);
  }
}

