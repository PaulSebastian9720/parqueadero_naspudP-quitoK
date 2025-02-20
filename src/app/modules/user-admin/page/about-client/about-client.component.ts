import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateFormUserComponent } from '../../../../shared/components/update-form-user/update-form-user.component';
import { FormsModule } from '@angular/forms';
import { TableContractComponent } from '../../components/table-contract/table-contract.component';
import { ListAutomobileComponent } from '../../../../shared/components/list-automobile/list-automobile.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { User } from '../../../../core/interfaces/person';
import { UserService } from '../../../../shared/services/api/user/user.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { DialogService } from '../../../../shared/services/dialog/dialogconfirm.service';
import { AutomobileService } from '../../../../shared/services/api/automovile/automobile.service';
import { Automobile } from '../../../../core/interfaces/automobile';
import { Contract } from '../../../../core/interfaces/contract';
import { Ticket } from '../../../../core/interfaces/ticket';
import { ContractService } from '../../../../shared/services/api/contract/contract';
import { TicketService } from '../../../../shared/services/api/ticket/ticket';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-about-client',
  standalone: true,
  imports: [
    CommonModule,
    UpdateFormUserComponent,
    FormsModule,
    TableContractComponent,
    ListAutomobileComponent,
    MatSidenavModule,
  ],
  templateUrl: './about-client.component.html',
  styleUrls: ['./about-client.component.scss'],
})
export class AboutClientComponent implements OnInit {
  constructor(
    private userService: UserService,
    private automobileService: AutomobileService,
    private notiticationService: NotificationService,
    private showDialgConfirn: DialogService,
    private contactService: ContractService,
    private ticketService: TicketService,
    private matDialogService: MatDialog
  ) {} // Servicio para obtener la lista de usuarios

  // Propiedades de entrada y salida del componente
  user!: User | null; // Usuario seleccionado o null si no hay ninguno
  users: User[] = []; // Lista completa de usuarios
  filteredUsers: User[] = []; // Lista de usuarios filtrados según la búsqueda
  automobiles: Automobile[] = [];
  contractsList: Contract[] = [];
  ticketList: Ticket[] = [];
  wordFilter: string = '';
  isEditing = false;
  isOpen = false;
  currentPage: number = 1;
  totalPages: number = 5;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  pages: number[] = [];
  isMenuOpen: boolean = false;
  selectWorld: 'SF' | 'ACT' | 'DES' | 'ADM' | 'CLI' | '' = '';
  isLoadingTAuto: boolean = true;

  /**
   * Método que se ejecuta al inicializar el componente.
   * Llama al método 'initUser' para cargar la lista de usuarios al inicio.
   */
  ngOnInit() {
    this.initUsers();
  }

  addNewUser() {
    const dialogRef = this.matDialogService.open(UpdateFormUserComponent);
    const instance = dialogRef.componentInstance;
    instance.isEditingMail = true;
    instance.isEditing = true;
    instance.showOptionals = false
    instance.messageButton = 'Registrar';
    instance.sendUser.subscribe((user) => {
      this.userService.insertUser(user).subscribe(
        (response) => {
          if (response) {
            this.initUsers();
            this.notiticationService.notify(response.message, 'success', 2250);
            this.matDialogService.closeAll()
          }
        },
        (error) => {
          this.notiticationService.notify(error.error, 'error', 2250);
        }
      );
    });
  }

  selectTables(idPerson: number) {
    this.isLoadingTAuto = true;
    this.automobiles = [];
    this.contractsList = [];
    this.ticketList = [];
    this.automobileService
      .getAutomobileListByIdPerson(idPerson)
      .subscribe((automobiles) => {
        this.automobiles = automobiles;
        this.isLoadingTAuto = false;
      });
    this.contactService
      .getContractListByIdPerson(idPerson)
      .subscribe((contracts) => {
        console.log(contracts);
        this.contractsList = contracts;
      });
    this.ticketService.getTicketsByIdPerson(idPerson).subscribe((tickets) => {
      console.log(tickets);
      this.ticketList = tickets;
    });
  }

  updateItemsPerPage() {
    this.currentPage = 1;
    this.itemsPerPage = Number(this.itemsPerPage);
    const listFilterlength = this.getListWithFilter().length;
    this.totalPages = Math.ceil(
      (listFilterlength > 0 ? listFilterlength : this.users.length) /
        this.itemsPerPage
    );
    this.filteredUsers = this.getPaginatedData();

    this.updatePages();
  }

  /**
   * Método que se ejecuta cuando un usuario es seleccionado de la lista.
   * Asigna el usuario seleccionado y desactiva el modo de edición.
   */
  onClick(user: User): void {
    this.isEditing = false;
    this.user = user;
    this.selectTables(user.idPerson!);
  }

  /**
   * Método que se encarga de inicializar la lista de usuarios.
   * Obtiene la lista de usuarios desde el servicio y asigna los valores a las propiedades 'users' y 'filteredUsers'.
   * Si hay un usuario previamente seleccionado, lo busca en la lista filtrada.
   */
  initUsers() {
    this.userService.getAllUsers().subscribe((users) => {
      if (users) {
        this.users = users;
        this.filteredUsers = users;
        this.isEditing = false;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.filteredUsers = this.getPaginatedData();
        this.updatePages();
      }
    });
    if (this.user) {
      const userAux = this.user;
      this.user = null;
      this.user = this.filteredUsers.find(
        (user) => user.idPerson === userAux.idPerson
      )!;
    }
  }

  receiveData(user: User) {
    if (!user || !user.idPerson) return;
    this.userService.updateUser(user).subscribe(
      (response) => {
        this.userService.getOneUserById(user.idPerson!).subscribe((user) => {
          this.user = { ...user };
          this.toggleEdit();
          this.notiticationService.notify(
            (response as any).message,
            'success',
            2250
          );
        });
        this.initUsers();
        this.toggleSidebar(null);
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

  btnchangeState(user: User) {
    if (user.role == 'A') {
      this.notiticationService.notify(
        'No se puede cambiar el estado de un administrador o un contratista',
        'error',
        2250
      );
      return;
    }

    const highlightMessage =
      user.status === 'A'
        ? 'Este usuario ya no podra iniciar sesion'
        : 'Este usuario ahora podra iniciar sesion';
    this.showDialgConfirn
      .confirm({
        title:
          'Confirmar cambio de estado a ' +
          `${user.status === 'A' ? 'inactivo' : 'activo'}`,
        question: '¿Desea cambiar el estado de este usuario? ' + user.mail,
        highlight: highlightMessage,
        icon: 'fas fa-arrows-rotate',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.userService
            .updateUserStatus(user.idPerson!)
            .subscribe((response) => {
              this.notiticationService.notify(
                (response as any).message,
                'success',
                2250
              );
              this.initUsers();
            });
        }
      });
  }

  /**
   * Método para alternar el estado de edición del usuario.
   * Si el rol del usuario es 'A' o 'CF', no permite editar.
   * Cambia el estado de la propiedad 'isEditing'.
   */

  toggleSidebar(user: User | null) {
    this.isOpen = !this.isOpen;
    this.isEditing = false;
    if (!user) return;
    this.user = user;
    this.selectTables(user.idPerson!);
  }

  toggleIsEditing() {
    this.isOpen = !this.isOpen;
  }

  toggleEdit() {
    if (!this.user) return; // Si no hay un usuario seleccionado, no hace nada
    if (this.user.role === 'A' || this.user.role === 'CF') return; // Si el rol del usuario es 'A' o 'CF', no se puede editar
    this.isEditing = !this.isEditing; // Cambia el estado de edición
  }

  /**
   * Método que se ejecuta cuando el usuario realiza una búsqueda.
   * Filtra la lista de usuarios según la palabra clave en los campos nombre, apellido y correo.
   */

  filterListPerWorld() {
    const listAux = this.getListWithFilter();
    this.totalPages = Math.ceil(listAux.length / this.itemsPerPage);
    this.currentPage = 1;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredUsers = listAux.slice(startIndex, endIndex);
    this.updatePages();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getListWithFilter() {
    let listAux = this.users;

    if (this.selectWorld !== 'SF') {
      if (this.selectWorld === 'ADM') {
        listAux = listAux.filter((user) => user.role === 'A');
      } else if (this.selectWorld === 'CLI') {
        listAux = listAux.filter((user) => user.role === 'C');
      } else if (this.selectWorld === 'ACT') {
        listAux = listAux.filter((user) => user.status === 'A');
      } else if (this.selectWorld === 'DES') {
        listAux = listAux.filter((user) => user.status === 'I');
      }
    }

    if (this.wordFilter !== '') {
      listAux = listAux.filter(
        (user) =>
          user.mail?.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          user.lastName
            ?.toLowerCase()
            .includes(this.wordFilter.toLowerCase()) ||
          user.name?.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          user.phone?.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          user.documentID?.includes(this.wordFilter)
      );
    }
    return listAux;
  }

  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.filteredUsers = this.getPaginatedData();
  }

  getPaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    if (this.wordFilter !== '' || this.selectWorld !== 'SF') {
      return this.getListWithFilter().slice(startIndex, endIndex);
    } else {
      return this.users.slice(startIndex, endIndex);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filteredUsers = this.getPaginatedData();
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filteredUsers = this.getPaginatedData();
    }
  }
}
