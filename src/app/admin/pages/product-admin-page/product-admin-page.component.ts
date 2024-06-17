import { Component } from '@angular/core';

@Component({
  selector: 'app-product-admin-page',
  templateUrl: './product-admin-page.component.html',
  styleUrls: ['./product-admin-page.component.scss']
})
export class ProductAdminPageComponent {
  products = [
    { id: 1, name: 'Product 1', image: '/assets/images/product1.jpg', content: 'Content of Product 1', selected: false },
    { id: 2, name: 'Product 2', image: '/assets/images/product2.jpg', content: 'Content of Product 2', selected: false }
  ];

  selectedProduct: any = {};
  modalTitle: string = '';
  showAddNewProductModal: boolean = false;
  showDetailProductModal: boolean = false;
  showUpdateProductModal: boolean = false;
  showDeleteProductModal: boolean = false;
  currentPage: number = 1;
  totalPages: number = 5;
  pageName: string = 'products';

  toggleSelectAll() {
    const allSelected = this.products.every(product => product.selected);
    this.products.forEach(product => product.selected = !allSelected);
  }

  openAddNewProductModal() {
    this.selectedProduct = { id: null, name: '', image: '', content: '', selected: false };
    this.modalTitle = 'Create Product';
    this.showAddNewProductModal = true;
  }

  closeModal() {
    this.showAddNewProductModal = false;
    this.showDetailProductModal = false;
    this.showUpdateProductModal = false;
    this.showDeleteProductModal = false;
  }

  saveProduct(product: any) {
    if (this.modalTitle === 'Create Product') {
      product.id = this.products.length + 1;
      this.products.push(product);
    } else {
      const index = this.products.findIndex(p => p.id === product.id);
      this.products[index] = product;
    }
    this.closeModal();
  }

  viewProduct(id: number) {
    const product = this.products.find(p => p.id === id);
    console.log("product",product)
    this.selectedProduct = { ...product };
    this.modalTitle = 'View Product';
    this.showDetailProductModal = true;
  }

  editProduct(id: number) {
    const product = this.products.find(p => p.id === id);
    this.selectedProduct = { ...product };
    this.modalTitle = 'Edit Product';
    this.showUpdateProductModal = true;
  }

  deleteProduct(id: number) {
    this.selectedProduct = this.products.find(p => p.id === id);
    this.modalTitle = 'Delete Product';
    this.showDeleteProductModal = true;
  }

  confirmDelete(id: number) {
    this.products = this.products.filter(p => p.id !== id);
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
