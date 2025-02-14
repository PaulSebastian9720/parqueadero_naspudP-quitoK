import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../../core/interfaces/comment';
import { CommentService } from '../../../../shared/services/api/comments/comment.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-comment.component.html',
})
export class NewCommentComponent {
  constructor(
    private commentsService: CommentService,
    private notificationService: NotificationService
  ) {}

  @Input() comment: Comment = {
    idComment: 0,
    name: '',
    mail: '',
    comment: '',
  };

  @Output() eventUpdateComments = new EventEmitter<void>();

  sendComment() {
    if (!this.comment.name || !this.comment.mail || !this.comment.comment) {
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(this.comment.mail)) {
      this.notificationService.notify(
        'Ingresa un correo válido.',
        'error',
        4000
      );
      return;
    }
    this.commentsService.insertComment(this.comment).subscribe(
      (response) => {
        console.log('Comentario enviado:', response);

        this.notificationService.notify(
          'Comentario enviado con éxito',
          'success',
          4000
        );

        this.eventUpdateComments.emit();
        this.clear();
      },
      (error) => {
        console.log('Error al enviar el comentario:', error);
        this.notificationService.notify(
          'Error al enviar el comentario',
          'error',
          4000
        );
      }
    );
  }

  clear() {
    this.comment = {
      idComment: 0,
      name: '',
      mail: '',
      comment: '',
    };
  }
}
