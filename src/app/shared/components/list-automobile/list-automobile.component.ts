import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Automobile } from '../../../core/models/automobile';
import { UserData } from '../../../core/models/user';
import { UserfbService } from '../../services/user/userfb.service';
import { DialogService } from '../../services/dialog/dialogconfirm.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormAutomovileComponent } from '../form-automovile/form-automovile.component';

@Component({
  selector: 'app-list-automobile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-automobile.component.html',
})
export class ListAutomobileComponent implements OnChanges {
  listAutomobile: Automobile[] = [];  // Lista de automóviles asociada al usuario

  @Input() userData!: UserData;  // Datos del usuario recibidos como entrada

  constructor(
    private userService: UserfbService,  // Servicio para interactuar con la base de datos del usuario
    private dialogService: DialogService,  // Servicio para manejar diálogos de confirmación
    private dialog: MatDialog  // Servicio para manejar los diálogos de Material
  ) { }

  @Output() eventGetRateDate = new EventEmitter<void>();  // Evento para obtener la tasa de fecha (sin usar en el código actual)

  /**
   * Método que se ejecuta cuando los datos de entrada (userData) cambian.
   * Llama a 'initList' para actualizar la lista de automóviles cuando el usuario cambia.
   * @param changes - Los cambios de las propiedades de entrada
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["userData"] && changes["userData"].currentValue) {
      this.initList();  // Actualiza la lista de automóviles si 'userData' ha cambiado
    }
  }

  /**
   * Abre un diálogo para actualizar la información de un automóvil.
   * Se pasan los datos del automóvil y del usuario al formulario de actualización.
   * Después de actualizar, se cierra el diálogo y se recarga la lista de automóviles.
   * @param automobile - El automóvil a actualizar
   */
  async onUpdateAutomobile(automobile: Automobile) {
    const dialogRef = this.dialog.open(FormAutomovileComponent);  // Abre un diálogo con el formulario de actualización
    const instance = dialogRef.componentInstance;
    instance.automobileData = automobile;  // Pasa el automóvil al formulario
    instance.userData = this.userData!;  // Pasa los datos del usuario al formulario
    instance.eventUpateUser.subscribe(() => {
      this.dialog.closeAll();  // Cierra todos los diálogos
      this.initList();  // Recarga la lista de automóviles
    });
  }

  /**
   * Inicializa la lista de automóviles obteniendo los datos del usuario.
   * Utiliza el servicio de usuario para obtener los automóviles asociados al usuario.
   */
  async initList() {
    const userFB = await this.userService.getUser(this.userData.crendentialUserUID);  // Obtiene los datos del usuario
    this.listAutomobile = userFB?.listAutomobile!;  // Asigna la lista de automóviles del usuario
  }

  /**
   * Elimina un automóvil de la lista del usuario después de confirmar la acción.
   * Muestra un cuadro de diálogo de confirmación antes de eliminar el automóvil.
   * @param automobileDelete - El automóvil que se desea eliminar
   */
  async onClickDeleteAutomobile(automobileDelete: Automobile) {
    if (!this.userData) return;  // Si no hay datos del usuario, no se realiza ninguna acción
    this.dialogService
      .confirm({
        title: '¡Advertencia!',
        question: '¿Estás seguro de continuar con esta acción?',
        highlight: `Esto eliminará  ${automobileDelete.brand}-${automobileDelete.model}-${automobileDelete.plate}`,
        icon: 'fas fa-exclamation-circle',
      })
      .then((confirmed) => {
        if (confirmed) {
          // Filtra el automóvil a eliminar de la lista
          const newList = this.listAutomobile.filter(automobile => automobile.id !== automobileDelete.id);
          const userUpdate = { ...this.userData.user };  // Copia los datos del usuario
          userUpdate.listAutomobile = newList;  // Actualiza la lista de automóviles del usuario
          this.userService.updateUser(this.userData.crendentialUserUID, userUpdate);  // Actualiza el usuario en la base de datos
          this.initList();  // Recarga la lista de automóviles
        } else {
          // Si no se confirma la acción, no se hace nada
        }
      });
  }
}
