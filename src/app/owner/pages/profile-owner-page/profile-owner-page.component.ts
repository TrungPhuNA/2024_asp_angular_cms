import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../helpers/common.service';
import { AlertService } from '../../helpers/alert.service';
import { cloudinaryConfig } from '../../../../../cloudinary.config';
import moment from 'moment';
import { AuthenService } from '../../../admin/services/authen.service';
import { OwnerService } from '../../services/owner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-owner-page',
  templateUrl: './profile-owner-page.component.html',
  styleUrls: ['./profile-owner-page.component.scss']
})
export class ProfileOwnerPageComponent implements OnInit {
  userInfo: any = {
    fullname: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    image: ''
  };

  @Input() data: any;
  @Input() typeForm: any;
  @Input() modalTitle: string = '';
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Input() isVisible: boolean = false;
  showPassword: boolean = false;
  passwordFieldType: string = 'password';
  submitted = false;
  loginError: string | null = null;
  loginForm: FormGroup;
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  image: string | null = null;
  ownerId: number | null = null;

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null),
    fullname: new FormControl(null, Validators.required),
    image: new FormControl(null as string | null, Validators.required),
    phone: new FormControl(null, Validators.required),
    address: new FormControl(null),
    gender: new FormControl(null, Validators.required),
    dob: new FormControl(null as string | null),
    isBan: new FormControl(null),
  });

  constructor(
    public commonService: CommonService,
    private alertService: AlertService,
    private http: HttpClient,
    private authenService: AuthenService,
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  breadCrumb: any = [
    {
      label: 'Owner',
      link: '/'
    },
    {
      label: 'Profile',
      link: '/owner/profile'
    }
  ];

  dataList: any = [];

  ngOnInit(): void {
    const user = this.authenService.getUser();
    console.log('data user', user);
    this.ownerId = user?.id ?? null;
    if (this.ownerId !== null) {
      this.ownerService.show(this.ownerId).subscribe((res: any) => {
        this.dataList = res;
        console.log('dataList', this.dataList);
        if (this.dataList) {
          this.userInfo = {
            fullname: this.dataList.fullname,
            email: this.dataList.email,
            phone: this.dataList.phone,
            gender: this.dataList.gender ? this.dataList.gender.toLowerCase() : '',
            dob: this.formatDate(this.dataList.dob),
            address: this.dataList.address,
            image: this.dataList.image
          };
          this.image = this.dataList.image;
          console.log('userInfo', this.userInfo);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }

  saveUser(): void {
    if (this.ownerId !== null) {
      this.ownerService.createOrUpdateData(this.ownerId, this.dataList).subscribe(
        response => {
          console.log('User information updated:', response);
          alert('User information updated successfully!');
        },
        error => {
          console.error('Error updating user info:', error);
          alert('Failed to update user information. Please try again.');
        }
      );
    } else {
      console.error('Account ID is null, cannot update user information');
      alert('Account ID is missing. Please try again.');
    }
  }

  closeModal() {
    this.form.reset();
    this.close.emit();
  }
}
