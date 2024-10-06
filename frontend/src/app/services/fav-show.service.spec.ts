import { TestBed } from '@angular/core/testing';

import { FavShowService } from './fav-show.service';

describe('FavShowService', () => {
  let service: FavShowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavShowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
