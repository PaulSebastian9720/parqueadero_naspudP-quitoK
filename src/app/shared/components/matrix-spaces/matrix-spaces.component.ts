import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SpaceData,  } from '../../../core/models/space';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { ParkinLotService } from '../../services/space/parkink-lot.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@Component({
  selector: 'app-matrix-spaces',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './matrix-spaces.component.html',
})
export class MatrixSpacesComponent implements OnInit {
  matrizSpaces!: SpaceData[][];  // Matriz que contiene los datos de los espacios de estacionamiento
  @Output() eventEmitrSpace = new EventEmitter<SpaceData>();  // Emite un evento con la información del espacio seleccionado
  isLoading: boolean = true;  // Estado que indica si los datos están cargando

  constructor(private parkingLotService: ParkinLotService) {}

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Llama a 'initParkingLotService' para obtener la matriz de espacios de estacionamiento.
   */
  async ngOnInit(): Promise<void> {
    this.initParkingLotService();
  }

  /**
   * Método que convierte un índice de fila en una letra correspondiente (A, B, C, etc.)
   * @param i - Índice de la fila
   * @returns La letra correspondiente al índice de fila
   */
  getRowHeader(i: number): string {
    return String.fromCharCode(65 + i);  // Convierte el índice en un carácter ASCII (letra)
  }

  /**
   * Método que obtiene la matriz de espacios de estacionamiento desde el servicio.
   * Luego, actualiza el estado de 'isLoading' a falso y asigna los datos de la matriz a 'matrizSpaces'.
   */
  async initParkingLotService() {
    const matrix = await this.parkingLotService.getParkingLot().then((matrixData) => {
      this.isLoading = false;  // Cambia el estado de carga cuando los datos están listos
      return matrixData;
    });

    this.matrizSpaces = matrix;  // Asigna los datos obtenidos a 'matrizSpaces'
  }

  /**
   * Método que emite un evento con los datos del espacio seleccionado.
   * @param spaceData - Los datos del espacio seleccionado
   */
  onCLickEmiter(spaceData: SpaceData) {
    this.eventEmitrSpace.emit(spaceData);  // Emite el evento con los datos del espacio
  }

  /**
   * Método que convierte un índice de columna en una letra correspondiente (A, B, C, etc.)
   * @param index - Índice de la columna
   * @returns La letra correspondiente al índice de la columna
   */
  getLetterFromIndex(index: number): string {
    return String.fromCharCode(65 + index);  // Convierte el índice en un carácter ASCII (letra)
  }

  /**
   * Método que filtra la matriz de espacios, excluyendo aquellos con estado "NP".
   * @returns Una nueva matriz con los espacios filtrados
   */
  getMatrizFilter(): SpaceData[][] {
    if (!this.matrizSpaces) {
      return [];
    }

    const matrizFilter: SpaceData[][] = [];  // Nueva matriz para los espacios filtrados
    this.matrizSpaces.forEach((row) => {
      const rowData: SpaceData[] = [];  // Fila filtrada de espacios
      row.forEach((space) => {
        if (space.spaceFB.state !== "NP") {  // Solo agrega los espacios cuyo estado no sea "NP"
          rowData.push(space);
        }
      });
      matrizFilter.push(rowData);  // Agrega la fila filtrada a la matriz
    });

    return matrizFilter;  // Devuelve la matriz filtrada
  }
}
