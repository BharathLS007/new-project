import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medlist } from './medlist';

describe('Medlist', () => {
  let component: Medlist;
  let fixture: ComponentFixture<Medlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Medlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
