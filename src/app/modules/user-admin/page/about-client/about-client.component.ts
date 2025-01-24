import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserData, UserFB } from '../../../../core/models/user';
import { UserfbService } from '../../../../shared/services/user/userfb.service';
import { UpdateFormUserComponent } from '../../../../shared/components/update-form-user/update-form-user.component';
import { FormsModule } from '@angular/forms';
import { TableContractComponent } from '../../components/table-contract/table-contract.component';
import { ListAutomobileComponent } from '../../../../shared/components/list-automobile/list-automobile.component';
import { MatSidenavModule } from '@angular/material/sidenav';

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
  constructor(private userService: UserfbService) {} // Servicio para obtener la lista de usuarios

  // Propiedades de entrada y salida del componente
  user!: UserData | null; // Usuario seleccionado o null si no hay ninguno
  users: UserData[] = []; // Lista completa de usuarios
  filteredUsers: UserData[] = []; // Lista de usuarios filtrados según la búsqueda
  wordFilter: string = ''; // Filtro de búsqueda por palabra clave
  isEditing = false; // Bandera para el modo de edición
  isOpen = false;
  currentPage: number = 1;
  totalPages: number = 5;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 10, 15];
  pages: number[] = [];
  isMenuOpen: boolean = false;
  selectWorld: 'SF' | 'ACT' | 'DES' | 'ADM' | 'CLI' | "" = '';

  /**
   * Método que se ejecuta al inicializar el componente.
   * Llama al método 'initUser' para cargar la lista de usuarios al inicio.
   */
  async ngOnInit(): Promise<void> {
    this.initUser(); // Inicializa la lista de usuarios
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.filteredUsers = this.getPaginatedData();
    this.updatePages();
  }

  updatePages() {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.filteredUsers = this.getPaginatedData()
  }

  updateItemsPerPage() {
    this.currentPage = 1;
    this.itemsPerPage = Number(this.itemsPerPage);
    const listFilterlength = this.getListWithFilter().length
    this.totalPages =  Math.ceil(( listFilterlength > 0 ? listFilterlength  : this.users.length )/ this.itemsPerPage)
    this.filteredUsers = this.getPaginatedData()

    this.updatePages();
  }

  /**
   * Método que se ejecuta cuando un usuario es seleccionado de la lista.
   * Asigna el usuario seleccionado y desactiva el modo de edición.
   */
  onClick(userData: UserData): void {
    this.user = userData; // Asigna el usuario seleccionado
    this.isEditing = false; // Desactiva el modo de edición
  }

  /**
   * Método que se encarga de inicializar la lista de usuarios.
   * Obtiene la lista de usuarios desde el servicio y asigna los valores a las propiedades 'users' y 'filteredUsers'.
   * Si hay un usuario previamente seleccionado, lo busca en la lista filtrada.
   */
  async initUser(): Promise<void> {
    const users = userData; // Obtiene la lista de usuarios
    this.users = users; // Asigna la lista completa de usuarios
    this.filteredUsers = users; // Inicializa la lista filtrada con todos los usuarios
    this.isEditing = false; // Se asegura de que el modo de edición esté desactivado
    if (this.user) {
      const userAux = this.user; // Guarda el usuario previamente seleccionado
      this.user = null; // Reinicia el usuario seleccionado
      // Busca el usuario en la lista filtrada por su UID y lo asigna de nuevo
      this.user = this.filteredUsers.find(
        (user) => user.crendentialUserUID === userAux.crendentialUserUID
      )!;
    }
  }

  /**
   * Método para alternar el estado de edición del usuario.
   * Si el rol del usuario es 'A' o 'CF', no permite editar.
   * Cambia el estado de la propiedad 'isEditing'.
   */

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  toggleEdit() {
    if (!this.user) return; // Si no hay un usuario seleccionado, no hace nada
    if (this.user.user.rol === 'A' || this.user.user.rol === 'CF') return; // Si el rol del usuario es 'A' o 'CF', no se puede editar
    this.isEditing = !this.isEditing; // Cambia el estado de edición
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filteredUsers = this.getPaginatedData()
    }
  }

  getPaginatedData(){
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    if(this.wordFilter !== "" || this.selectWorld !== "SF"){
      return  this.getListWithFilter().slice(startIndex, endIndex);
    } else  {
      return this.users.slice(startIndex, endIndex);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filteredUsers = this.getPaginatedData()
    }
  }

  /**
   * Método que se ejecuta cuando el usuario realiza una búsqueda.
   * Filtra la lista de usuarios según la palabra clave en los campos nombre, apellido y correo.
   */

  filterListPerWorld() {    
    const listAux = this.getListWithFilter()
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


  getListWithFilter(){
    let listAux = this.users;
  
    if (this.selectWorld !== 'SF') {
      if(this.selectWorld === 'ADM'){
        listAux = listAux.filter(
          (user) => user.user.rol === 'A'
        );
      }else if (this.selectWorld === 'CLI'){
        listAux = listAux.filter(
          (user) => user.user.rol === 'C'
        );
      } else if(this.selectWorld === 'ACT'){
        listAux = listAux.filter(
          (user) => user.user.state 
        );
      } else if(this.selectWorld === 'DES') {
        listAux = listAux.filter(
          (user) =>!user.user.state
        );
      }
    }
  
    if (this.wordFilter !== '') {
      listAux = listAux.filter(
        (user) =>
          user.user.correo.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          user.user.last_name.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          user.user.name.toLowerCase().includes(this.wordFilter.toLowerCase()) ||
          user.user.phone?.toLowerCase().includes(this.wordFilter.toLowerCase())
      );
    }
    return listAux
  }
}

const userData: UserData[] = [
  new UserData(
    'uid1',
    new UserFB(
      'Juan',
      true,
      'Pérez',
      'juan.perez@mail.com',
      'A',
      new Date('1990-05-12'),
      'Calle Falsa 123',
      'Madrid',
      '123456789',
      'juan.sec@mail.com',
      [],
      []
    )
  ),
  new UserData(
    'uid2',
    new UserFB(
      'María',
      false,
      'Gómez',
      'maria.gomez@mail.com',
      'C',
      new Date('1985-08-24'),
      'Avenida Siempreviva 742',
      'Barcelona',
      '987654321',
      undefined,
      [],
      ['Gestión 1']
    )
  ),
  new UserData(
    'uid3',
    new UserFB(
      'Carlos',
      true,
      'López',
      'carlos.lopez@mail.com',
      'CF',
      new Date('1992-11-03'),
      'Plaza Mayor 56',
      'Sevilla',
      '456123789',
      'carlos.sec@mail.com',
      [],
      ['Gestión 2', 'Gestión 3']
    )
  ),
  new UserData(
    'uid4',
    new UserFB(
      'Lucía',
      true,
      'Martínez',
      'lucia.martinez@mail.com',
      'C',
      '',
      'Gran Vía 11',
      'Valencia',
      '321654987',
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid5',
    new UserFB(
      'Andrés',
      false,
      'Sánchez',
      'andres.sanchez@mail.com',
      'A',
      new Date('1978-01-15'),
      'Calle Larga 23',
      'Bilbao',
      undefined,
      'andres.sec@mail.com',
      [],
      []
    )
  ),
  new UserData(
    'uid6',
    new UserFB(
      'Laura',
      true,
      'Ramírez',
      'laura.ramirez@mail.com',
      'CF',
      new Date('1995-07-19'),
      'Paseo del Prado 34',
      'Granada',
      '147852369',
      undefined,
      [],
      ['Gestión 4']
    )
  ),
  new UserData(
    'uid7',
    new UserFB(
      'Miguel',
      true,
      'Fernández',
      'miguel.fernandez@mail.com',
      'C',
      new Date('1980-10-08'),
      'Calle Real 78',
      'Málaga',
      '963852741',
      'miguel.sec@mail.com',
      [],
      ['Gestión 5', 'Gestión 6']
    )
  ),
  new UserData(
    'uid8',
    new UserFB(
      'Sofía',
      false,
      'Hernández',
      'sofia.hernandez@mail.com',
      'A',
      new Date('1993-12-27'),
      'Calle Verde 19',
      'Córdoba',
      '753951456',
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid9',
    new UserFB(
      'David',
      true,
      'García',
      'david.garcia@mail.com',
      'CF',
      '',
      'Calle Azul 15',
      'Zaragoza',
      undefined,
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid10',
    new UserFB(
      'Isabel',
      true,
      'Ruiz',
      'isabel.ruiz@mail.com',
      'C',
      new Date('1987-04-05'),
      'Calle Roja 29',
      'Alicante',
      '852963741',
      'isabel.sec@mail.com',
      [],
      []
    )
  ),
  new UserData(
    'uid11',
    new UserFB(
      'Antonio',
      true,
      'Torres',
      'antonio.torres@mail.com',
      'A',
      new Date('1990-03-18'),
      'Calle Amarilla 45',
      'Santander',
      '789123456',
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid12',
    new UserFB(
      'Elena',
      false,
      'Castro',
      'elena.castro@mail.com',
      'CF',
      new Date('1991-09-22'),
      'Calle Blanca 12',
      'Oviedo',
      '741852963',
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid13',
    new UserFB(
      'Javier',
      true,
      'Ortiz',
      'javier.ortiz@mail.com',
      'C',
      '',
      'Calle Negra 8',
      'Pamplona',
      undefined,
      'javier.sec@mail.com',
      [],
      []
    )
  ),
  new UserData(
    'uid14',
    new UserFB(
      'Natalia',
      false,
      'Moreno',
      'natalia.moreno@mail.com',
      'A',
      new Date('1986-06-30'),
      'Calle Rosa 17',
      'Valladolid',
      '852147963',
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid15',
    new UserFB(
      'Luis',
      true,
      'Jiménez',
      'luis.jimenez@mail.com',
      'CF',
      new Date('1975-02-09'),
      'Calle Marrón 31',
      'Murcia',
      '321789654',
      'luis.sec@mail.com',
      [],
      []
    )
  ),
  new UserData(
    'uid16',
    new UserFB(
      'Paula',
      true,
      'Ramos',
      'paula.ramos@mail.com',
      'C',
      new Date('1994-11-14'),
      'Calle Gris 5',
      'Badajoz',
      '654123987',
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid17',
    new UserFB(
      'Adrián',
      true,
      'Gil',
      'adrian.gil@mail.com',
      'A',
      new Date('1983-10-21'),
      'Calle Naranja 25',
      'Salamanca',
      '951753456',
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid18',
    new UserFB(
      'Emma',
      false,
      'Vargas',
      'emma.vargas@mail.com',
      'CF',
      new Date('1997-08-12'),
      'Calle Plateada 2',
      'Toledo',
      undefined,
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid19',
    new UserFB(
      'Hugo',
      true,
      'Peña',
      'hugo.pena@mail.com',
      'C',
      new Date('1988-12-03'),
      'Calle Dorada 89',
      'León',
      '123654789',
      undefined,
      [],
      []
    )
  ),
  new UserData(
    'uid20',
    new UserFB(
      'Victoria',
      true,
      'Soler',
      'victoria.soler@mail.com',
      'A',
      new Date('1999-07-16'),
      'Calle Bronce 6',
      'Huelva',
      '321456987',
      'victoria.sec@mail.com',
      [],
      []
    )
  ),
];
