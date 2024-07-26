import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent {
  @Input() order: any;
  @Input() modalTitle: string = '';
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  form = new FormGroup({
    codeOrder: new FormControl(null, Validators.required),
    fullName: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    orderDate: new FormControl(null, Validators.required),
    requiredDate: new FormControl(null, Validators.required),
    shippedDate: new FormControl(null),
    quantity: new FormControl(null, Validators.required),
    totalPrice: new FormControl(null, Validators.required),
    statusName: new FormControl(null, Validators.required),
  });
  constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) {

	}
    ngOnChanges(): void {
    this.form.reset();
    if (this.order) {
      this.form.patchValue({
        codeOrder: this.order?.codeOrder,
        fullName: this.order?.fullName,
        address: this.order?.address,
        orderDate: this.order?.orderDate,
        requiredDate: this.order?.requiredDate,
        shippedDate: this.order?.shippedDate,
        quantity: this.order?.quantity,
        totalPrice: this.order?.totalPrice,
        statusName: this.order?.statusName,
      });
      this.form.disable(); // Disable form if view mode
    }
  }
  handleClose() {
    this.form.reset();
    this.close.emit();
  }

  handleSave() {
    this.save.emit(this.order);
  }
}
