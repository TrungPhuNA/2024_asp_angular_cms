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
	ownerId: number | null = null;
	userType: string = '';
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
	products = ['Product 1', 'Product 2', 'Product 3'];
	sizes = ['Small', 'Medium', 'Large'];
	rows = Array.from({ length: 10 }, () => ({ product: '', size: '', price: 0, quantity: 0 }));
	ngOnInit(): void {
		const user = this.authenService.getUser();
		this.userType = user?.userType ?? '';
		this.ownerId = user?.id ?? null;
		if (this.userType == 'Staff') (
			this.staffService.show(user?.id ?? null).subscribe((res: any) => {
				this.ownerId = res?.data?.ownerId;
				console.log('ID của Onwer', this.ownerId)
				console.log('Lấy ID của Staff xong lấy OwnerId')
				if (this.userType === 'Owner' || this.userType === 'Staff') {
					console.log('id này số mấy', this.ownerId);
					
				}
			})
		);
		this.getDataRelation(this.ownerId);
	 }
	
	getDataRelation(ownerId: any) {
		this.sizeService.getListSize({ page: 1, pageSize: 100, ownerId }).subscribe((res: any) => {
			if (res?.data) {
				this.size = res;
				console.log('data',res.data)
				console.log('data',this.size);
			}
		});
		this.productService.getLists(ownerId).subscribe((res: any) => {
			this.product = res;
			console.log('data',res)
			console.log('data',this.product)
		});

		// this.ownerService.getLists({ page: 1, pageSize: 100 }).subscribe((res: any) => {
		// 	if (res?.data) {
		// 		this.owners = res?.data;
		// 	}
		// });
	}
	addRow() {
		this.rows.push({ product: '', size: '', price: 0, quantity: 0 });
	}

	removeRow(index: number) {
		if (this.rows.length > 1) {
			this.rows.splice(index, 1);
		}
	}

	isRowDisabled(index: number): boolean {
		if (index === 0) {
			return false; // Always allow editing for the first row
		}
	
		const prevRow = this.rows[index - 1];
		const isPreviousRowComplete = prevRow.product && prevRow.size && prevRow.price > 0 && prevRow.quantity > 0;
	
		return !isPreviousRowComplete;
	}
	
	
}
