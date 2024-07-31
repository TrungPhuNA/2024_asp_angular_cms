import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(
        private baseApiService: BaseApiService
    ) { }


    getLists(params: any) {

         if (params.codeOrder) {
            // Search by codeOrder
            return this.baseApiService.getMethod(`Order/search?codeOrder=${params.codeOrder}`, {});
        } else {
            // Fetch list with other parameters
            return this.baseApiService.getMethod(`Order/owner/${params.ownerId}`, {});
        }
    }

    show(id: any) {
        return this.baseApiService.getMethod(`order/${id}`, {});
    }
    status(id: number, statusId: number) {
        return this.baseApiService.putMethod(`Order/confirm/${id}/${statusId}`, {});
    }
    detail(id: any){
        return this.baseApiService.getMethod(`OrderDetail/${id}`, {});
    }
    createOrUpdateData(formData: any, id?: any) {

        if (id) {
            return this.baseApiService.putMethod(`order/${id}`, formData);
        }
        return this.baseApiService.postMethod('order', formData);
    }

    deleteData(id: any) {
        return this.baseApiService.deleteMethod(`order/${id}`);
    }
}
