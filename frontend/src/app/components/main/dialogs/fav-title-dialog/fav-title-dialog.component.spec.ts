import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavTitleDialogComponent } from './fav-title-dialog.component';

describe('FavTitleDialogComponent', () => {
  let component: FavTitleDialogComponent;
  let fixture: ComponentFixture<FavTitleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavTitleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavTitleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
