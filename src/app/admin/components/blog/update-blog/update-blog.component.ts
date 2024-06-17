import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.scss']
})
export class UpdateBlogComponent {
  @Input() blog: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  saveBlog() {
    this.save.emit(this.blog);
  }

  closeModal() {
    this.close.emit();
  }
}
