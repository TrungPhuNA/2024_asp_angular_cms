import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-detail-category',
	templateUrl: './detail-category.component.html',
	styleUrls: ['./detail-category.component.scss']
})
export class DetailCategoryComponent {
	@Input() categoryParents: any = [];
	@Input() category: any = {};
	@Input() modalTitle: string = '';
	@Input() isVisible: boolean = false;
	@Output() close = new EventEmitter<void>();

	parent: any

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		if(this.category?.cateParent) {
			this.parent = this.category?.cateParent?.name
		}
	}

	closeModal() {
		this.close.emit();
	}
}
