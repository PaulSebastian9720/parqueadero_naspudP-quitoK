import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../services/user/auth-state.service';
import { UserCacheService } from '../../services/user/user-cache.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isMenuOpenAuth = false;
  isAuthenticated = true;
  menuNotify = false;
  isAdmin = true;

  constructor(
    private authState: AuthStateService,
    private currentUser: UserCacheService
  ) {}

  ngOnInit(): void {
    this.authState.authState$.subscribe(
    (state) => this.isAuthenticated = state
    )
    this.currentUser.getUser().subscribe((user)=> {
      if(user){
        if(user?.rol === 'A') this.isAdmin = true
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

  async logOut() {
    await this.authState.logOut();
    location.reload();
    this.currentUser.removeUser();
    this.toggleClosingMenu();
  }
}
