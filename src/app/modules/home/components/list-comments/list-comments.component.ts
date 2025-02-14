import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Comment } from '../../../../core/models/comment';
import { CommentService } from '../../../../shared/services/api/comments/comment.service';
@Component({
  selector: 'app-list-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-comments.component.html',
  styleUrl: './list-comments.component.scss',
})

export class ListCommentsComponent implements OnInit {

  comments: Comment[] = [];
  private commentsService = inject(CommentService);

  ngOnInit(): void {
      this.getAllComments();
  }

  getAllComments() {
    this.commentsService.getAllComments().subscribe({
      next: (comments: any) => {
        this.comments = comments; 
        console.log('Comentarios:', comments);
      },
      error: (error) => {
        console.error('Error al obtener los comentarios:', error);
      },
    });
  }
  
  
  
}
