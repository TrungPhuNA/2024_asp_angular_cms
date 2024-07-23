import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../../services/category.service';
@Component({
	selector: 'app-update-category',
	templateUrl: './update-category.component.html',
	styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent {
	@Input() category: any = null;
	@Input() categoryParents: any = [];
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() save = new EventEmitter<any>();
	@Output() close = new EventEmitter<void>();

	form = new FormGroup({
		Name: new FormControl(null, Validators.required),
		Image: new FormControl(null as string | null, Validators.required),
		CateParentId: new FormControl(null, Validators.required),
	});
	
	@ViewChild('fileInput') fileInput!: ElementRef;
	selectedFile: File | null = null;
    image: string | null = null;  // Updated property name
	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private http: HttpClient,
		private categoryService: CategoryService,
	) {

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['category'] && this.category) { // Sử dụng ngoặc vuông để truy cập thuộc tính
			this.form.patchValue({
				Name: this.category.name,
				Image: this.category.image as string | null, // Đảm bảo kiểu dữ liệu khớp
				CateParentId: this.category.cateParentId
			});
		}
		if (!this.isVisible) {
			this.form.reset();
		}
	}
	
	
	onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;

            // Hiển thị hình ảnh ngay lập tức
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.image = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            this.selectedFile = null;
            this.image = null; // Xóa hình ảnh nếu không có file nào được chọn
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
				console.log('Upload response', response);
				this.image = response.secure_url; // Cập nhật URL của ảnh đã tải lên
				this.form.patchValue({ Image: this.image as string | null }); // Đảm bảo kiểu dữ liệu khớp
				this.selectedFile = null; // Xóa file đã chọn sau khi tải lên
			}, error => {
				console.error('Upload error', error);
				this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
			});
	}
	
	saveCategory() {
		if (this.form.invalid) {
			this.alertService.fireSmall('error', "Form Catetory is invalid");
			return;
		}
		this.save.emit({
			form: this.form.value,
			id: this.category?.categoryId
		});
	}

	closeModal() {
		this.form.reset();
		this.close.emit();
	}
	


}
