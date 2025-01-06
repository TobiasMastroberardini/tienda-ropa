import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCartComponent } from './card-cart.component';

describe('CardCartComponent', () => {
  let component: CardCartComponent;
  let fixture: ComponentFixture<CardCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
