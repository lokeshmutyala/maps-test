import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NormalMapComponent } from './normal-map.component';



const routes: Routes = [
  {
    path: '',
    component: NormalMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NormalMapRoutingModule {}
