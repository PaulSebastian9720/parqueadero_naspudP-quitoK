import { Component } from '@angular/core';
import { getMatrix, Space } from '../../../core/models/space';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'app-matrix-spaces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matrix-spaces.component.html',
})
export class MatrixSpacesComponent {
  matrizSpaces :  Space[][] = getMatrix()
  getRowHeader(index: number): string {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F']
    return alphabet[index] || ''
  }
   
}


