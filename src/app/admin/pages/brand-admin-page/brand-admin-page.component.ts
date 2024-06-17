import { Component } from '@angular/core';

@Component({
  selector: 'app-brand-admin-page',
  templateUrl: './brand-admin-page.component.html',
  styleUrls: ['./brand-admin-page.component.scss']
})
export class BrandAdminPageComponent {
  brands = [
    { id: 1, name: 'Brands 1', image: '/assets/images/brand1.jpg', content: 'Content of brand 1', selected: false },
    { id: 2, name: 'Brands 2', image: '/assets/images/brand2.jpg', content: 'Content of brand 2', selected: false }
  ];

  selectedBrand: any = {};
  modalTitle: string = '';
  showAddNewBrandModal: boolean = false;
  showDetailBrandModal: boolean = false;
  showUpdateBrandModal: boolean = false;
  showDeleteBrandModal: boolean = false;
  currentPage: number = 1;
  totalPages: number = 5;
  pageName: string = 'brands';

  toggleSelectAll() {
    const allSelected = this.brands.every(brand => brand.selected);
    this.brands.forEach(brand => brand.selected = !allSelected);
  }

  openAddNewBrandModal() {
    this.selectedBrand = { id: null, name: '', image: '', content: '', selected: false };
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
    if (this.modalTitle === 'Create brand') {
      brand.id = this.brands.length + 1;
      this.brands.push(brand);
    } else {
      const index = this.brands.findIndex(p => p.id === brand.id);
      this.brands[index] = brand;
    }
    this.closeModal();
  }

  viewBrand(id: number) {
    const brand = this.brands.find(p => p.id === id);
    console.log("brand",brand)
    this.selectedBrand = { ...brand };
    this.modalTitle = 'View brand';
    this.showDetailBrandModal = true;
  }

  editBrand(id: number) {
    const brand = this.brands.find(p => p.id === id);
    this.selectedBrand = { ...brand };
    this.modalTitle = 'Edit brand';
    this.showUpdateBrandModal = true;
  }

  deleteBrand(id: number) {
    this.selectedBrand = this.brands.find(p => p.id === id);
    this.modalTitle = 'Delete brand';
    this.showDeleteBrandModal = true;
  }

  confirmDelete(id: number) {
    this.brands = this.brands.filter(p => p.id !== id);
    this.closeModal();
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
}
