import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SpaceData,  } from '../../../core/models/space';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { ParkinLotService } from '../../services/space/parkink-lot.service';


@Component({
  selector: 'app-matrix-spaces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matrix-spaces.component.html',
})
export class MatrixSpacesComponent implements OnInit {
  matrizSpaces! :  SpaceData[][] 
  @Output() eventEmitrSpace= new EventEmitter<SpaceData>()

  

  constructor(private parkingLotService :ParkinLotService){}
  async ngOnInit(): Promise<void> {
    this.initParkingLotService()
  }

  getRowHeader( i : number): string {
    return  String.fromCharCode(65 + i)
  }

  async initParkingLotService(){
    const matrix = await this.parkingLotService.getParkingLot()
    this.matrizSpaces = matrix
  }
   
  onCLickEmiter(spaceData: SpaceData){
    this.eventEmitrSpace.emit(spaceData)
  }
  
  getLetterFromIndex(index: number): string {
    return String.fromCharCode(65 + index); 
}

  getMatrizFilter(): SpaceData[][]{
    if(!this.matrizSpaces){
      return []
    }
    const matrizFilter: SpaceData[][] = []
    this.matrizSpaces.forEach((row)=> {
      const rowData : SpaceData [] = []
      row.forEach((space)=> {
        if (space.spaceFB.state !== "NP") {
          rowData.push(space)
        }
      })
      matrizFilter.push(rowData)
    })
    return matrizFilter
  }
}


