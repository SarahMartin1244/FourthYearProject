import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedQueueTicketsComponent } from './shared-queue-tickets.component';

describe('SharedQueueTicketsComponent', () => {
  let component: SharedQueueTicketsComponent;
  let fixture: ComponentFixture<SharedQueueTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedQueueTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedQueueTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
