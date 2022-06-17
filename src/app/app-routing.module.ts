import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./gmaps/gmaps.module').then(m => m.GmapsModule)
  },
  {
    path: 'normal-maps',
    loadChildren: () => import('./normal-map/normal-map.module').then(m => m.NormalMapModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
