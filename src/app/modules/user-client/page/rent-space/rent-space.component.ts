import { Component} from '@angular/core';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { SelectRateComponent } from '../../../user-admin/components/select-rate/select-rate.component';
import { SelectAutomobileComponent } from '../../../user-admin/components/select-automobile/select-automobile.component';

import { CreateContractComponent } from "../../../user-admin/components/create-contract/create-contract.component";
import { CreateRentedComponent } from "../../../user-admin/components/create-rented/create-rented.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rent-space',
  standalone: true,
  imports: [SelectAutomobileComponent, SelectRateComponent, MatrixSpacesComponent, CreateContractComponent, CreateRentedComponent, CommonModule, FormsModule],
  templateUrl: './rent-space.component.html',
  styleUrl: './rent-space.component.scss'
})
export class RentSpaceComponent {

}
