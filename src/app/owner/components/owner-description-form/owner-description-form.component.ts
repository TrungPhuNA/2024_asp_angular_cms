import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertService } from '../../helpers/alert.service';
import { CommonService } from '../../helpers/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-owner-description-form',
  templateUrl: './owner-description-form.component.html',
  styleUrl: './owner-description-form.component.scss'
})
export class OwnerDescriptionFormComponent {
	@Input() data: any;
	@Input() typeForm: any;
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	isBans = [
		{
			id: true,
			name: "Delete"
		},
		{
			id: false,
			name: "Active"
		}
	]

	form = new FormGroup({
		Title : new FormControl(null, Validators.required),
		Content : new FormControl(null, Validators.required),
		ImageLinks : new FormControl(null, Validators.required),
	});

	constructor(
		public commonService: CommonService,
		private alertService: AlertService
	) {

	}

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		this.form.reset();
		if (!this.isVisible) {
			this.form.reset();
			this.form.enable();
		}
		
		if (this.data && this.typeForm != 1) {
			this.form.patchValue({
				Title: this.data?.title,
				Content: this.data?.content,
				ImageLinks: this.data?.imageLinks
			});
			
			if(this.typeForm == 2) {
				this.form.disable();
			}
		}
		console.log('data',this.data);
	}
	submit() {

		if (this.form.invalid) {

			this.alertService.fireSmall('error', "Form is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.data?.descriptionId
		});
	}

	closeModal() {
		this.form.reset();

		this.close.emit();
	}
}
