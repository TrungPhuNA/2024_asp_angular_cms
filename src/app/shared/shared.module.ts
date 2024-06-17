import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './component/loading/loading.component';
import { PaginationComponent } from './component/pagination/pagination.component';
import { NgxLoadingModule } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
	declarations: [
		LoadingComponent,
		PaginationComponent
	],
	imports: [
		CommonModule,
		NgxLoadingModule,
		NgbModule
	],
	exports: [
		LoadingComponent,
		PaginationComponent
	]
})
export class SharedDataModule { }
