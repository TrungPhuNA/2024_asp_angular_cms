import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { AccountService } from '../../services/account.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';

@Component({
    selector: 'app-blog-admin-page',
    templateUrl: './blog-admin-page.component.html',
    styleUrls: ['./blog-admin-page.component.scss']
})
export class BlogAdminPageComponent {
	dataList: any = [
		{
			"ownerId": 1,
			"email": "owner1@example.com",
			"password": "password1                                                   ",
			"fullname": "Ch? s? h?u 1",
			"image": "owner1.jpg",
			"phone": "1234567890",
			"address": "123 Ðu?ng A, Thành ph? A",
			"isBan": false
		},
		{
			"ownerId": 2,
			"email": "owner2@example.com",
			"password": "password2                                                   ",
			"fullname": "Ch? s? h?u 2",
			"image": "owner2.jpg",
			"phone": "0987654321",
			"address": "456 Ðu?ng B, Thành ph? B",
			"isBan": false
		},
		{
			"ownerId": 3,
			"email": "owner3@example.com",
			"password": "password3                                                   ",
			"fullname": "Ch? s? h?u 3",
			"image": "owner3.jpg",
			"phone": "0123456789",
			"address": "789 Ðu?ng C, Thành ph? C",
			"isBan": false
		},
		{
			"ownerId": 4,
			"email": "owner4@example.com",
			"password": "password4                                                   ",
			"fullname": "Ch? s? h?u 4",
			"image": "owner4.jpg",
			"phone": "9876543210",
			"address": "101 Ðu?ng D, Thành ph? D",
			"isBan": false
		},
		{
			"ownerId": 5,
			"email": "owner5@example.com",
			"password": "password5                                                   ",
			"fullname": "Ch? s? h?u 5",
			"image": "owner5.jpg",
			"phone": "1122334455",
			"address": "202 Ðu?ng E, Thành ph? E",
			"isBan": false
		},
		{
			"ownerId": 6,
			"email": "owner6@example.com",
			"password": "password6                                                   ",
			"fullname": "Ch? s? h?u 6",
			"image": "owner6.jpg",
			"phone": "5544332211",
			"address": "303 Ðu?ng F, Thành ph? F",
			"isBan": false
		},
		{
			"ownerId": 7,
			"email": "owner7@example.com",
			"password": "password7                                                   ",
			"fullname": "Ch? s? h?u 7",
			"image": "owner7.jpg",
			"phone": "6677889900",
			"address": "404 Ðu?ng G, Thành ph? G",
			"isBan": false
		},
		{
			"ownerId": 8,
			"email": "owner8@example.com",
			"password": "password8                                                   ",
			"fullname": "Dai hoc FPT",
			"image": "owner8.jpg",
			"phone": "098765678",
			"address": "Can Tho City",
			"isBan": false
		},
		{
			"ownerId": 9,
			"email": "owner9@example.com",
			"password": "password9                                                   ",
			"fullname": "Ch? s? h?u 9",
			"image": "updatehinhanhavatarowner.jpg",
			"phone": "7788990011",
			"address": "606 Ðu?ng I, Thành ph? I",
			"isBan": false
		},
		{
			"ownerId": 10,
			"email": "owner10@example.com",
			"password": "password10                                                  ",
			"fullname": "Ch? s? h?u 10",
			"image": "owner10.jpg",
			"phone": "9900112233",
			"address": "707 Ðu?ng K, Thành ph? K",
			"isBan": false
		},
		{
			"ownerId": 12,
			"email": "shop giay thu 2@example.com",
			"password": "$2a$11$oM531nZ7lFPIamfp/AuecO1By44gnJyY7G8nLWvnLr7jzDJFdpLEO",
			"fullname": "Minh Tuan",
			"image": "image",
			"phone": "0987654321",
			"address": "Can Tho",
			"isBan": false
		}
	];
	selectedBrand: any = null;
	modalTitle: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	updateModal: boolean = false;

	pageName: string = 'accounts';
	paging: any = { ...INIT_PAGING }
	loading = false;

	typeForm = 0;

	constructor(
		private accountService: AccountService,
		private alertService: AlertService
	) {

	}

	breadCrumb: any = [
		{
			label: 'Admin',
			link: '/'
		},
		{
			label: 'Account',
			link: '/admin/account'
		}
	];

	ngOnInit(): void {
		this.getDataList({ ...this.paging })
	}

	getDataList(params: any) {
		this.loading = true;
		this.accountService.getLists(params).subscribe((res: any) => {
			this.loading = false;

			if (res?.result) {
				console.info("===========[getDataListBrand] ===========[res] : ", res);
				this.dataList = res;
				this.paging.total = res?.length || 0;
			}
		})
	}

	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	createItem() {
		this.modalTitle = 'Create Account';
		this.updateModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.createModal = false;
		this.showModal = false;
		this.updateModal = false;
		this.typeForm = 0;

	}

	search() {
		this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
	}

	resetSearchForm() {
		this.formSearch.reset();
		this.search();
	}

	saveItem(data: any) {
		if (this.modalTitle === 'Create Account') {
			this.loading = true;
			this.accountService.createOrUpdateData(data?.form).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Account added successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, page_size: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Add Account failed!");
				}
			})
		} else {
			this.loading = true;
			this.accountService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
				this.loading = false;
				if (res?.message == 'Account updated successfully.') {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, page_size: 10 })
				} else if (res?.errors) {
					this.alertService.showListError(res?.errors);
				} else {
					this.alertService.fireSmall('error', res?.message || "Updated Account failed!");
				}
			})
		}
	}

	selected: any;
	viewItem(id: number) {
		const data = this.dataList.find((c: any) => c.accountId === id);
		this.selected = { ...data };
		this.modalTitle = 'View Account';
		this.updateModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.accountId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Account';
		this.updateModal = true;
		this.typeForm = 3;

	}

	deleteItem(id: number) {
		this.alertService.fireConfirm(
			'Delete Account',
			'Are you sure you want to delete this Account?',
			'warning',
			'Cancel',
			'Delete',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.accountService.deleteData(id).subscribe((res: any) => {
						this.loading = false;
						if (res?.message == 'Account deleted successfully.') {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, page_size: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Account failed!");
						}
					})
				}
			})

	}


	formSearch = new FormGroup({
		id: new FormControl(null),
		name: new FormControl(null)
	});

	pageChanged(e: any) {
		this.paging.page = e;
		this.getDataList({ ...this.paging, ...this.formSearch.value })
	}
	
}

