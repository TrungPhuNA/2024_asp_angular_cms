import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

	constructor(
        private baseApiService: BaseApiService
    ) { }


    getLists(params: any) {
        return this.baseApiService.getMethod('Advertisement/GetAllAdvertisements', params);
    }

    show(id: any) {
        return this.baseApiService.getMethod(`Advertisement/${id}`, {});
    }

    createOrUpdateData(data: any, id?: any) {
		const formData = this.baseApiService.setFormData(data);
        if(id) {
			
            return this.baseApiService.putMethod(`Advertisement/UpdateAdvertisement`, formData);
        }
        return this.baseApiService.postMethod('Advertisement/CreateAdvertisement', formData);
    }

    deleteData(id: any) {
        return this.baseApiService.deleteMethod(`Advertisement/${id}`);
    }
    updateStatus(adId: number, statusPostId: number) {
        // Tạo URL với các tham số query string
        const url = `Advertisement/UpdateStatusAdvertisementById?adId=${adId}&StatusPostId=${statusPostId}`;
        console.log('URL update status', url);
        
        // Gửi yêu cầu PUT với URL
        return this.baseApiService.putMethod(url, true);
    }
}
