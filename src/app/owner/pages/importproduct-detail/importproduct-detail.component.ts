import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AlertService } from '../../helpers/alert.service';
import { OwnerService } from '../../services/owner.service';
import { AuthenService } from '../../../admin/services/authen.service';
import { StaffService } from '../../services/staff.service';
import { SizeService } from '../../services/size.service';

@Component({
	selector: 'app-importproduct-detail',
	templateUrl: './importproduct-detail.component.html',
	styleUrl: './importproduct-detail.component.scss'
})
export class ImportproductDetailComponent {
	breadCrumb: any = [
		{
			label: 'Owner',
			link: '/'
		},
		{
			label: 'Import Product Detail',
			link: '/owner/importproduct-detail'
		}
	];
	constructor(
		private productService: ProductService,
		private alertService: AlertService,
		private ownerService: OwnerService,
		private authenService: AuthenService,
		private staffService: StaffService,
		private sizeService: SizeService
	) {

	}
	product = [];
	size = [];
	products = ['Product 1', 'Product 2', 'Product 3']; // danh sách sản phẩm
	sizes = ['Small', 'Medium', 'Large']; // danh sách kích thước
	rows = Array.from({ length: 10 }, () => ({ product: '', size: '', price: 0, quantity: 0 }));
	ngOnInit(): void { }

	addRow() {
		this.rows.push({ product: '', size: '', price: 0, quantity: 0 });
	}

	removeRow(index: number) {
		this.rows.splice(index, 1);
	}
	
	getDataRelation(ownerId: any) {
		this.sizeService.getListSize({ page: 1, pageSize: 100, ownerId }).subscribe((res: any) => {
			if (res?.data) {
				this.size = res;
			}
		});
		this.productService.getLists(ownerId).subscribe((res: any) => {
			this.product = res;
		});

		// this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
		// 	if (res?.data) {
		// 		this.owners = res?.data;
		// 	}
		// });
	}
}
