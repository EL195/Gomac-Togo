import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetraitlistPage } from './retraitlist.page';

describe('RetraitlistPage', () => {
  let component: RetraitlistPage;
  let fixture: ComponentFixture<RetraitlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetraitlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RetraitlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
