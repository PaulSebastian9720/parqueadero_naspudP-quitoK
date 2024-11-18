import { Component, EventEmitter, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommentFB } from '../../../../core/models/comment';
import { CommentService } from '../../../../shared/services/comment/comment.service';

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-comment.component.html',
})
export class NewCommentComponent {
  user = ""
  user_correo = ""
  text = ""
  id = "0"

  @Output() eventUpdateComments = new EventEmitter<void>

  constructor(private commentsService: CommentService) {}


  async sendComment(){
    try {
      const commentRef = new CommentFB(
        this.id,
        this.user,
        this.user_correo,
        this.text
      )
      
      await this.commentsService.createComment(commentRef)
      this.clear()
      this.eventUpdateComments.emit()
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
    }
  }

  clear(){
    this.user = ""
    this.user_correo = ""
    this.text = ""
  }
}
