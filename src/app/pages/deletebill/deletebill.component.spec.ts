import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletebillComponent } from './deletebill.component';

describe('DeletebillComponent', () => {
  let component: DeletebillComponent;
  let fixture: ComponentFixture<DeletebillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletebillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletebillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
