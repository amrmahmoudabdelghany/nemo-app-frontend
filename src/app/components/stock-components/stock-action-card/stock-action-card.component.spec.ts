import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockActionCardComponent } from './stock-action-card.component';

describe('StockActionCardComponent', () => {
  let component: StockActionCardComponent;
  let fixture: ComponentFixture<StockActionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockActionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
