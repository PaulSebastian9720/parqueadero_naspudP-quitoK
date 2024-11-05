import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
})
export class SideBarComponent {
  activeRoute: string = "/services-admin"

  setActiveRoute(route: string) {
    this.activeRoute = route;
  }
}
