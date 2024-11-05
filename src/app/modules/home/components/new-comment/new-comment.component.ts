import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../../core/models/comment';

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

  sendComment(){
    console.log(new  Comment(this.id, this.user, this.user_correo, this.text))
  }
}
