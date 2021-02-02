import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestAssignedListComponent } from './quest-assigned-list.component';

describe('QuestAssignedListComponent', () => {
  let component: QuestAssignedListComponent;
  let fixture: ComponentFixture<QuestAssignedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestAssignedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestAssignedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
