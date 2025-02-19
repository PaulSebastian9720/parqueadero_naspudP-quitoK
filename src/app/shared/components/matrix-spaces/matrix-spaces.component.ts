import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SpaceData, SpaceFB } from '../../../core/models/space';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ParkingSpaceService } from '../../services/api/parkingSpace/parkingSpace.service';
import { ParkingSpace } from '../../../core/interfaces/parkingSpace';

@Component({
  selector: 'app-matrix-spaces',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './matrix-spaces.component.html',
})
export class MatrixSpacesComponent implements OnInit {
  matrizSpaces: ParkingSpace[][] = []; // Matriz que contiene los datos de los espacios de estacionamiento
  matrizSpacesFilter: ParkingSpace[][] = []; // Matriz que contiene los datos de los espacios de estacionamiento
  @Output() eventEmitrSpace = new EventEmitter<ParkingSpace>(); // Emite un evento con la información del espacio seleccionado
  isLoading: boolean = true; // Estado que indica si los datos están cargando
  selectWorld: 'FR' | 'BC' | 'BT' | 'IN' | '' = '';
  wordFilter = '';

  constructor(private pSpaceService: ParkingSpaceService) {}

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Llama a 'initParkingLotService' para obtener la matriz de espacios de estacionamiento.
   */
  ngOnInit() {
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
  initParkingLotService() {
    this.pSpaceService.getAllSpaces().subscribe((spaces) => {
      if (spaces) {
        this.matrizSpaces = buildMatrix(spaces);
        this.isLoading = false;
        this.matrizSpacesFilter = this.getListWithFilter();
      }
    });
  }

  /**
   * Método que emite un evento con los datos del espacio seleccionado.
   * @param spaceData - Los datos del espacio seleccionado
   */
  onCLickEmiter(parkingSpace: ParkingSpace) {
    if (parkingSpace.status === 'IN') return;
    this.eventEmitrSpace.emit(parkingSpace);
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
  getMatrizFilter(): ParkingSpace[][] {
    if (!this.matrizSpaces) {
      return [];
    }

    const matrizFilter: ParkingSpace[][] = [];
    this.matrizSpaces.forEach((row) => {
      const rowData: ParkingSpace[] = [];
      row.forEach((space) => {
        if (space.status !== 'IN') {
          rowData.push(space);
        }
      });
      matrizFilter.push(rowData);
    });

    return matrizFilter;
  }

  getListWithFilter() {
    let listAux: ParkingSpace[][] = this.matrizSpaces;

    if (this.selectWorld !== '') {
      listAux = listAux
        .map((row) => row.filter((space) => space.status === this.selectWorld))
        .filter((row) => row.length > 0);
    }

    if (this.wordFilter !== '') {
      listAux = listAux
        .map((row) =>
          row.filter(
            (space) =>
              space
                .location!.toLowerCase()
                .includes(this.wordFilter.toLowerCase()) ||
              space
                .documentID?.toLowerCase()
                .includes(this.wordFilter.toLowerCase()) ||
              space
                .licensePlate?.toLowerCase()
                .includes(this.wordFilter.toLowerCase()
              )
          )
        )
        .filter((row) => row.length > 0);
    }

    return sortMatrixRows(listAux);
  }

  filterPerWorld(
    selectWorld: 'FR' | 'BC' | 'BT' | 'IN' | '' = '',
    filterWorld: string
  ) {
    this.selectWorld = selectWorld;
    this.wordFilter = filterWorld;

    this.matrizSpacesFilter = this.getListWithFilter();
  }
}

function sortMatrixRows(matrix: ParkingSpace[][]): ParkingSpace[][] {
  const regex = /(\D+)(\d+)/; // Expresión regular para capturar letras y números separados

  const sortRow = (row: ParkingSpace[]): ParkingSpace[] => {
    return row.sort((a, b) => {
      const matchA = a.location!.match(regex);
      const matchB = b.location!.match(regex);

      if (matchA && matchB) {
        const prefixA = matchA[1];
        const prefixB = matchB[1];
        const numA = parseInt(matchA[2], 10);
        const numB = parseInt(matchB[2], 10);

        const prefixSort = prefixA.localeCompare(prefixB);
        if (prefixSort !== 0) return prefixSort;

        return numA - numB;
      }

      return a.location!!.localeCompare(b.location!!);
    });
  };

  // Ordenar cada fila de la matriz
  return matrix.map((row) => sortRow(row));
}

function buildMatrix(spacesList: ParkingSpace[]): ParkingSpace[][] {
  const matrix: ParkingSpace[][] = [];
  const map: { [key: string]: ParkingSpace[] } = {};

  spacesList.forEach((space) => {
    const key = space.location!!.split('-')[0];
    if (!map[key]) map[key] = [];
    map[key].push(space);
  });

  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      matrix.push(map[key]);
    }
  }

  return matrix;
}
