import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../../../../service/admin/common.service";
import {AlertService} from "../../../../service/admin/alert.service";

@Component({
    selector: 'app-add-new-brand',
    templateUrl: './add-new-brand.component.html',
    styleUrls: ['./add-new-brand.component.scss']
})
export class AddNewBrandComponent {
    @Input() modalTitle: string = '';
    @Input() isVisible: boolean = false;
    @Output() save = new EventEmitter<any>();
    @Output() close = new EventEmitter<void>();

    form = new FormGroup({
        Name: new FormControl(null, Validators.required),
        Image: new FormControl(null, Validators.required),
        CategoryId: new FormControl(null, Validators.required),
    });

    constructor(
        public commonService: CommonService,
        private alertService: AlertService
    ) {

    }

    saveBrand() {
        if(this.form.invalid) {
            this.alertService.fireSmall('error', "Form Brand is invalid");
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
