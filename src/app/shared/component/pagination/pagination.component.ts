import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

	@Input() paging: any = {
		page: 1,
		page_size: 20,
		total: 0
	};

	@Input() title: string = 'Total';
	@Input() endTitle: string = '';

	@Output() changePaged = new EventEmitter();

	defaultClass = {
		pageSize: 15,
		paginationClass: 'pagination justify-content-end mb-5 mt-5',
	}

	ngOnChanges(changes: SimpleChanges): void {
	}

	changed(e: any) {
		this.changePaged.emit(e);
	}
}
