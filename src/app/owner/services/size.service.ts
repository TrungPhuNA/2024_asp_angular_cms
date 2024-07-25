import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';
@Injectable({
  providedIn: 'root'
})
export class SizeService {

  constructor(
		private baseApiService: BaseApiService
	) { }
  getListSize(params: any) {
    const { searchQuery, page, pageSize, ownerId } = params;
		return this.baseApiService.getMethod('Size/GetAllSizes', { searchQuery, page, pageSize, ownerId });
	}
  show(id: any) {
    return this.baseApiService.getMethod(`Size/GetSizeById/${id}`, {});
}
  createOrUpdateData(formData: any, id?: any) {
       
    if(id) {
        return this.baseApiService.putMethod(`Size/UpdateSize`, formData, true);
    }
    return this.baseApiService.postMethod('Size/CreateSize', formData, true);
}
  deleteDataSize(id: any) {
		return this.baseApiService.patchMethod(`Size/DeleteSize/${id}`, {});
	}
}