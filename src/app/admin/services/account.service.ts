import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class AccountService {

	constructor(
		private baseApiService: BaseApiService
	) { }


	getLists(params: any) {
		return this.baseApiService.getMethod('Account', params);
	}

	show(id: any) {
		return this.baseApiService.getMethod(`Account/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		const formData = new FormData();
		formData.append('Name', params?.Name);
		formData.append('Image', params?.Image);
		formData.append('CategoryId', params?.CategoryId);
		if (id) {
			return this.baseApiService.putMethod(`Account/${id}`, formData);
		}
		return this.baseApiService.postMethod('Account', formData);
	}

	deleteData(id: any) {
		return this.baseApiService.deleteMethod(`Account/${id}`);
	}
}
