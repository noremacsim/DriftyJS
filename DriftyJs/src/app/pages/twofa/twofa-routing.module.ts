import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TwofaPage } from './twofa.page';

const routes: Routes = [
  {
    path: '',
    component: TwofaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwofaPageRoutingModule {}
