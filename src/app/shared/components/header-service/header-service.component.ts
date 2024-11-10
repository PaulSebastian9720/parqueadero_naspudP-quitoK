import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-service',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-service.component.html',
})
export class HeaderServiceComponent {
  @Input() titlePage! : string 
  @Input() description! : string 
}
