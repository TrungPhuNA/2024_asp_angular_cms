import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent {
  @Input() product: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
