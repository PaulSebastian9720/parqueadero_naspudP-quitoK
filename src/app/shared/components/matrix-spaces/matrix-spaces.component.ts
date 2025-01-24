import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SpaceData, SpaceFB } from '../../../core/models/space';
import { CommonModule } from '@angular/common';
import { ParkinLotService } from '../../services/space/parkink-lot.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-matrix-spaces',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './matrix-spaces.component.html',
})
export class MatrixSpacesComponent implements OnInit {
  matrizSpaces!: SpaceData[][]; // Matriz que contiene los datos de los espacios de estacionamiento
  matrizSpacesFilter!: SpaceData[][]; // Matriz que contiene los datos de los espacios de estacionamiento
  @Output() eventEmitrSpace = new EventEmitter<SpaceData>(); // Emite un evento con la información del espacio seleccionado
  isLoading: boolean = false; // Estado que indica si los datos están cargando
  selectWorld: 'O' | 'Y' | 'N' | '' = '';
  wordFilter = '';

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
    return String.fromCharCode(65 + i); // Convierte el índice en un carácter ASCII (letra)
  }
  

  /**
   * Método que obtiene la matriz de espacios de estacionamiento desde el servicio.
   * Luego, actualiza el estado de 'isLoading' a falso y asigna los datos de la matriz a 'matrizSpaces'.
   */
  async initParkingLotService() {
    // const matrix = await this.parkingLotService.getParkingLot().then((matrixData) => {
    //   this.isLoading = false;  // Cambia el estado de carga cuando los datos están listos
    //   return matrixData;
    // });

    // this.matrizSpaces = matrix;  // Asigna los datos obtenidos a 'matrizSpaces'
    this.matrizSpaces = spaceMatrix;
    const matrizFilter: SpaceData[][] = []; // Nueva matriz para los espacios filtrados
    this.matrizSpaces.forEach((row) => {
      const rowData: SpaceData[] = []; // Fila filtrada de espacios
      row.forEach((space) => {
        if (space.spaceFB.state !== 'NP') {
          // Solo agrega los espacios cuyo estado no sea "NP"
          rowData.push(space);
        }
      });
      matrizFilter.push(rowData); // Agrega la fila filtrada a la matriz
    });
    this.matrizSpacesFilter = matrizFilter;
  }

  /**
   * Método que emite un evento con los datos del espacio seleccionado.
   * @param spaceData - Los datos del espacio seleccionado
   */
  onCLickEmiter(spaceData: SpaceData) {
    this.eventEmitrSpace.emit(spaceData); // Emite el evento con los datos del espacio
  }

  /**
   * Método que convierte un índice de columna en una letra correspondiente (A, B, C, etc.)
   * @param index - Índice de la columna
   * @returns La letra correspondiente al índice de la columna
   */
  getLetterFromIndex(index: number): string {
    return String.fromCharCode(65 + index); // Convierte el índice en un carácter ASCII (letra)
  }

  /**
   * Método que filtra la matriz de espacios, excluyendo aquellos con estado "NP".
   * @returns Una nueva matriz con los espacios filtrados
   */
  getMatrizFilter(): SpaceData[][] {
    if (!this.matrizSpaces) {
      return [];
    }

    const matrizFilter: SpaceData[][] = []; // Nueva matriz para los espacios filtrados
    this.matrizSpaces.forEach((row) => {
      const rowData: SpaceData[] = []; // Fila filtrada de espacios
      row.forEach((space) => {
        if (space.spaceFB.state !== 'NP') {
          // Solo agrega los espacios cuyo estado no sea "NP"
          rowData.push(space);
        }
      });
      matrizFilter.push(rowData); // Agrega la fila filtrada a la matriz
    });

    return matrizFilter; // Devuelve la matriz filtrada
  }

  getListWithFilter() {
    let listAux: SpaceData[][] = [];

    this.matrizSpaces.forEach((row) => {
      const rowData: SpaceData[] = [];
      row.forEach((space) => {
        if (space.spaceFB.state !== 'NP') {
          rowData.push(space);
        }
      });
      listAux.push(rowData);
    });

    if (this.selectWorld !== '') {
      listAux = listAux
        .map((row) =>
          row.filter((space) => space.spaceFB.state === this.selectWorld)
        )
        .filter((row) => row.length > 0);
    }

    if (this.wordFilter !== '') {
      listAux = listAux
        .map((row) =>
          row.filter(
            (space) =>
              space.spaceFB.idFBCliente
                .toLowerCase()
                .includes(this.wordFilter.toLowerCase()) ||
              space.spaceFB.idFBManagement
                .toLowerCase()
                .includes(this.wordFilter.toLowerCase()) ||
              space.spaceFB.location
                .toLowerCase()
                .includes(this.wordFilter.toLowerCase())
          )
        )
        .filter((row) => row.length > 0);
    }

    return listAux;
  }

  filterPerWorld(selectWorld: 'O' | 'Y' | 'N' | '' = '', filterWorld: string) {
    this.selectWorld = selectWorld;
    this.wordFilter = filterWorld;

    this.matrizSpacesFilter = this.getListWithFilter();
  }
}

const spaceMatrix: SpaceData[][] = [
  [
    new SpaceData('1-1', new SpaceFB('1-1', 'N', '', '')),
    new SpaceData('1-2', new SpaceFB('1-2', 'Y', 'Cliente1', 'Management1')),
    new SpaceData('1-3', new SpaceFB('1-2', 'Y', 'Cliente1', 'Management1')),
    new SpaceData('1-4', new SpaceFB('1-2', 'Y', 'Cliente1', 'Management1')),
    new SpaceData('1-5', new SpaceFB('1-3', 'NP', '', '')),
    new SpaceData('1-6', new SpaceFB('1-4', 'O', 'Cliente2', 'Management2')),
    new SpaceData('1-7', new SpaceFB('1-5', 'N', '', '')),
  ],
  [
    new SpaceData('2-1', new SpaceFB('2-1', 'Y', '0303149603', 'Management3')),
    new SpaceData('2-2', new SpaceFB('2-2', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-3', new SpaceFB('2-3', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-4', new SpaceFB('2-4', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-5', new SpaceFB('2-5', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-5', new SpaceFB('2-5', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-5', new SpaceFB('2-5', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-5', new SpaceFB('2-5', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-5', new SpaceFB('2-5', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-5', new SpaceFB('2-5', 'O', 'Cliente4', 'Management4')),
    new SpaceData('2-6', new SpaceFB('2-6', 'N', '', '')),
    new SpaceData('2-7', new SpaceFB('2-7', 'NP', '', '')),
    new SpaceData('2-7', new SpaceFB('2-7', 'NP', '', '')),
    new SpaceData('2-8', new SpaceFB('2-8', 'Y', 'Cliente5', 'Management5')),
  ],
  [
    new SpaceData('3-1', new SpaceFB('3-1', 'N', '', '')),
    new SpaceData('3-2', new SpaceFB('3-2', 'NP', '', '')),
    new SpaceData('3-3', new SpaceFB('3-3', 'O', 'Cliente6', 'Management6')),
    new SpaceData('3-4', new SpaceFB('3-4', 'O', 'Cliente6', 'Management6')),
    new SpaceData('3-5', new SpaceFB('3-5', 'O', 'Cliente6', 'Management6')),
    new SpaceData('3-6', new SpaceFB('3-6', 'Y', 'Cliente7', 'Management7')),
    new SpaceData('3-7', new SpaceFB('3-7', 'N', '', '')),
  ],
  [
    new SpaceData('4-1', new SpaceFB('4-1', 'Y', 'Cliente8', 'Management8')),
    new SpaceData('4-2', new SpaceFB('4-2', 'O', 'Cliente9', 'Management9')),
    new SpaceData('4-3', new SpaceFB('4-3', 'NP', '', '')),
    new SpaceData('4-4', new SpaceFB('4-4', 'N', '', '')),
    new SpaceData('4-5', new SpaceFB('4-5', 'Y', 'Cliente10', 'Management10')),
    new SpaceData('4-6', new SpaceFB('4-6', 'Y', '0303149603', 'Management10')),
    new SpaceData('4-7', new SpaceFB('4-7', 'Y', 'Cliente10', 'Management10')),
  ],
  [
    new SpaceData('5-1', new SpaceFB('5-1', 'N', '', '')),
    new SpaceData('5-2', new SpaceFB('5-2', 'NP', '', '')),
    new SpaceData('5-3', new SpaceFB('5-3', 'Y', 'Cliente11', 'Management11')),
    new SpaceData('5-4', new SpaceFB('5-4', 'O', '0303149603', 'Management12')),
    new SpaceData('5-5', new SpaceFB('5-5', 'N', '', '')),
  ],
  [
    new SpaceData('6-1', new SpaceFB('6-1', 'N', '', '')),
    new SpaceData('6-2', new SpaceFB('6-2', 'NP', '', '')),
    new SpaceData('6-3', new SpaceFB('6-3', 'O', 'Cliente6', 'Management6')),
    new SpaceData('6-4', new SpaceFB('6-4', 'O', 'Cliente6', 'Management6')),
    new SpaceData('6-5', new SpaceFB('6-5', 'O', 'Cliente6', 'Management6')),
    new SpaceData('6-6', new SpaceFB('6-6', 'Y', 'Cliente7', 'Management7')),
    new SpaceData('6-7', new SpaceFB('6-7', 'N', '', '')),
  ],
  [
    new SpaceData('7-1', new SpaceFB('7-1', 'N', '', '')),
    new SpaceData('7-2', new SpaceFB('7-2', 'Y', '', '')),
    new SpaceData('7-3', new SpaceFB('7-3', 'Y', 'Cliente6', 'Management6')),
    new SpaceData('7-4', new SpaceFB('7-4', 'Y', 'Cliente6', 'Management6')),
    new SpaceData('7-5', new SpaceFB('7-5', 'Y', 'Cliente6', 'Management6')),
    new SpaceData('7-6', new SpaceFB('7-6', 'Y', 'Cliente7', 'Management7')),
    new SpaceData('7-7', new SpaceFB('7-7', 'N', '', '')),
  ],
];
    