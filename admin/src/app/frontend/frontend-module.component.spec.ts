import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendModuleComponent } from './frontend-module.component';

describe('FrontendModuleComponent', () => {
  let component: FrontendModuleComponent;
  let fixture: ComponentFixture<FrontendModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontendModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
