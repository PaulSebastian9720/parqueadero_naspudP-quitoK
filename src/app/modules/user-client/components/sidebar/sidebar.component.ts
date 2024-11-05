import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  activeRoute: string = "/services-client"

  setActiveRoute(route: string) {
    this.activeRoute = route;
  }
}
