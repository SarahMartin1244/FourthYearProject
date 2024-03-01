import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTicketsComponent } from './view-tickets.component';

describe('ViewTicketsComponent', () => {
  let component: ViewTicketsComponent;
  let fixture: ComponentFixture<ViewTicketsComponent>;

  beforeEach(async () => {
    // Configure the testing module
    await TestBed.configureTestingModule({
      declarations: [ViewTicketsComponent]
    })
    .compileComponents(); // Compile the component

    // Create a new instance of the component
    fixture = TestBed.createComponent(ViewTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detect changes
  });

  // Test if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
