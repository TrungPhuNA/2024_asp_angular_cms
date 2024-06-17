import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss']
})
export class DeleteCategoryComponent {
  @Input() category: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() delete = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  confirmDelete() {
    this.delete.emit(this.category.id);
  }

  closeModal() {
    this.close.emit();
  }
}
