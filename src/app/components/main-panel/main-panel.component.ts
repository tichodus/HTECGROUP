import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/RequestService.service';
import { TrafficService } from '../../services/traffic.service';
import { Traffic } from '../../models/traffic';
import { Car } from '../../models/car';
import { CarGridComponent } from '../car-grid/car-grid.component';

@Component({
  selector: 'main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.css']
})
export class MainPanelComponent implements OnInit {
  traffic: Traffic;
  displayedCars: Array<Car>;
  trackingCars: Array<Car>;
  
  constructor(private trafficService: TrafficService) {
    this.displayedCars = new Array<Car>();
    this.trackingCars = new Array<Car>();
  }

  ngOnInit() {
    this.trafficService.getTraffic().subscribe(res => this.traffic = res);
  }

  updateDisplay(searchResult: Array<Car>): void {
    this.displayedCars.length ? this._updateDisplayedCars(searchResult) : this.displayedCars = searchResult;
  }

  addCarForTracking(carGrid:CarGridComponent,car:Car){
    carGrid.addCarForTracking(car);
    this.trackingCars.push(car);
  }
  private _updateDisplayedCars(cars: Array<Car>): void {
    let filteredCars = cars.filter((car: Car) => !this._isCarDisplayed(car));
    this.displayedCars = this.displayedCars.concat(filteredCars);
  }

  private _isCarDisplayed(car: Car): boolean {
    return this.displayedCars.findIndex((displayedCar: Car) => displayedCar.id == car.id) != -1;
  }

  startAnimation(animationSpeed: number, carGrid: CarGridComponent) {
    if (this.trackingCars.length) {
      if (animationSpeed && animationSpeed > 1)
        carGrid.setAnimationSpeed(animationSpeed);
      carGrid.animate();
    }
  }
}
