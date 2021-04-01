import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerishedComponent } from './perished.component';

describe('PerishedComponent', () => {
  let component: PerishedComponent;
  let fixture: ComponentFixture<PerishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerishedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
