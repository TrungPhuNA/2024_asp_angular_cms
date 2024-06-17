import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCategoryComponent } from './detail-category.component';

describe('DetailProductComponent', () => {
  let component: DetailCategoryComponent;
  let fixture: ComponentFixture<DetailCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
