import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformationComponent } from './message.component';

describe('MessageComponent', () => {
  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;

  beforeEach(async(() => {
    // @ts-ignore
    TestBed.configureTestingModule({
      declarations: [ InformationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    // @ts-ignore
    fixture = TestBed.createComponent(InformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
