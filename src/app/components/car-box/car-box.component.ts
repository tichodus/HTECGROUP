import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Car } from '../../models/car';


@Component({
  selector: 'car-box',
  templateUrl: './car-box.component.html',
  styleUrls: ['./car-box.component.css'],
})
export class CarBoxComponent implements OnInit {
  @Input() car: Car;
  @Output() onCarSelected: EventEmitter<Car>;
  carSelected: boolean;

  private _isMouseOver: boolean;

  constructor(private element: ElementRef) {
    this._isMouseOver = false;
    this.onCarSelected = new EventEmitter();
    this.carSelected = false;
  }

  ngOnInit() {
    let carBoxCard = this.element.nativeElement.querySelector(".car-box__card") as HTMLDivElement;
    carBoxCard.style.backgroundImage = "url('" + this.car.image + "')";
  }

  selectCar() {
    this.carSelected = !this.carSelected;
    this._applyBorderStyle();
    this.onCarSelected.emit(this.car);
  }

  private _applyBorderStyle() {
    if (this.carSelected)
      this._applyGreenBorder();
    else
      this._applyGrayBorder();
  }

  private _applyGreenBorder() {
    let carBox = this.element.nativeElement.querySelector(".car-box") as HTMLDivElement;
    carBox.classList.remove('border-gray');
    carBox.classList.add('border-green');
  }

  private _applyGrayBorder() {
    let carBox = this.element.nativeElement.querySelector(".car-box") as HTMLDivElement;
    carBox.classList.remove('border-green');
    carBox.classList.add('border-gray');
  }

}
