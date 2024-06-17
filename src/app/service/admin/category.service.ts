import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../constant';
import { catchError } from 'rxjs';
import { BaseApiService } from '../base-api.service';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	constructor(
		private baseApiService: BaseApiService
	) { }


	getListCategory(params: any) {
		return this.baseApiService.getMethod('Category', params);
	}

	showCategory(id: any) {
		return this.baseApiService.getMethod(`Category/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		if(id) {
			return this.baseApiService.putMethod(`Category/${id}`, params);
		}
		return this.baseApiService.postMethod('Category', params);
	}

	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`Category/${id}`);
	}


}
