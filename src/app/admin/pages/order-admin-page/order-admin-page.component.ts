import { Component } from '@angular/core';

@Component({
  selector: 'app-order-admin-page',
  templateUrl: './order-admin-page.component.html',
  styleUrls: ['./order-admin-page.component.scss']
})
export class OrderAdminPageComponent {
  orders = [
    { id: 1, name: 'Order 1', image: '/assets/images/order1.jpg', content: 'Content of order 1', selected: false },
    { id: 2, name: 'Order 2', image: '/assets/images/order2.jpg', content: 'Content of order 2', selected: false }
  ];

  selectedOrder: any = {};
  modalTitle: string = '';
  showAddNewOrderModal: boolean = false;
  showDetailOrderModal: boolean = false;
  showUpdateOrderModal: boolean = false;
  showDeleteOrderModal: boolean = false;
  currentPage: number = 1;
  totalPages: number = 5;
  pageName: string = 'orders';

  toggleSelectAll() {
    const allSelected = this.orders.every(order => order.selected);
    this.orders.forEach(order => order.selected = !allSelected);
  }

  openAddNewOrderModal() {
    this.selectedOrder = { id: null, name: '', image: '', content: '', selected: false };
    this.modalTitle = 'Create order';
    this.showAddNewOrderModal = true;
  }

  closeModal() {
    this.showAddNewOrderModal = false;
    this.showDetailOrderModal = false;
    this.showUpdateOrderModal = false;
    this.showDeleteOrderModal = false;
  }

  saveOrder(order: any) {
    if (this.modalTitle === 'Create order') {
      order.id = this.orders.length + 1;
      this.orders.push(order);
    } else {
      const index = this.orders.findIndex(o => o.id === order.id);
      this.orders[index] = order;
    }
    this.closeModal();
  }

  viewOrder(id: number) {
    const order = this.orders.find(o => o.id === id);
    console.log("order",order)
    this.selectedOrder = { ...order };
    this.modalTitle = 'View order';
    this.showDetailOrderModal = true;
  }

  editOrder(id: number) {
    const order = this.orders.find(o => o.id === id);
    this.selectedOrder = { ...order };
    this.modalTitle = 'Edit order';
    this.showUpdateOrderModal = true;
  }

  deleteOrder(id: number) {
    this.selectedOrder = this.orders.find(o => o.id === id);
    this.modalTitle = 'Delete order';
    this.showDeleteOrderModal = true;
  }

  confirmDelete(id: number) {
    this.orders = this.orders.filter(o => o.id !== id);
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
