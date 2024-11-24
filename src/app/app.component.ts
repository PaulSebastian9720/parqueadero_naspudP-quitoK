import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/section/header/header.component';
import { FooterComponent } from './shared/section/footer/footer.component';
import { SidebarComponent } from "./modules/user-client/components/sidebar/sidebar.component";
import { SideBarComponent } from "./modules/user-admin/components/side-bar/side-bar.component";
import { NotificationComponent } from "./shared/components/notification/notification.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule, RouterModule, SidebarComponent, SideBarComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

/**
 * Componente principal de la aplicación que gestiona la visibilidad de las secciones y las barras laterales
 * dependiendo de la ruta actual del navegador.
 * 
 * @class AppComponent
 */
export class AppComponent implements OnInit { 

  /**
   * Título de la aplicación.
   * 
   * @type {string}
   */
  title = 'proyecto-integrado-parqueadero';

  /**
   * Bandera que indica si las secciones principales de la aplicación deben ser visibles.
   * Se ocultan cuando el usuario está en una ruta de autenticación (/auth).
   * 
   * @type {boolean}
   */
  showSections = false;

  /**
   * Bandera que indica si la barra lateral para los clientes debe ser visible.
   * Se muestra cuando el usuario está en una ruta relacionada con los servicios del cliente.
   * 
   * @type {boolean}
   */
  showSideBar = false;

  /**
   * Bandera que indica si la barra lateral para los administradores debe ser visible.
   * Se muestra cuando el usuario está en una ruta relacionada con los servicios del administrador.
   * 
   * @type {boolean}
   */
  showSideBarAdmin = false;

  /**
   * Constructor del componente. Inyecta el servicio de enrutamiento `Router` para escuchar eventos de navegación.
   * 
   * @param {Router} router - Servicio de enrutamiento de Angular.
   */
  constructor(private router: Router) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se suscribe a los eventos de navegación del enrutador para cambiar la visibilidad
   * de las secciones y las barras laterales según la ruta actual.
   * 
   * @returns {void}
   */
  ngOnInit() {
    // Suscripción a los eventos de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Control de visibilidad de las secciones principales
        if (event.url.startsWith('/auth')) {
          this.showSections = false;  // Oculta las secciones si la ruta está relacionada con autenticación
        } else {
          this.showSections = true;   // Muestra las secciones para otras rutas
        }

        // Control de visibilidad de la barra lateral para el cliente
        if (event.url.startsWith('/services-client')) {
          this.showSideBar = true;    // Muestra la barra lateral del cliente si la ruta está relacionada con el cliente
        } else {
          this.showSideBar = false;   // Oculta la barra lateral del cliente para otras rutas
        }

        // Control de visibilidad de la barra lateral para el administrador
        if (event.url.startsWith('/services-admin')) {
          this.showSideBarAdmin = true;  // Muestra la barra lateral del administrador si la ruta está relacionada con el administrador
        } else {
          this.showSideBarAdmin = false; // Oculta la barra lateral del administrador para otras rutas
        }
      }
    });
  }
}
