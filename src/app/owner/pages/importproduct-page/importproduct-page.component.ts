import { Component } from '@angular/core';
interface Product {
  code: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  productCode: string;
  productName: string;
  quantity: number;
  price: number;
}
@Component({
  selector: 'app-importproduct-page',
  templateUrl: './importproduct-page.component.html',
  styleUrl: './importproduct-page.component.scss'
})
export class ImportproductPageComponent {
  products: Product[] = [
    { code: 'LP13', name: 'Laptop HP 15s-fq2663TU', quantity: 19, price: 9990000 },
    { code: 'LP14', name: 'Laptop Lenovo IdeaPad 5 Pro 16IAH7', quantity: 3, price: 25190000 },
    // Thêm các sản phẩm khác ở đây
  ];

  orderDetails: OrderDetail[] = [
    { productCode: 'LP13', productName: 'Laptop HP 15s-fq2663TU', quantity: 4, price: 9990000 },
    { productCode: 'LP15', productName: 'Laptop Lenovo IdeaPad 5 Pro 16IAH7', quantity: 1, price: 25190000 },
    // Thêm chi tiết đơn hàng khác ở đây
  ];

  displayedColumns: string[] = ['code', 'name', 'quantity', 'price'];
  orderDisplayedColumns: string[] = ['stt', 'productCode', 'productName', 'quantity', 'price'];

  get totalAmount() {
    return this.orderDetails.reduce((total, detail) => total + (detail.quantity * detail.price), 0);
  }
}
