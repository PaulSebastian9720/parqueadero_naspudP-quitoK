import { Component, OnInit } from '@angular/core';
import { UserfbService } from '../../services/user/userfb.service';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/user/auth-state.service';
import { UpdateFormUserComponent } from "../../components/update-form-user/update-form-user.component";
import { UserData, UserFB } from '../../../core/models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UpdateFormUserComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  // Propiedades del componente
  user!: UserData;  // Datos del usuario, inicialmente no definidos.
  isEditing = false;  // Bandera para controlar si el perfil está en modo de edición.

  constructor(
    private userFBSerivce: UserfbService,  // Servicio para obtener datos del usuario desde Firebase.
    private authService: AuthStateService  // Servicio para gestionar el estado de autenticación y obtener UID del usuario.
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Llama al método 'initUser' para cargar los datos del usuario.
   */
  async ngOnInit(): Promise<void> {
    this.initUser();  // Inicializa los datos del usuario al cargar el componente.
  }

  /**
   * Método que obtiene los datos del usuario desde Firebase utilizando la UID.
   * Asigna los datos obtenidos a la propiedad 'user'.
   */
  async initUser() {
    const currentUserUID = await this.authService.credentialUserUID;  // Obtiene la UID del usuario autenticado.
    if (currentUserUID) {  // Si la UID es válida, obtiene los datos del usuario.
      const userCurrent = await this.userFBSerivce.getUser(currentUserUID!);  // Obtiene los datos del usuario desde Firebase.
      const userData: UserFB = userCurrent as UserFB;  // Convierte los datos obtenidos en el tipo esperado.
      this.user = new UserData(currentUserUID, userData);  // Asigna los datos del usuario a la propiedad 'user'.
    }
  }

  /**
   * Método que recarga los datos del usuario y cambia el estado de edición.
   * Llama a 'initUser' para obtener los datos y luego a 'toggleEdit' para alternar el modo de edición.
   */
  async reloadUser() {
    this.initUser().then(() => {
      this.toggleEdit();  // Alterna el estado de edición después de recargar los datos del usuario.
    });
  }

  /**
   * Método para alternar el modo de edición del perfil.
   * Si la propiedad 'user' no está definida, no realiza ninguna acción.
   */
  toggleEdit() {
    if (!this.user) return;  // Si no se tienen datos de usuario, no hace nada.
    this.isEditing = !this.isEditing;  // Cambia el estado de la bandera 'isEditing' entre 'true' y 'false'.
  }
}
