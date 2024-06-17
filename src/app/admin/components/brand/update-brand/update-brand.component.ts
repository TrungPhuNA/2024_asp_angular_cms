import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.scss']
})
export class UpdateBrandComponent {
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
