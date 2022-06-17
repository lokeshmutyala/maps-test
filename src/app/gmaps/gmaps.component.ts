import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MarketCoverageData } from 'src/models/app.models';
import { PaginatedResponse } from '../commons/models/common.models';
import { BaseAPI } from '../services/api/base.api';
import { mapOf } from '../utils/utils-function';

@Component({
  selector: 'app-gmaps',
  templateUrl: 'gmaps.component.html',
  styleUrls: ['gmaps.component.scss'],
})
export class GmapsComponent implements OnInit {
  lat = 17.34531;
  lng = 78.334452;
  zoom= 6;
  mapTypeControl=true;
  mapTypeControlOptions={
          mapTypeIds:["hybrid", "roadmap", "satellite", "terrain"],
          position: 1,
          style: "terrain"
      };
private map: google.maps.Map = null;
private heatmap: google.maps.visualization.HeatmapLayer = null;
public coveragedata$: Observable<Array<MarketCoverageData>>;
private coverageData: Array<MarketCoverageData>;
  constructor(
    private baseAPI: BaseAPI
    ) {
    
   }

  ngOnInit() {}

  setMapData(){
    var heatMapData = [];
    this.coverageData.forEach(data=>{
      heatMapData.push({location: new google.maps.LatLng(data.latitude, data.longitude), weight: data.orders})
    })
// const coords: google.maps.LatLng[] = [new google.maps.LatLng(17.3232, 78.4783),
    //   new google.maps.LatLng(17.3333, 78.47655)];
    this.heatmap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        data: heatMapData,
        radius:20
    });
  }
  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
    
    let params:Map<string, any>= new Map();
    params.set('page_size',10000);
    this.baseAPI.executeGet({ url: "/portal/api/market-coverage/", params:params }).subscribe((response: PaginatedResponse<MarketCoverageData>) => {
      this.coverageData = response.results;
      this.setMapData();
    })
  }

}
