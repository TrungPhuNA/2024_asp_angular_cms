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
        this.selectedBrand = {id: null, name: '', image: '', content: '', selected: false};
        this.modalTitle = 'Create brand';
        this.showAddNewBrandModal = true;
    }

    closeModal() {
        this.showAddNewBrandModal = false;
        this.showDetailBrandModal = false;
        this.showUpdateBrandModal = false;
        this.showDeleteBrandModal = false;
    }

    saveBrand(brand: any) {
        // if (this.modalTitle === 'Create brand') {
        //     brand.id = this.brands.length + 1;
        //     this.brands.push(brand);
        // } else {
        //     const index = this.brands.findIndex(p => p.brandId === brand.id);
        //     this.brands[index] = brand;
        // }
        // this.closeModal();
    }

    viewBrand(id: number) {
        // const brand = this.brands.find(p => p.brandId === id);
        // console.log("brand", brand)
        // this.selectedBrand = {...brand};
        // this.modalTitle = 'View brand';
        // this.showDetailBrandModal = true;
    }

    editBrand(id: number) {
        // const brand = this.brands.find(p => p.brandId === id);
        // this.selectedBrand = {...brand};
        // this.modalTitle = 'Edit brand';
        // this.showUpdateBrandModal = true;
    }

    deleteBrand(id: number) {

    }

    confirmDelete(id: number) {
        // this.brands = this.brands.filter(p => p.brandId !== id);
        // this.closeModal();
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
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
