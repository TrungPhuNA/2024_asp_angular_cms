import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
	providedIn: 'root'
})
export class OwnerService {

	constructor(
		private baseApiService: BaseApiService
	) { }

	getLists(params: any) {
		return this.baseApiService.getMethod('Owner/GetAllOwners', params);
	}

	show(id: any) {
		return this.baseApiService.getMethod(`Owner/GetOwnerById/${id}`, {});
	}

	createOrUpdateData(params: any, id?: any) {
		if (id) {
			return this.baseApiService.putMethod(`Owner/UpdateOwner`, params, true);
		}
		return this.baseApiService.postMethod('Owner/CreateOwner', params, true);
	}

	updateOwnerProfile(data: any) {
		return this.baseApiService.putMethod(`Owner/UpdateProfileOwner`, data, true);
	}

	updateOwnerImage(data: any) {
		// Viết api đần vậy, sao ko 1 api update all trừ password, méo thể hiểu nổi tư duy
		const params = this.baseApiService.setFormData(data);
		return this.baseApiService.putMethod(`Owner/UpdateAvatarOwner`, params);
	}

	changePassword(data: any) {
		// Viết api đần vậy, sao ko 1 api update all trừ password, méo thể hiểu nổi tư duy
		// Lúc thì form data, lúc thì json, méo thể hiểu nổi
		const params = this.baseApiService.setFormData(data);
		return this.baseApiService.putMethod(`Owner/ChangePasswordOwner`, data, true);
	}

	updateBan(id: any, status: any) {
		let url = `Owner/${id}/`;
		if (!status) {
			url += 'UnBanOwner'
		} else {
			url += 'BanOwner'
		}
		return this.baseApiService.patchMethod(url, {}, true);

	}
}
