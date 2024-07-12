import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class StaffService {

	constructor(
		private baseApiService: BaseApiService
	) { }

	getLists(params: any) {
		return this.baseApiService.getMethod('Staff/GetAllStaffs', params);
	}

	show(id: any) {
		return this.baseApiService.getMethod(`Staff/GetOwnerById/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		if (id) {
			return this.baseApiService.putMethod(`Staff/UpdateStaff`, params, true);
		}
		return this.baseApiService.postMethod('Staff/CreateStaff', params, true);
	}

	DeleteData(id: any, status: any) {
		let url = `Staff/${id}/`;
		if (!status) {
			url += `DeleteStaff/${id}`
		}
		return this.baseApiService.patchMethod(url, {}, true);

	}
}
