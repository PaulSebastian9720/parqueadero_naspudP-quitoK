import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isOpen = false;
  activeRoute: string = "/services-client"

  setActiveRoute(route: string) {
    this.activeRoute = route;
  }
  
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
