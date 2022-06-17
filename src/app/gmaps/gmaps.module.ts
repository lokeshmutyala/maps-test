import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GmapsComponent } from './gmaps.component';
import { GMapsRoutingModule } from './gmaps.routing.modeule';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [
    GmapsComponent
  ],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACMXPyKB4qJxuhGuj1uCq5CDdBdK8huzU&libraries=visualization'
    }),
    GMapsRoutingModule
  ]
})
export class GmapsModule { }
