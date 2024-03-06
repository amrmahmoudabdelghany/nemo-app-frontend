import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerishedFormComponent } from './perished-form.component';

describe('PerishedFormComponent', () => {
  let component: PerishedFormComponent;
  let fixture: ComponentFixture<PerishedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerishedFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerishedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
