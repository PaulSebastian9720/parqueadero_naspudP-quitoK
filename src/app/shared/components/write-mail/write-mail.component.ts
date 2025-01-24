import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageMail } from '../../../core/models/message';

@Component({
  selector: 'app-write-mail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './write-mail.component.html',
  styleUrl: './write-mail.component.scss'
})
export class WriteMailComponent {
  mail : MessageMail = new MessageMail("", "", "", "", "", new Date(), "nr");

  @Output() closeWindow = new EventEmitter<void>()

  closingWindow(){
    this.resetForm()
    this.closeWindow.emit()
  }

  sendMail() {
    if (this.validateMail()) {
      alert('Correo enviado exitosamente');
      this.resetForm();
    } else {
      alert('Por favor, completa todos los campos antes de enviar.');
    }
  }

  validateMail(): boolean {
    return this.mail.mailDestination.trim() !== '' && this.mail.header.trim() !== '' && this.mail.mesagge.trim() !== '';
  }

  closeCompose() {
    this.resetForm();
  }

  resetForm() {
    this.mail = new MessageMail("", "", "", "", "", new Date(), "nr");
  }
}
