import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent {
  @Input() category: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  saveProduct() {
    this.save.emit(this.category);
  }

  closeModal() {
    this.close.emit();
  }
}
