import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DialogService } from '../../services/dialog/dialogconfirm.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Automobile } from '../../../core/interfaces/automobile';
import { AutomobileService } from '../../services/api/automovile/automobile.service';
import { FormAutomovileComponent } from '../form-automovile/form-automovile.component';

@Component({
  selector: 'app-list-automobile',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './list-automobile.component.html',
})
export class ListAutomobileComponent implements OnChanges {
  listFilterAutomobile : Automobile[] = []; // Lista de automóviles

  isOpen = false;
  currentPage: number = 1;
  totalPages: number = 0; 
  itemsPerPage: number = 4;
  itemsPerPageOptions: number[] = [4, 6, 8];
  pages: number[] = [];
  @Input() isLoading = true
  @Input() listAutomobile : Automobile[]= [] 

  constructor(
    private automobileService: AutomobileService,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {
    
   }

   /**
   * Método que se ejecuta cuando los datos de entrada (userData) cambian.
   * Llama a 'initList' para actualizar la lista de automóviles cuando el usuario cambia.
   * @param changes - Los cambios de las propiedades de entrada
   */

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["listAutomobile"]  && changes["listAutomobile"].currentValue){
      if(this.isLoading) return
      this.initList()
    }
  }

  @Output() eventGetRateDate = new EventEmitter<void>();  // Evento para obtener la tasa de fecha (sin usar en el código actual)

  

  /**
   * Abre un diálogo para actualizar la información de un automóvil.
   * Se pasan los datos del automóvil y del usuario al formulario de actualización.
   * Después de actualizar, se cierra el diálogo y se recarga la lista de automóviles.
   * @param automobile - El automóvil a actualizar
   */
  async onUpdateAutomobile(automobile: Automobile) {
    const dialogRef = this.dialog.open(FormAutomovileComponent);  // Abre un diálogo con el formulario de actualización
    const instance = dialogRef.componentInstance;
    instance.automobile = automobile;  // Pasa el automóvil al formulario
    instance.eventUpateUser.subscribe(() => {
      this.dialog.closeAll();  // Cierra todos los diálogos
      this.initList();  // Recarga la lista de automóviles
    });
  }

  /**
   * Inicializa la lista de automóviles obteniendo los datos del usuario.
   * Utiliza el servicio de usuario para obtener los automóviles asociados al usuario.
   */
  initList() { 
    this.listFilterAutomobile= []
    this.totalPages = Math.ceil(this.listAutomobile.length / this.itemsPerPage);
    this.listFilterAutomobile = this.getPaginatedData(); 
    this.updatePages();
  }

  /**
   * Elimina un automóvil de la lista del usuario después de confirmar la acción.
   * Muestra un cuadro de diálogo de confirmación antes de eliminar el automóvil.
   * @param automobileDelete - El automóvil que se desea eliminar
   */
  async onClickDeleteAutomobile(automobileDelete: Automobile) {
    if (!automobileDelete.idAutomobile) return; 
    this.dialogService
      .confirm({
        title: '¡Advertencia!',
        question: '¿Estás seguro de continuar con esta acción?',
        highlight: `Esto eliminará  ${automobileDelete.brand}-${automobileDelete.model}-${automobileDelete.licensePlate}`,
        icon: 'fas fa-exclamation-circle',
      })
      .then((confirmed) => {
        // if (confirmed) {
        //   // Filtra el automóvil a eliminar de la lista
        //   const newList = this.listAutomobile.filter(automobile => automobile.id !== automobileDelete.id);
        //   const userUpdate = { ...this.userData.user };  // Copia los datos del usuario
        //   userUpdate.listAutomobile = newList;  // Actualiza la lista de automóviles del usuario
        //   this.userService.updateUser(this.userData.crendentialUserUID, userUpdate);  // Actualiza el usuario en la base de datos
        //   this.initList();  // Recarga la lista de automóviles
        // } 
      });
  }


  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const  endIndex = startIndex + this.itemsPerPage;
    return this.listAutomobile.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.listFilterAutomobile = this.getPaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.listFilterAutomobile = this.getPaginatedData();
    }
  }

  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.listFilterAutomobile =  this.getPaginatedData();
  }

  updateItemsPerPage() {
    this.currentPage = 1; 
    this.itemsPerPage = Number(this.itemsPerPage);
    this.totalPages = Math.ceil(this.listAutomobile.length / this.itemsPerPage);
    this.listFilterAutomobile = this.getPaginatedData()
    this.updatePages();
  }
}