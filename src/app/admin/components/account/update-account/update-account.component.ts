import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-update-account',
	templateUrl: './update-account.component.html',
	styleUrl: './update-account.component.scss'
})
export class UpdateAccountComponent {
	@Input() data: any;
	@Input() typeForm: any;
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
		if (!this.isVisible) {
			this.form.reset();
		}
		if (this.data) {
			this.form.patchValue({
				Name: this.data?.name,
				ImageLinks: this.data?.images,
				ShortDescription: this.data?.shortDescription,
				Price: this.data?.price,
				DescriptionId: this.data?.descriptionId,
				BrandId: this.data?.brandId,
				OwnerId: this.data?.ownerId,
				CategoryId: this.data?.categoryId,
			});
			if(this.typeForm == 2) {
				this.form.disable();
			}
		}
	}
	submit() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form Product is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.data.brandId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
