import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
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
