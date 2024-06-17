import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detail-brand',
  templateUrl: './detail-brand.component.html',
  styleUrls: ['./detail-brand.component.scss']
})
export class DetailBrandComponent {
  @Input() brand: any = {};
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
