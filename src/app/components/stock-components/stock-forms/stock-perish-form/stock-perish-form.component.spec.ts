import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPerishFormComponent } from './stock-perish-form.component';

describe('StockPerishFormComponent', () => {
  let component: StockPerishFormComponent;
  let fixture: ComponentFixture<StockPerishFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockPerishFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockPerishFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
