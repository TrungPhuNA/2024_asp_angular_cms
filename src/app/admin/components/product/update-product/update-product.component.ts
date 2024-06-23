import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  @Input() categories: any;
  @Input() brands: any;
  @Input() owners: any;

	form = new FormGroup({
        Name: new FormControl(null, Validators.required),
        ImageLinks: new FormControl(null, Validators.required),
        ShortDescription: new FormControl(null, Validators.required),
        Price: new FormControl(null, Validators.required),
        DescriptionId: new FormControl(null, Validators.required),
        BrandId: new FormControl(null, Validators.required),
        CategoryId: new FormControl(null, Validators.required),
        OwnerId: new FormControl(null, Validators.required),
    });

	constructor(
        public commonService: CommonService,
        private alertService: AlertService
    ) {

    }

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		if(!this.isVisible) {
			this.form.reset();
		}
		if(this.product) {
			this.form.patchValue({
				Name: this.product?.name,
				ImageLinks: this.product?.images,
				ShortDescription: this.product?.shortDescription,
				Price: this.product?.price,
				DescriptionId: this.product?.descriptionId,
				BrandId: this.product?.brandId,
				OwnerId: this.product?.ownerId,
				CategoryId: this.product?.categoryId,
			});
		}
	}
	submit() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form Product is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.product.productId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
