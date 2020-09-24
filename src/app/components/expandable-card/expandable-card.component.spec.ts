import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpandableCardComponent } from './expandable-card.component';

describe('ExpandableCardComponent', () => {
  let component: ExpandableCardComponent;
  let fixture: ComponentFixture<ExpandableCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
