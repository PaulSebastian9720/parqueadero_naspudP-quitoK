import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../../shared/services/comment/comment.service';
import { CommentData } from '../../../../core/models/comment';

@Component({
  selector: 'app-list-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-comments.component.html',
  styleUrl: './list-comments.component.scss'
})
export class ListCommentsComponent implements OnInit {
  comments: CommentData[] = [];

  constructor(private commentsService: CommentService) { }

  async ngOnInit(): Promise <void> {
    this.getComments();
  } 
  

  async getComments() {
    try {
      this.comments = await this.commentsService.getListComment();
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
    }
  }



}
