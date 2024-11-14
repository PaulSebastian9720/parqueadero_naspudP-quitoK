import { Component } from '@angular/core';
import { SliderImgComponent } from '../../components/slider-img/slider-img.component';
import { AboutBlogComponent } from '../../components/about-blog/about-blog.component';
import { NewCommentComponent } from '../../components/new-comment/new-comment.component';
import { ListWorkdayComponent } from "../../../../shared/components/list-workday/list-workday.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderImgComponent, AboutBlogComponent, NewCommentComponent, ListWorkdayComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
