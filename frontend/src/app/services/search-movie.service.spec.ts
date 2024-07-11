import { TestBed } from '@angular/core/testing';

import { SearchMovieService } from './search-movie.service';

describe('SearchMovieService', () => {
  let service: SearchMovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchMovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
