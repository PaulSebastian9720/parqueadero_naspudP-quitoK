import { Component, OnInit, ViewChild } from '@angular/core';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { SelectRateComponent } from '../../../user-admin/components/select-rate/select-rate.component';
import { SelectAutomobileComponent } from '../../../user-admin/components/select-automobile/select-automobile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectUserComponent } from '../../../../shared/components/select-user/select-user.component';
import { ShowParkingspaceComponent } from '../../../../shared/components/show-parkingspace/show-parkingspace.component';
import { ParkingSpace } from '../../../../core/interfaces/parkingSpace';
import { Rate } from '../../../../core/interfaces/rate';
import { User } from '../../../../core/interfaces/person';
import { Automobile } from '../../../../core/interfaces/automobile';
import { UserCurrentService } from '../../../../shared/services/user/user-cache.service';
import { RateService } from '../../../../shared/services/api/rate/rate.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { DialogService } from '../../../../shared/services/dialog/dialogconfirm.service';
import { ReqDealBase } from '../../../../core/interfaces/contract';
import { TicketService } from '../../../../shared/services/api/ticket/ticket';
import { ContractService } from '../../../../shared/services/api/contract/contract';

@Component({
  selector: 'app-rent-space',
  standalone: true,
  imports: [
    SelectAutomobileComponent,
    SelectRateComponent,
    MatrixSpacesComponent,
    CommonModule,
    FormsModule,
    SelectUserComponent,
    ShowParkingspaceComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './rent-space.component.html',
  styleUrl: './rent-space.component.scss',
})
export class RentSpaceComponent implements OnInit {
  currentUser: User = {};
  parkingSpace: ParkingSpace = {};
  isAutoRenewable: boolean = false;
  page: '/contract' | '/ticket' = '/contract';
  automobile: Automobile = {};
  rateDefect: Rate = {};

  @ViewChild('parkinSpaceMap') parkingSpaceMap!: MatrixSpacesComponent;

  constructor(
    private userService: UserCurrentService,
    private rateService: RateService,
    private notificationService: NotificationService,
    private dialogConfirmService: DialogService,
    private ticketService: TicketService,
    private contractService: ContractService
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.currentUser = user ?? {};
    });
    this.rateService.getAllRates().subscribe((rates) => {
      this.rateDefect = rates.find((rate) => rate.timeUnit === '1_month') ?? {};
    });
  }

  toggleAutoRenew() {
    this.isAutoRenewable = !this.isAutoRenewable;
  }

  onChangeType(curruntPage: '/contract' | '/ticket') {
    this.page = curruntPage;
  }

  onClinkAutomobile(automobile: Automobile) {
    this.automobile = automobile;
  }

  get validatosrContract(): boolean {
    if (!this.automobile) return false;
    if (!this.currentUser) return false;
    if (this.page === '/contract' && !this.rateDefect) return false;
    if (!this.parkingSpace) return false;
    if (this.parkingSpace.status !== 'FR') return false;
    return true;
  }

  onClickParkingSpace(parkingSpace: ParkingSpace) {
    this.parkingSpace = parkingSpace;
  }

  get startDate(): string {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  get endDate(): string {
    const today = new Date();
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    return this.rateDefect
      ? nextMonth.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '';
  }

  clearnCamps() {
    this.isAutoRenewable = false;
    this.automobile = {};
    this.parkingSpace = {};
  }

  onSubmitContract() {
    if (!this.validatosrContract) {
      this.notificationService.notify(
        'Necesita toda la informacion',
        'warning',
        2250
      );
      return;
    }
    if (!this.rateDefect && this.page === '/contract') {
      this.notificationService.notify(
        'Debes seleccionar una tarifa',
        'warning',
        2250
      );
      return;
    }

    const question =
      this.page === '/contract'
        ? `¿Estás seguro de registrar el contrato en ${this.parkingSpace.location} para ${this.currentUser?.name} ?`
        : `¿Estás seguro de registrar el contrato en ${this.parkingSpace.location} para ${this.currentUser?.name} ?`;
    this.dialogConfirmService
      .confirm({
        title: 'Nueva Reserva en el Parking',
        question: question,
        highlight: 'Confirmar',
        icon: 'fa fa-credit-card',
      })
      .then((confirm) => {
        if (confirm) {
          const reqContact: ReqDealBase = {
            autoRenewal: this.isAutoRenewable,
            idRate: this.rateDefect?.idRate!,
            person: {
              idPerson: this.currentUser?.idPerson!,
              documentID: this.currentUser?.documentID!,
            },
            automobile: {
              idAutomobile: this.automobile?.idAutomobile!,
              licensePlate: this.automobile?.licensePlate!,
            },
            parkingSpace: {
              idParkingSpace: this.parkingSpace.idParkingSpace!,
              location: this.parkingSpace.location!,
            },
          };

          if (this.page === '/contract') {
            this.contractService.insertContract(reqContact).subscribe(
              (response) => {
                if (response) {
                  this.notificationService.notify(
                    response.message,
                    'success',
                    2250
                  );
                  this.clearnCamps();
                  this.parkingSpaceMap.initParkingLotService();
                }
              },
              (error) => {
                this.notificationService.notify(error.error, 'error', 2250);
              }
            );
          } else {
            this.ticketService.insertTicket(reqContact).subscribe(
              (response) => {
                if (response) {
                  this.notificationService.notify(
                    response.accessToken,
                    'success',
                    2250
                  );
                  this.clearnCamps();
                }
              },
              (error) => {
                this.notificationService.notify(error.error, 'error', 2250);
              }
            );
          }
        } else {
          this.notificationService.notify('Contrato cancelado', 'error', 2250);
        }
      });
  }
}
