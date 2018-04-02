
export class SpeedLimit {
    private _position: number;
    private _speed: number;

    constructor(position: number, speed: number) {
        this._position = position;
        this._speed = speed;
    }

    public get position(): number {
        return this._position;
    }


	public set position(value: number) {
		this._position = value;
	}

    public get speed(): number {
        return this._speed;
    }

    public set speed(value: number) {
        this._speed = value;
    }


}