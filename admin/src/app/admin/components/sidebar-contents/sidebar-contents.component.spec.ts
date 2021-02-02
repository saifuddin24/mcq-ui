import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarContentsComponent } from './sidebar-contents.component';

describe('SidebarContentsComponent', () => {
  let component: SidebarContentsComponent;
  let fixture: ComponentFixture<SidebarContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
