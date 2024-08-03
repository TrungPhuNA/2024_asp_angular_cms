import { Injectable } from '@angular/core';
import { BaseApiService } from '../helpers/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

	constructor(
        private baseApiService: BaseApiService
    ) { }


    getLists(params: any) {
        return this.baseApiService.getMethod('Description/GetAllDescriptions', params);
    }

    show(id: any) {
        return this.baseApiService.getMethod(`Description/GetDescriptionById/${id}`, {});
    }

    createOrUpdateData(data: any, id?: any) {
        // Tạo FormData
        let formData = new FormData();
        
        // Thêm dữ liệu vào FormData
        formData.append('descriptionId', data.DescriptionId ?? id);
        formData.append('title', data.Title);
        formData.append('content', data.Content);
        formData.append('images', data.Image); // Có thể cần thay đổi tùy thuộc vào kiểu dữ liệu
    
        // Kiểm tra giá trị của Isdelete trước khi gọi toString()
        const isDeleteValue = data.Isdelete !== undefined ? data.Isdelete.toString() : 'false'; // Hoặc giá trị mặc định khác nếu cần
        formData.append('isdelete', isDeleteValue);
    
        // Kiểm tra nội dung của FormData
        formData.forEach((value, key) => {
            console.log(`FormData key: ${key}, value: ${value}`);
        });
    
        // Kiểm tra URL và phương thức yêu cầu
        if (id) {
			formData.append('DescriptionId', id)
            return this.baseApiService.putMethod(`Description/UpdateDesctiption`, formData); // Cập nhật URL nếu cần
        }
    
        console.log('Creating new entry');
        return this.baseApiService.postMethod('Description/UpdateDesctiption', formData);
    }
    
    deleteData(id: any) {
        return this.baseApiService.patchMethod(`Description/DeleteDescription/${id}`, {});
    }
}
