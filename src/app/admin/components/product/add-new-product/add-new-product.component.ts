import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss']
})
export class AddNewProductComponent {
  @Input() product: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  saveProduct() {
    this.save.emit(this.product);
  }

  closeModal() {
    this.close.emit();
  }
}
