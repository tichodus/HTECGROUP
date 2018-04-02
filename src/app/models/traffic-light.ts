
export class TrafficLight{
    private _position:number;
    private _duration:number;
	
    constructor(position:number, duration:number){
        this._position = position;
        this._duration = duration;
    }

    public get position(): number {
		return this._position;
	}
	
	public set position(value: number) {
		this._position = value;
	}
	
	public get duration(): number {
		return this._duration;
    }
    
	public set duration(value: number) {
		this._duration = value;
	}
}