import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../service/admin/common.service';
import { AlertService } from '../../../../service/admin/alert.service';

@Component({
	selector: 'app-add-new-category',
	templateUrl: './add-new-category.component.html',
	styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent {
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	form = new FormGroup({
		Name: new FormControl(null, Validators.required),
		Image: new FormControl(null, Validators.required)
	});

	constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) {

	}

	saveCategory() {
		if(this.form.invalid) {
			this.alertService.fireSmall('error', "Form Catetory is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: null
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
