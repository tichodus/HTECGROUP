import { Car } from "./car";
import { SpeedLimit } from "./speed-limit";
import { TrafficLight } from "./traffic-light";

export class Traffic{
    private _distance:number;
    private _cars:Array<Car>;
    private _speedLimits:Array<SpeedLimit>;
    private _trafficLights:Array<TrafficLight>;

    constructor(distance:number, cars:Array<Car>, speedLimits:Array<SpeedLimit>, trafficLights:Array<TrafficLight>){
        this._distance = distance;
        this._cars = cars;
        this._speedLimits = speedLimits;
        this._trafficLights = trafficLights;
    }

    
	public get distance(): number {
		return this._distance;
	}

	public get cars(): Array<Car> {
		return this._cars;
	}

	public set cars(value: Array<Car>) {
		this._cars = value;
	}

	public get speedLimits(): Array<SpeedLimit> {
		return this._speedLimits;
	}

	public set speedLimits(value: Array<SpeedLimit>) {
		this._speedLimits = value;
	}

	public get trafficLights(): Array<TrafficLight> {
		return this._trafficLights;
	}

	public set trafficLights(value: Array<TrafficLight>) {
		this._trafficLights = value;
	}

	public set distance(value: number) {
		this._distance = value;
	}

  
}