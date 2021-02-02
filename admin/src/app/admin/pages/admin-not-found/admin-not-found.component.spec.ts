import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotFoundComponent } from './admin-not-found.component';

describe('AdminNotFoundComponent', () => {
  let component: AdminNotFoundComponent;
  let fixture: ComponentFixture<AdminNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
