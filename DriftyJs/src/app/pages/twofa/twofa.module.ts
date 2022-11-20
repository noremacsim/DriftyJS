import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TwofaPageRoutingModule } from './twofa-routing.module';

import { TwofaPage } from './twofa.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TwofaPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [TwofaPage]
})
export class TwofaPageModule {}
