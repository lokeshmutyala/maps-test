export interface MarketCoverageData {
    id: number;
    market_name:string;
    state_ut:string;
    goi_market_name: string;
    market_class:string;
    orders:number;
    stores:number;
    ptr:number;
    nrv:number;
    latitude: number;
    longitude:number;
    priority:string;
    type: string;
    created_at: string;
    updated_at: string;
    created_by: number;
}