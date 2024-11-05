import { Component } from '@angular/core';
import { CommentsComponent } from '../../../ui/slider_image/comments/comments.component';
import { ScheduleComponent } from '../../../ui/slider_image/schedule/schedule.component';
import { MensaggeComponent } from '../../../ui/slider_image/message/mensagge.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-slider-img',
  standalone: true,
  imports: [ScheduleComponent, CommentsComponent, MensaggeComponent,CommonModule ],
  templateUrl: './slider-img.component.html',
  styleUrl: './slider-img.component.scss'
})
export class SliderImgComponent {
  components = [MensaggeComponent, CommentsComponent, ScheduleComponent]; 
  currentSlideIndex = 0;
  

  changeSlide(direction: number): void {
    this.currentSlideIndex += direction;

    if (this.currentSlideIndex >= this.components.length) {
      this.currentSlideIndex = 0; 
    } else if (this.currentSlideIndex < 0) {
      this.currentSlideIndex = this.components.length - 1; 
    }

  }
}
