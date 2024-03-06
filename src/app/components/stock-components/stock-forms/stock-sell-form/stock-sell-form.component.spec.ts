import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSellFormComponent } from './stock-sell-form.component';

describe('StockFormsComponent', () => {
  let component: StockSellFormComponent;
  let fixture: ComponentFixture<StockSellFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockSellFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSellFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
