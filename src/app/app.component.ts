import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/section/header/header.component';
import { FooterComponent } from './shared/section/footer/footer.component';
import { SidebarComponent } from "./modules/user-client/components/sidebar/sidebar.component";
import { SideBarComponent } from "./modules/user-admin/components/side-bar/side-bar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule, RouterModule, SidebarComponent, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit{ 
  title = 'proyecto-integrado-parqueadero';

  showSections = false
  showSideBar = false
  showSideBarAdmin = false

  constructor(private router: Router) {}
  
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/auth')) {
          this.showSections = false;  
        } else {
          this.showSections = true;  
        }
        if (event.url.startsWith('/services-client')){
          this.showSideBar = true
        } else {
          this.showSideBar = false
        }
        if (event.url.startsWith('/services-admin')){
          this.showSideBarAdmin = true
        } else {
          this.showSideBarAdmin = false
        }
      }
      
    });
  }

  
}
