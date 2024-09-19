import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListComponent } from './my-list.component';

describe('MyListComponent', () => {
  let component: MyListComponent;
  let fixture: ComponentFixture<MyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
