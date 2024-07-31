import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { INIT_PAGING } from '../../helpers/constant';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { OwnerService } from '../../services/owner.service';
import { DescriptionService } from '../../services/description.service';

@Component({
  selector: 'app-owner-description',
  templateUrl: './owner-description.component.html',
  styleUrl: './owner-description.component.scss'
})
export class OwnerDescriptionComponent {
	dataList: any = [];
	modalTitle: string = '';
	openModal: boolean = false;

	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private descriptionService: DescriptionService,
		private alertService: AlertService
	) {

	}
	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Product description',
			link: '/owner/description'
		}
	];
	ngOnInit(): void {
		this.getDataListParent(this.paging);

	}
	dataListAll: any;
	getDataListParent(params: any) {
		console.log('data áđâs kiểm tra trướcs',this.typeForm);
		this.loading = true;
		this.descriptionService.getLists({...params, pageSize:10000}).subscribe((res: any) => {
			this.loading = false;
			this.dataListAll = res?.data || [];
			if (this.dataListAll?.length > 0) {
				let start = (this.paging?.page - 1) * this.paging.pageSize;
				let end = this.paging?.page * this.paging.pageSize;
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end)
				console.log('xem dữ liệu khi trả về của API',this.dataList[0]);
			}
			this.paging.total = res?.data?.length || 0;
		})
	}

	createItem() {
		this.modalTitle = 'Create Description ';
		this.openModal = true;
		this.typeForm = 1;
	}
	closeModal() {
		this.openModal = false;
		this.typeForm = 0;

	}
	search() {
		this.pageChanged(1);
		// this.getDataListParent({ ...this.paging, page: 1, ...this.formSearch.value })
	}
	resetSearchForm() {
		this.formSearch.reset();
		this.getDataListParent({ ...this.paging, page: 1, ...this.formSearch.value })
	}
	saveItem(data: any) {
		console.log('TypeForm:', this.typeForm);
		console.log('Data received in saveItem:', data);
	
		// Xác thực dữ liệu trước khi gửi cho API
		let form = data.form;
		console.log('Form data before validation:', form);
		if (!form) {
			this.alertService.fireSmall('error', 'Dữ liệu không hợp lệ!');
			this.loading = false;
			return;
		}
	
		// // Kiểm tra các trường dữ liệu cần thiết
		// const requiredFields = ['content', 'descriptionId', 'imageLinks', 'isdelete', 'title'];
		// for (const field of requiredFields) {
		// 	if (!form[field]) {
		// 		console.log(`Missing field: ${field}`);
		// 		this.alertService.fireSmall('error', `Trường ${field} không được để trống!`);
		// 		this.loading = false;
		// 		return;
		// 	}
		// }
	
		if (this.typeForm === 1) {
			// Đối với tạo mới
			this.loading = true;
			this.descriptionService.createOrUpdateData(form).subscribe((res: any) => {
				this.loading = false;
				if (res?.data || res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataListParent({ page: 1, pageSize: 1000 });
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Description failed!");
				}
			});
		} else if (this.typeForm === 2 || this.typeForm === 3) {
			// Đối với chỉnh sửa và xem
			this.loading = true;
			this.descriptionService.createOrUpdateData(form, data.id).subscribe((res: any) => {
				this.loading = false;
				console.log('API response:', res);
				if (res?.data || res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataListParent({ page: 1, pageSize: 10 });
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Description failed!");
				}
			});
		}
	}
	
	selected: any;
	viewItem(id: number) {
		
		const data = this.dataList.find((c: any) => c.descriptionId === id);
		console.log('data view',data);
		this.selected = { ...data };
		this.modalTitle = 'View Description';
		this.openModal = true;
		this.typeForm = 2;
	}
	editItem(id: number) {
		
		const data = this.dataList.find((c: any) => c.descriptionId === id);
		console.log('data edit',data);
		this.selected = { ...data };
		console.log('data selected',this.selected);
		this.modalTitle = 'Edit Description';
		this.openModal = true;
		this.typeForm = 3;

	}
	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Product description ',
			'Are you sure you want to delete this description?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.descriptionService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message?.includes('successfully')) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataListParent({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Product description  deleted failed!");
						}
					})
				}
			})

	}
	formSearch: any = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});
	pageChanged(e: any) {
		this.paging.page = e;
		// this.getDataList({ ...this.paging, ...this.formSearch.value })
		if (this.dataListAll?.length > 0) {
			let start = (this.paging?.page - 1) * this.paging.pageSize;
			let end = this.paging?.page * this.paging.pageSize;
			if(this.formSearch.value?.name) {
				let totalSearch = this.dataListAll?.filter((item: any) => item?.title?.toLowerCase().includes(this.formSearch.value?.name?.toLowerCase().trim()));
				this.paging.total = totalSearch?.length || 0;
				this.dataList = totalSearch?.filter((item: any, index: number) => index >= start && index < end && item?.title?.toLowerCase().includes(this.formSearch.value?.name?.toLowerCase().trim()) )
			} else {
				this.dataList = this.dataListAll?.filter((item: any, index: number) => index >= start && index < end )
			}
		}
	}
}
