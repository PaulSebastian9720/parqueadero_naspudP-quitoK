import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData } from '../../../../core/models/user';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UpdateFormUserComponent } from "../../../../shared/components/update-form-user/update-form-user.component";
import { FormsModule } from '@angular/forms';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { TableContractComponent } from "../../components/table-contract/table-contract.component";
import { ListAutomobileComponent } from "../../../../shared/components/list-automobile/list-automobile.component";

@Component({
  selector: 'app-about-client',
  standalone: true,
  imports: [CommonModule, UpdateFormUserComponent, FormsModule, HeaderServiceComponent, TableContractComponent, ListAutomobileComponent],
  templateUrl: './about-client.component.html',
})

export class AboutClientComponent implements OnInit {
  constructor(private userService: UserfbService) {}  // Servicio para obtener la lista de usuarios

  // Propiedades de entrada y salida del componente
  user!: UserData | null;  // Usuario seleccionado o null si no hay ninguno
  users: UserData[] = [];  // Lista completa de usuarios
  filteredUsers: UserData[] = [];  // Lista de usuarios filtrados según la búsqueda
  wordFilter: string = "";  // Filtro de búsqueda por palabra clave
  isEditing = false;  // Bandera para el modo de edición

  /**
   * Método que se ejecuta al inicializar el componente.
   * Llama al método 'initUser' para cargar la lista de usuarios al inicio.
   */
  async ngOnInit(): Promise<void> {
    this.initUser();  // Inicializa la lista de usuarios
  }

  /**
   * Método que se ejecuta cuando el usuario realiza una búsqueda.
   * Filtra la lista de usuarios según la palabra clave en los campos nombre, apellido y correo.
   */
  onSearch(): void {
    this.filteredUsers = this.users.filter(userData =>
      userData.user.name.toLowerCase().includes(this.wordFilter.toLowerCase()) ||  // Filtra por nombre
      userData.user.last_name.toLowerCase().includes(this.wordFilter.toLowerCase()) ||  // Filtra por apellido
      userData.user.correo.toLowerCase().includes(this.wordFilter.toLowerCase())  // Filtra por correo
    );
  }

  /**
   * Método que se ejecuta cuando un usuario es seleccionado de la lista.
   * Asigna el usuario seleccionado y desactiva el modo de edición.
   */
  onClick(userData: UserData): void {
    this.user = userData;  // Asigna el usuario seleccionado
    this.isEditing = false;  // Desactiva el modo de edición
  } 

  /**
   * Método que se encarga de inicializar la lista de usuarios.
   * Obtiene la lista de usuarios desde el servicio y asigna los valores a las propiedades 'users' y 'filteredUsers'.
   * Si hay un usuario previamente seleccionado, lo busca en la lista filtrada.
   */
  async initUser(): Promise<void> {
    const users = await this.userService.getListUsers();  // Obtiene la lista de usuarios
    this.users = users;  // Asigna la lista completa de usuarios
    this.filteredUsers = users;  // Inicializa la lista filtrada con todos los usuarios
    this.isEditing = false;  // Se asegura de que el modo de edición esté desactivado
    if (this.user) {
      const userAux = this.user;  // Guarda el usuario previamente seleccionado
      this.user = null;  // Reinicia el usuario seleccionado
      // Busca el usuario en la lista filtrada por su UID y lo asigna de nuevo
      this.user = this.filteredUsers.find(user => user.crendentialUserUID === userAux.crendentialUserUID)!;
    }
  }

  /**
   * Método para alternar el estado de edición del usuario.
   * Si el rol del usuario es 'A' o 'CF', no permite editar.
   * Cambia el estado de la propiedad 'isEditing'.
   */
  toggleEdit() {
    if (!this.user) return;  // Si no hay un usuario seleccionado, no hace nada
    if (this.user.user.rol === 'A' || this.user.user.rol === 'CF') return;  // Si el rol del usuario es 'A' o 'CF', no se puede editar
    this.isEditing = !this.isEditing;  // Cambia el estado de edición
  }
}
