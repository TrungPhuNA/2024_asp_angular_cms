import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-new-brand',
  templateUrl: './add-new-brand.component.html',
  styleUrls: ['./add-new-brand.component.scss']
})
export class AddNewBrandComponent {
  @Input() brand: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  saveBrand() {
    this.save.emit(this.brand);
  }

  closeModal() {
    this.close.emit();
  }
}
