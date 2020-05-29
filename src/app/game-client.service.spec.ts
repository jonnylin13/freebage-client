import { TestBed } from '@angular/core/testing';

import { GameClientService } from './game-client.service';

describe('GameClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameClientService = TestBed.get(GameClientService);
    expect(service).toBeTruthy();
  });
});
