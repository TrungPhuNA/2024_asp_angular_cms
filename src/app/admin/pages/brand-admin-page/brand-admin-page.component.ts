import {Component} from '@angular/core';
import {AlertService} from "../../../service/admin/alert.service";
import {INIT_PAGING} from "../../../service/constant";
import {BrandService} from "../../../service/admin/brand.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-brand-admin-page',
    templateUrl: './brand-admin-page.component.html',
    styleUrls: ['./brand-admin-page.component.scss']
})
export class BrandAdminPageComponent {
    brands : any = {}
    selectedBrand: any = {};
    modalTitle: string = '';
    showAddNewBrandModal: boolean = false;
    showDetailBrandModal: boolean = false;
    showUpdateBrandModal: boolean = false;
    showDeleteBrandModal: boolean = false;
    currentPage: number = 1;
    totalPages: number = 5;
    pageName: string = 'brands';
    paging: any = { ...INIT_PAGING }
    loading = false;

    constructor(
        private brandService: BrandService,
        private alertService: AlertService
    ) {

    }

    breadCrumb: any = [
        {
            label: 'Admin',
            link: '/'
        },
        {
            label: 'Brand',
            link: '/admin/brand'
        }
    ];

    ngOnInit(): void {
        this.getDataList({ ...this.paging })
    }

    getDataList(params: any) {
        this.loading = true;
        this.brandService.getLists(params).subscribe((res: any) => {
            console.info("===========[getDataListBrand] ===========[res] : ",res);
            this.loading = false;
            this.brands = res;
            this.paging.total = res?.length || 0;
        })
    }

    toggleSelectAll() {
        // const allSelected = this.brands.every(brand => brand.selected);
        // this.brands.forEach(brand => brand.selected = !allSelected);
    }

    openAddNewBrandModal() {
        this.selectedBrand = { id: null, name: '', image: '', content: '', selected: false };
        this.modalTitle = 'Create Brand';
        this.showAddNewBrandModal = true;
    }

    closeModal() {
        this.showAddNewBrandModal = false;
        this.showDetailBrandModal = false;
        this.showUpdateBrandModal = false;
        this.showDeleteBrandModal = false;
    }

    search() {
        this.getDataList({ ...this.paging, page: 1, ...this.formSearch.value })
    }

    resetSearchForm() {
        this.formSearch.reset();
        this.search();
    }

    saveItem(data: any) {
        if (this.modalTitle === 'Create Brand') {
            // category.id = this.categories.length + 1;
            // this.categories.push(category);
            this.loading = true;
            this.brandService.createOrUpdateData(data?.form).subscribe((res: any) => {
                this.loading = false;
                if (res?.message == 'Brand added successfully.') {
                    this.alertService.fireSmall('success', res?.message);
                    this.closeModal();
                    this.getDataList({page: 1, page_size: 10})
                } else if (res?.errors) {
                    this.alertService.showListError(res?.errors);
                } else {
                    this.alertService.fireSmall('error', "Add Brand failed!");
                }
            })
        } else {
            this.loading = true;
            this.brandService.createOrUpdateData(data?.form, data.id).subscribe((res: any) => {
                this.loading = false;
                if (res?.message == 'Brand updated successfully.') {
                    this.alertService.fireSmall('success', res?.message);
                    this.closeModal();
                    this.getDataList({page: 1, page_size: 10})
                } else if (res?.errors) {
                    this.alertService.showListError(res?.errors);
                } else {
                    this.alertService.fireSmall('error', "Updated Brand failed!");
                }
            })
        }
    }

    viewItem(id: number) {
        // const category = this.categories.find((c: any) => c.categoryId === id);
        // this.selectedCategory = { ...category };
        // this.modalTitle = 'View Category';
        // this.showDetailCategoryModal = true;
    }

    editItem(id: number) {
        // const category = this.categories.find((c: any) => c.categoryId === id);
        // this.selectedCategory = { ...category };
        // this.modalTitle = 'Edit Category';
        // this.showUpdateCategoryModal = true;
    }

    deleteItem(id: number) {
        // this.alertService.fireConfirm(
        //     'Delete Category',
        //     'Are you sure you want to delete this category?',
        //     'warning',
        //     'Cancel',
        //     'Delete',
        // )
        //     .then((result) => {
        //         if (result.isConfirmed) {
        //             this.loading = true;
        //             this.categoryService.deleteData(id).subscribe((res: any) => {
        //                 this.loading = false;
        //                 if (res?.message == 'Category deleted successfully.') {
        //                     this.alertService.fireSmall('success', res?.message);
        //                     this.getDataList({page: 1, page_size: 10})
        //                 } else if (res?.errors) {
        //                     this.alertService.showListError(res?.errors);
        //                 } else {
        //                     this.alertService.fireSmall('error', "Delete Category failed!");
        //                 }
        //             })
        //         }
        //     })

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
