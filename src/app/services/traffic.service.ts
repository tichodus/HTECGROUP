import { Injectable } from "@angular/core";
import { RequestService } from "./RequestService.service";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
import { Traffic } from "../models/traffic";
import { Car } from "../models/car";
import { SpeedLimit } from "../models/speed-limit";
import { TrafficLight } from "../models/traffic-light";

@Injectable()
export class TrafficService {

    constructor(private requestService: RequestService<any>) { }

    public getTraffic(): Observable<Traffic> {
        return this.requestService.createGetRequest("", "").map(res => { return new Traffic(res.distance,res.cars,res.speed_limits,res.traffic_lights)});
    }

}