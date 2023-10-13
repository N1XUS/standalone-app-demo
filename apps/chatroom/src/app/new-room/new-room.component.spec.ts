import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoomComponent } from './new-room.component';

describe('NewRoomComponent', () => {
  let component: NewRoomComponent;
  let fixture: ComponentFixture<NewRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewRoomComponent]
    });
    fixture = TestBed.createComponent(NewRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
