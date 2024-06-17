import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent {
  @Input() category: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  saveCategory() {
    this.save.emit(this.category);
  }

  closeModal() {
    this.close.emit();
  }
}
