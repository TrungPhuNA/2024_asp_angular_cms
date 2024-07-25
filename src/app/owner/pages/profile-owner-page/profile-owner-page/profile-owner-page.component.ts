import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';
import moment from 'moment';


@Component({
  selector: 'app-profile-owner-page',
  templateUrl: './profile-owner-page.component.html',
  styleUrl: './profile-owner-page.component.scss'
})
export class ProfileOwnerPageComponent implements OnChanges {
  @Input() data: any;
  @Input() typeForm: any;
  @Input() modalTitle: string = '';
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Input() isVisible: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  image: string | null = null;  // Updated property name

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null),
    fullname: new FormControl(null, Validators.required),
    image: new FormControl(null as string | null, Validators.required),
    phone: new FormControl(null, Validators.required),
    address: new FormControl(null),
    gender: new FormControl(null, Validators.required),
    dob: new FormControl(null as string | null), // Cập nhật ở đây
    isBan: new FormControl(null),
  });

  constructor(
    public commonService: CommonService,
    private alertService: AlertService,
    private http: HttpClient,
  ) {

  }

  ngOnChanges(): void {
    this.form.reset();
    if (!this.isVisible) {
      this.form.reset();
      this.form.enable();
    }
    if (this.data && this.typeForm != 1) {
      this.form.patchValue({
        email: this.data?.email,
        fullname: this.data?.fullname,
        image: this.data?.image,
        gender: this.data?.gender,
        dob: this.data?.dob ? moment(this.data.dob).format('YYYY-MM-DD') : null, // Cập nhật ở đây
        phone: this.data?.phone,
        address: this.data?.address,
        isBan: this.data?.isBan,
      });
      if (this.typeForm == 2) {
        this.form.disable();
      }
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
    if (this.typeForm == 1) {
      this.form.get('password')?.setValidators(Validators.required);
      this.form.get('password')?.updateValueAndValidity();
    } else {
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.image = null;
    }
  }

  uploadImage(folderName: string): void {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', cloudinaryConfig.upload_preset);
    formData.append('folder', folderName);

    this.http.post(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`, formData)
      .subscribe((response: any) => {
        this.image = response.secure_url;
        this.form.patchValue({ image: this.image as string | null });
        this.selectedFile = null;
      }, error => {
        this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
      });
  }

  submit() {
    if (this.form.invalid) {
      console.log(this.form);
      this.alertService.fireSmall('error', "Form account is invalid");
      return;
    }
    let dataBody = this.form.value;
    if (this.data?.accountId) {
      delete dataBody.password;
    }
    this.save.emit({
      form: this.form.value,
      id: this.data?.accountId
    });
  }
  
  closeModal() {
    this.form.reset();
    this.close.emit();
  }
}
