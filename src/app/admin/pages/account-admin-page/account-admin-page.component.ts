import {Component} from '@angular/core';
import {AlertService} from "../../helpers/alert.service";
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
	dataList : any = []
    selectedBrand: any = null;
    modalTitle: string = '';

    createModal: boolean = false;
    showModal: boolean = false;
    updateModal: boolean = false;

    pageName: string = 'brands';
    paging: any = { ...INIT_PAGING }
    loading = false;

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
            console.info("===========[getDataListBrand] ===========[res] : ",res);
            this.loading = false;
            this.dataList = res;
            this.paging.total = res?.length || 0;
        })
    }

    toggleSelectAll() {
        // const allSelected = this.brands.every(brand => brand.selected);
        // this.brands.forEach(brand => brand.selected = !allSelected);
    }

    openAddNewBrandModal() {
        this.selectedBrand = { id: null, name: '', image: '', content: '', selected: false };
        this.modalTitle = 'Create Account';
        this.createModal = true;
    }

    closeModal() {
        this.createModal = false;
        this.showModal = false;
        this.updateModal = false;
		
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
            // category.id = this.categories.length + 1;
            // this.categories.push(category);
            this.loading = true;
            this.accountService.createOrUpdateData(data?.form).subscribe((res: any) => {
                this.loading = false;
                if (res?.message == 'Account added successfully.') {
                    this.alertService.fireSmall('success', res?.message);
                    this.closeModal();
                    this.getDataList({page: 1, page_size: 10})
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
                    this.getDataList({page: 1, page_size: 10})
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
        this.showModal = true;
    }

    editItem(id: number) {
		const data = this.dataList.find((c: any) => c.accountId === id);
        this.selected = { ...data };
        this.modalTitle = 'Edit Account';
        this.updateModal = true;
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
                            this.getDataList({page: 1, page_size: 10})
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
