

export class Car {

    private _image: string;
    private _speed: number;
    private _description: string;
    private _name: string;
    private _id: number;

    public constructor(image: string, speed: number, description: string, name: string, id: number) {
        this._image = image;
        this._speed = speed;
        this._description = description;
        this._name = name;
        this._id = id;
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(value: number) {
        this._speed = value;
    }

    public get description(): string {
        return this._description;
    }

    public get image(): string {
        return this._image;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
		return this._name;
	}
}

