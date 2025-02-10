import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateFormUserComponent } from '../../components/update-form-user/update-form-user.component';
import { User } from '../../../core/interfaces/person';
import { UserCurrentService } from '../../services/user/user-cache.service';
import { UserService } from '../../services/api/user/user.service';
import { NotificationService } from '../../services/dialog/notificaion.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UpdateFormUserComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  // Propiedades del componente
  user!: User; // Datos del usuario, inicialmente no definidos.
  isEditing = false; // Bandera para controlar si el perfil está en modo de edición.

  constructor(
    private userService: UserService,
    private userCurrent: UserCurrentService,
    private notiticationService: NotificationService
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Llama al método 'initUser' para cargar los datos del usuario.
   */
  ngOnInit() {
    this.initUser(); // Inicializa los datos del usuario al cargar el componente.
  }

  /**
   * Método que obtiene los datos del usuario desde Firebase utilizando la UID.
   * Asigna los datos obtenidos a la propiedad 'user'.
   */
  initUser() {
    this.userCurrent.getUser().subscribe((user) => {
      if (user) {
        this.user = { ...user };
        this.userService.getOneUserById(this.user.idPerson!).subscribe((user) => {
          if (user) {
            this.user = { ...user };
          }
        });
      }
    });
  }

  /**
   * Método que recarga los datos del usuario y cambia el estado de edición.
   * Llama a 'initUser' para obtener los datos y luego a 'toggleEdit' para alternar el modo de edición.
   */
  receiveData(user: User) {
    if (!user || !user.idPerson) return;
    this.userService.updateUser(user).subscribe(
      (response) => {
        this.userService.getOneUserById(user.idPerson!).subscribe((user) => {
          this.user = { ...user };
          this.userCurrent.setUser(user);
          this.toggleEdit();
          this.notiticationService.notify(
            (response as  any).message,
            'success',
            2250
          );
        });
      },
      (err) => {
        this.notiticationService.notify(
          'Error al actualizar los datos del usuario. ' + err.error,
          'error',
          2250
        );
        console.error('Error al actualizar los datos del usuario:', err);
      }
    );
  }

  /**
   * Método para alternar el modo de edición del perfil.
   * Si la propiedad 'user' no está definida, no realiza ninguna acción.
   */
  toggleEdit() {
    // if (!this.user) return;  // Si no se tienen datos de usuario, no hace nada.
    this.isEditing = !this.isEditing; // Cambia el estado de la bandera 'isEditing' entre 'true' y 'false'.
  }
}
