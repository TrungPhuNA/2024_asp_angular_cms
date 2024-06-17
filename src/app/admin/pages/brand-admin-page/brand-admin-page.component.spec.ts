import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandAdminPageComponent } from './brand-admin-page.component';

describe('BrandAdminPageComponent', () => {
  let component: BrandAdminPageComponent;
  let fixture: ComponentFixture<BrandAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandAdminPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
