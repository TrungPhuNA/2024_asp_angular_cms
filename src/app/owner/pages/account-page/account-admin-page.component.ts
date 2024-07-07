import { Component } from '@angular/core';
import { AlertService } from "../../helpers/alert.service";
import { BlogService } from '../../services/blog.service';
import { AccountService } from '../../services/account.service';
import { FormControl, FormGroup } from '@angular/forms';
import { INIT_PAGING } from '../../helpers/constant';

@Component({
	selector: 'app-account-admin-page',
	templateUrl: './account-admin-page.component.html',
	styleUrl: './account-admin-page.component.scss'
})
export class AccountAdminPageComponent {
	dataList: any = [
		{
			"accountId": 1,
			"email": "nguoidung1@example.com",
			"password": "password1                                                   ",
			"fullname": "Ngu?i Dùng M?t",
			"image": "nguoidung1.jpg",
			"phone": "0123456789",
			"dob": "1990-01-01T00:00:00",
			"gender": "Nam",
			"address": "123 Ðu?ng Chính",
			"role": "user",
			"isBan": false,
			"comments": [],
			"notifications": [],
			"orders": [],
			"rooms": []
		},
		{
			"accountId": 2,
			"email": "nguoidung2@example.com",
			"password": "password2                                                   ",
			"fullname": "Ngu?i Dùng Hai",
			"image": "nguoidung2.jpg",
			"phone": "0987654321",
			"dob": "1992-02-02T00:00:00",
			"gender": "N?",
			"address": "456 Ðu?ng Ph?",
			"role": "user",
			"isBan": false,
			"comments": [],
			"notifications": [],
			"orders": [],
			"rooms": []
		},
		{
			"accountId": 3,
			"email": "quantri@example.com",
			"password": "password3                                                   ",
			"fullname": "Qu?n Tr? Viên",
			"image": "quantri.jpg",
			"phone": "0123456780",
			"dob": "1985-03-03T00:00:00",
			"gender": "Nam",
			"address": "789 Ðu?ng Thông",
			"role": "admin",
			"isBan": false,
			"comments": [],
			"notifications": [],
			"orders": [],
			"rooms": []
		},
		{
			"accountId": 4,
			"email": "chu@example.com",
			"password": "password4                                                   ",
			"fullname": "Ch? S? H?u",
			"image": "chu.jpg",
			"phone": "1122334455",
			"dob": "1980-04-04T00:00:00",
			"gender": "N?",
			"address": "101 Ðu?ng Phong",
			"role": "owner",
			"isBan": false,
			"comments": [],
			"notifications": [],
			"orders": [],
			"rooms": []
		},
		{
			"accountId": 5,
			"email": "nhanvien@example.com",
			"password": "password5                                                   ",
			"fullname": "Nhân Viên",
			"image": "nhanvien.jpg",
			"phone": "2233445566",
			"dob": "1988-05-05T00:00:00",
			"gender": "Nam",
			"address": "202 Ðu?ng S?i",
			"role": "staff",
			"isBan": false,
			"comments": [],
			"notifications": [],
			"orders": [],
			"rooms": []
		}
	];
	selectedBrand: any = null;
	modalTitle: string = '';

	createModal: boolean = false;
	showModal: boolean = false;
	openModal: boolean = false;

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
			console.info("===========[getDataListBrand] ===========[res] : ", res);
			this.dataList = res;
			this.paging.total = res?.length || 0;
		})
	}

	toggleSelectAll() {
		// const allSelected = this.brands.every(brand => brand.selected);
		// this.brands.forEach(brand => brand.selected = !allSelected);
	}

	createItem() {
		this.modalTitle = 'Create Account';
		this.openModal = true;
		this.typeForm = 1;
	}

	closeModal() {
		this.openModal = false;
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
				if (res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
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
				if (res?.message?.includes('successfully')) {
					this.alertService.fireSmall('success', res?.message);
					this.closeModal();
					this.getDataList({ page: 1, pageSize: 10 })
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
		this.openModal = true;
		this.typeForm = 2;
	}

	editItem(id: number) {
		const data = this.dataList.find((c: any) => c.accountId === id);
		this.selected = { ...data };
		this.modalTitle = 'Edit Account';
		this.openModal = true;
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
						if (res?.message?.includes('successfully')) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
						} else if (res?.errors) {
							this.alertService.showListError(res?.errors);
						} else {
							this.alertService.fireSmall('error', res?.message || "Delete Account failed!");
						}
					})
				}
			})

	}

	updateBan(id: any, isBan: boolean) {
		this.alertService.fireConfirm(
			`${isBan ? 'Ban' : 'UnBan'} Account`,
			`Are you sure you want to ${isBan ? 'Ban' : 'UnBan'} this Account?`,
			'warning',
			'Cancel',
			'Yes',
		)
			.then((result) => {
				if (result.isConfirmed) {
					this.loading = true;
					this.accountService.updateBan(id, isBan).subscribe((res: any) => {
						this.loading = false;
						if (res?.message?.includes('successfully')) {
							this.alertService.fireSmall('success', res?.message);
							this.getDataList({ page: 1, pageSize: 10 })
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
