import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBuyFormComponent } from './stock-buy-form.component';

describe('StockBuyFormComponent', () => {
  let component: StockBuyFormComponent;
  let fixture: ComponentFixture<StockBuyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockBuyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBuyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
