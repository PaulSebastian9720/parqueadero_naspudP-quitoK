import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserCurrentService } from '../../services/user/user-cache.service';
import { AuthService } from '../../services/auth/auth/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isMenuOpenAuth = false;
  isAuthenticated = false;
  menuNotify = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private currentUser: UserCurrentService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(
      (state) => this.isAuthenticated = state
    )
    this.currentUser.getUser().subscribe((user)=> {
      if(user){
        if(user.role === 'A') this.isAdmin = true
      }
    })
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isMenuOpenAuth = this.isMenuOpenAuth
      ? !this.isMenuOpenAuth
      : this.isMenuOpenAuth;

    this.menuNotify = this.menuNotify ? !this.menuNotify : this.menuNotify;
  }

  toggleMenuAuth() {
    this.isMenuOpenAuth = !this.isMenuOpenAuth;
    this.isMenuOpen = this.isMenuOpen ? !this.isMenuOpen : this.isMenuOpen;

    this.menuNotify = this.menuNotify ? !this.menuNotify : this.menuNotify;
  }

  toggleMenuNotify() {
    this.menuNotify = !this.menuNotify;
    this.isMenuOpen = this.isMenuOpen ? !this.isMenuOpen : this.isMenuOpen;
    this.isMenuOpen = this.isMenuOpen ? !this.isMenuOpen : this.isMenuOpen;
  }

  toggleClosingMenu() {
    this.isMenuOpen = false;
    this.isMenuOpenAuth = false;
    this.menuNotify = false;
  }

  logOut() {
    this.authService.logout();
    location.reload();
    this.currentUser.removeUser();
    this.toggleClosingMenu();
  }
}