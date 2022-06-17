import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GmapsComponent } from './gmaps.component';


const routes: Routes = [
  {
    path: '',
    component: GmapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GMapsRoutingModule {}
