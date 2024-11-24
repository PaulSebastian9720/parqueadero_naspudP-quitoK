import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserfbService } from '../../services/user/userfb.service';
import { UserData } from '../../../core/models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './select-user.component.html',
})
export class SelectUserComponent implements OnInit {
  selectedUser: string = "";  // Variable que guarda el UID del usuario seleccionado
  listUserFb: UserData[] = [];  // Lista completa de usuarios obtenida desde el servicio
  listUserFBFilter: UserData[] = [];  // Lista filtrada de usuarios excluyendo aquellos con rol "CF"

  @Output() userEventEmitter = new EventEmitter<UserData>();  // Emite el usuario seleccionado hacia el componente padre

  constructor(
    private userfbService: UserfbService  // Servicio que maneja las operaciones relacionadas con usuarios
  ) {}

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Llama a 'initListUsers' para obtener la lista de usuarios.
   */
  async ngOnInit(): Promise<void> {
    await this.initListUsers();
  }

  /**
   * Método que maneja el evento de hacer clic sobre un usuario.
   * Busca el usuario seleccionado en 'listUserFb' y emite el usuario encontrado.
   */
  onClickUser() {
    const userData = this.listUserFb.find(
      userData => userData.crendentialUserUID === this.selectedUser  // Encuentra el usuario seleccionado por UID
    );
    this.userEventEmitter.emit(userData);  // Emite el usuario encontrado hacia el componente padre
  }

  /**
   * Método que obtiene la lista de usuarios desde el servicio.
   * Filtra la lista para excluir a los usuarios con rol "CF" y los asigna a 'listUserFBFilter'.
   */
  async initListUsers() {
    try {
      const list = await this.userfbService.getListUsers();  // Obtiene la lista de usuarios desde el servicio
      this.listUserFb = list;  // Asigna la lista completa a 'listUserFb'
      this.listUserFBFilter = this.listUserFb.filter(userData => userData.user.rol !== "CF");  // Filtra usuarios con rol distinto a "CF"
    } catch (e) {
      // Manejo de errores (vacío por ahora)
    }
  }
}
