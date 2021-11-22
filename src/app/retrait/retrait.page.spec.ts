import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetraitPage } from './retrait.page';

describe('RetraitPage', () => {
  let component: RetraitPage;
  let fixture: ComponentFixture<RetraitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetraitPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RetraitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
