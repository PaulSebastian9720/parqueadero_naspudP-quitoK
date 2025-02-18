import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageMail } from '../../../../core/interfaces/messageMail';

@Component({
  selector: 'app-mesagge-mail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesagge-mail.component.html',
  styleUrl: './mesagge-mail.component.scss'
})
export class MesaggeMailComponent {
  showMore: boolean = false;

  @Input() messageMail: MessageMail = {}
  @Output() eventShowMore = new  EventEmitter<number>()

  toggleDescription(): void {
    this.showMore = !this.showMore;
    this.messageMail.status = 'RD'
    this.eventShowMore.emit(this.messageMail.idMessageMail)
  }
}
