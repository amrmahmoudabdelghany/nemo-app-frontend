import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerishedInfoComponent } from './perished-info.component';

describe('PerishedInfoComponent', () => {
  let component: PerishedInfoComponent;
  let fixture: ComponentFixture<PerishedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerishedInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerishedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
