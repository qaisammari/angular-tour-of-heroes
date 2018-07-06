import { TestBed, inject } from '@angular/core/testing';

import { ItemsListService } from './items-list.service';

describe('ItemsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemsListService]
    });
  });

  it('should be created', inject([ItemsListService], (service: ItemsListService) => {
    expect(service).toBeTruthy();
  }));
});
