import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from '../../../helpers/common.service';
import { AlertService } from '../../../helpers/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { ProductService } from '../../../services/product.service';
import { formatDate } from '@angular/common';
import { cloudinaryConfig } from '../../../../../../cloudinary.config';
import { HttpClient } from '@angular/common/http';

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
	@Input() descriptions: any;
	showReviews: boolean = false;
	formattedDescription: string = '';
	comments: any[] = [];
	selectedSize: any;
	quantity: number = 1;
	maxQuantity: number = 0;
	productSizes: any[] = [];
	@ViewChild(NgxSummernoteDirective) summernote: any;
	public config: any = {
		placeholder: 'Nội dung',
		tabsize: 2,
		height: '200px',
		// uploadImagePath: '/api/upload',
		toolbar: [
			['misc', ['codeview', 'undo', 'redo']],
			['style', ['bold', 'italic', 'underline', 'clear']],
			['font', ['strikethrough', 'superscript', 'subscript']],
			['fontsize', ['fontname', 'fontsize', 'color']],
			['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
			['insert', ['table', 'picture', 'link', 'video', 'hr']]
		],
		fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
	}
	@ViewChild('fileInput') fileInput!: ElementRef;
	selectedFile: File | null = null;
	image: string | null = null;  // Updated property name
	form = new FormGroup({
		Name: new FormControl(null, Validators.required),
		Image: new FormControl(null as string | null, Validators.required),
		ShortDescription: new FormControl(null, Validators.required),
		Price: new FormControl(null, Validators.required),
		DescriptionId: new FormControl(null, Validators.required),
		BrandId: new FormControl(null, Validators.required),
		CategoryId: new FormControl(null, Validators.required),
		OwnerId: new FormControl(null, Validators.required),
	});

	constructor(
		public commonService: CommonService,
		private alertService: AlertService,
		private commentService: ProductService,
		private http: HttpClient,
	) {

	}

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		this.form.reset();
		if (!this.isVisible) {
			this.form.reset();
		}
		console.log("descriptions----->?", this.descriptions);
		if (this.product) {
			let images = this.product?.images;
			this.form.patchValue({
				Name: this.product?.name,
				Image: images?.length > 0 ? images[0]?.linkImage : null,
				ShortDescription: this.product?.shortDescription,
				Price: this.product?.price,
				DescriptionId: this.product?.descriptionId,
				BrandId: this.product?.brandId,
				OwnerId: this.product?.ownerId,
				CategoryId: this.product?.categoryId,
			});
			this.formattedDescription = this.product.description.content.replace(/\n/g, '<br>');
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
				this.form.patchValue({ Image: this.image as string | null });
				this.selectedFile = null;
			}, error => {
				this.alertService.fireSmall('error', 'Failed to upload image. Please try again.');
			});
	}
	loadComments(productId: number): void {
		this.commentService.getComments(productId).subscribe(
			(data) => {
				this.comments = data.map((comment: any) => {
					return {
						...comment,
						formattedTimestamp: formatDate(comment.timestamp, 'medium', 'en-US'),
						formattedReplyTimestamp: comment.replyTimestamp ? formatDate(comment.replyTimestamp, 'medium', 'en-US') : null
					};
				});
			},
			(error) => {
				console.error('There was an error fetching comments!', error);
			}
		);
	}

	loadProductSizes(productId: number): void {
		this.commentService.getProductSizesByProductId(productId).subscribe(
			(data) => {
				this.productSizes = data.data.sort((a: any, b: any) => parseFloat(a.sizeName) - parseFloat(b.sizeName));
			},
			(error) => {
				console.error('There was an error fetching product sizes!', error);
			}
		);
	}

	decreaseQuantity() {
		if (this.quantity > 1) {
			this.quantity--;
		}
	}

	increaseQuantity() {
		if (this.quantity < this.maxQuantity) {
			this.quantity++;
		}
	}


	toggleReviews() {
		this.showReviews = !this.showReviews;
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
	getStars(ratePoint: number): any[] {
		const totalStars = 5;
		const fullStars = Math.floor(ratePoint);
		const partialStar = ratePoint % 1;
		const emptyStars = totalStars - fullStars - (partialStar > 0 ? 1 : 0);

		return [
			...Array(fullStars).fill('full'),
			...(partialStar > 0 ? [{ type: 'partial', width: partialStar * 100 + '%' }] : []),
			...Array(emptyStars).fill('empty')
		];
	}
	selectSize(size: any) {
		if (size.quantity === 0) {
			return;
		}
		this.selectedSize = size;
		this.maxQuantity = size.quantity;
		this.quantity = 1;
	}
	closeModal() {
		this.form.reset();
		this.close.emit();
	}

	logEvent(e: any) {

	}
}
