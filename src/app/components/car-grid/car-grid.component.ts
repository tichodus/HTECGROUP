

import { Component, OnInit, EventEmitter } from '@angular/core';
import { Car } from '../../models/car';
import { TrafficLight } from '../../models/traffic-light';
import { SpeedLimit } from '../../models/speed-limit';
import { Traffic } from '../../models/traffic';
import { TrafficService } from '../../services/traffic.service';
import { BehaviorSubject } from 'rxjs';
import { TimeService } from '../../services/TimeService.service';
import { interval } from 'rxjs/observable/interval';


@Component({
  selector: 'car-grid',
  templateUrl: './car-grid.component.html',
  styleUrls: ['./car-grid.component.css']
})

export class CarGridComponent implements OnInit {
  trackingCars: Array<Car>;
  traffic: Traffic;
  private _trackDictionary = [];
  private _semaphoreDictionary = [];
  private _speedLimitsDictionary = [];
  private _standing: Array<Car>;
  private _animationSpeed: number;
  private _semaphoreClock: Date;
  private _speedLimitReachedDictionary = [];
  private _semaphoreReachedDictionary = [];
  private _semaphoreIntervalIds = [];
  constructor(private trafficService: TrafficService) {
    this.trackingCars = new Array<Car>();
    this._standing = new Array<Car>();
    this._semaphoreClock = new Date();
    this._animationSpeed = 1;
  }

  ngOnInit() {
    this.trafficService.getTraffic().subscribe((_traffic: Traffic) => {
      this.traffic = _traffic;
    });
  }

  addCarForTracking(car: Car) {
    if (!this._filterTrackingCars(car)) {
      this.trackingCars.push(car);
      this._trackDictionary[car.id] = 0;
    }
  }

  private _filterTrackingCars(car: Car) {
    let numberOfTrackingCarsBeforeFiltering: number = this.trackingCars.length;
    this.trackingCars = this.trackingCars.filter((_car: Car) => car.id != _car.id);

    if (numberOfTrackingCarsBeforeFiltering > this.trackingCars.length) {
      this._trackDictionary[car.id] = null;
      return true;;
    }

    return false;
  }


  getNumberOfColumnsAsArray() {
    return new Array(10);
  }

  getCarPosition(car: Car): number {
    return this._trackDictionary[car.id];
  }

  moveCar(car: Car) {
    if (this._trackDictionary[car.id] < 9)
      this._trackDictionary[car.id] = (this._trackDictionary[car.id] + 1);
  }

  setAnimationSpeed(speed: number) {
    this._animationSpeed = speed;
  }

  private _isCarAtTheEnd(car: Car) {
    return this._trackDictionary[car.id] == 9;
  }

  private _animateCar(car: Car, duration) {
    let intervalId;

    intervalId = setTimeout(() => {

      if (this._isSemaphoreReached(car)) {
        this.moveCar(car);
        this._semaphoreReachedDictionary[car.id] = true;
        duration = this._calculateTimerDelayBySpeed(car.speed) / this._animationSpeed;
        if (this._isSemaphoreRed(car))
          this._semaphoreWait(duration, car);
        else
          this._animateCar(car, duration);
      }

      else {

        if (this._isSpeedLimitSignReached(car)) {
          this.moveCar(car);
          this._speedLimitReachedDictionary[car.id] = true;
          this._setSpeedLimitDelay(car);
        }

        else {

          if (!this._isCarAtTheEnd(car))
            this.moveCar(car);

          if (this._speedLimitReachedDictionary[car.id] || this._semaphoreReachedDictionary[car.id]) {
            duration = this._calculateTimerDelayBySpeed(car.speed) / this._animationSpeed;;
            this._speedLimitReachedDictionary[car.id] = false;
            this._semaphoreReachedDictionary[car.id] = false;
          }

          if (this._isCarAtTheEnd(car)) {
            this._endRace(car);
          }
          else
            this._animateCar(car, duration);
        }
      }
    }, duration);
  }

  private _setSpeedLimitDelay(car: Car) {
    let index = this._trackDictionary[car.id];
    let speedLimit = this._speedLimitsDictionary[index] as SpeedLimit;
    let newDuration = this._calculateTimerDelayBySpeed(speedLimit.speed);
    this._animateCar(car, newDuration / this._animationSpeed);
  }

  private _semaphoreWait(oldDuration: number, car: Car) {
    let currentDate = new Date();
    let semaphoreId = 'semaphore' + this._trackDictionary[car.id];
    let semaphoreDelay = this._semaphoreDelay(semaphoreId);
    let timespan = TimeService.calculateTimespanInSeconds(this._semaphoreClock, currentDate);
    this._animateCar(car, semaphoreDelay - timespan);
  }

  private _restoreCarSpeed(car: Car) {
    let newDuration = this._calculateTimerDelayBySpeed(car.speed);
    this._animateCar(car, newDuration / this._animationSpeed);
  }

  private _endRace(car: Car) {
    if (this._isSpeedLimitSignReached(car)) {
      let index = this._trackDictionary[car.id];
      let speedLimit = this._speedLimitsDictionary[index] as SpeedLimit;
      let newDuration = this._calculateTimerDelayBySpeed(speedLimit.speed);
      setTimeout(() => {
        this._standing.push(car);
        this._setRankingBorder(car);
      }, newDuration / this._animationSpeed);
    }
    else {
      this._standing.push(car);
      this._setRankingBorder(car);
    }
  }

  animate() {
    this._resetSemaphores();
    this._activateSemaphores();
    this.trackingCars.forEach((car: Car) => {
      let duration = this._calculateTimerDelayBySpeed(car.speed);
      this._animateCar(car, duration / this._animationSpeed);
    });
  }


  // public function that determines whether the semaphore should be conatained in the grid cell with the given index column, and calculates it's position if it's true
  isSemaphore(index: number, sem: HTMLElement) {
    let isSemaphore: boolean = false;
    this.traffic.trafficLights.forEach((semaphore: TrafficLight) => {
      if (this._isElementInColumn(index, semaphore.position)) {
        isSemaphore = true;
        //img is 30px width, so -15px so it could be centered on the calculated position
        sem.style.marginLeft = this._calculateSignElementPosition(semaphore.position) - 15 + 'px';
        this._semaphoreDictionary[JSON.stringify(semaphore)] = 'semaphore' + index;
      }

    });

    return isSemaphore;
  }

  private _activateSemaphores() {
    this.traffic.trafficLights.forEach(semaphore => {
      let semaphoreId = this._semaphoreDictionary[JSON.stringify(semaphore)];
      let semaphoreElement = document.getElementById(semaphoreId) as HTMLElement;
      let intervalId = setInterval(() => {
        if (semaphoreElement.classList.contains('car-grid__semaphore--green')) {
          semaphoreElement.classList.remove('car-grid__semaphore--green');
          semaphoreElement.classList.add('car-grid__semaphore--red');
          this._semaphoreClock = new Date();
        }
        else {
          semaphoreElement.classList.remove('car-grid__semaphore--red');
          semaphoreElement.classList.add('car-grid__semaphore--green');
        }
      }, semaphore.duration);
      this._semaphoreIntervalIds[JSON.stringify(semaphore)] = intervalId;
    });
  }

  private _resetSemaphores() {
    this.traffic.trafficLights.forEach(semaphore => {
      if (this._semaphoreIntervalIds[JSON.stringify(semaphore)]) {
        clearInterval(this._semaphoreIntervalIds[JSON.stringify(semaphore)]);
        let semaphoreId = this._semaphoreDictionary[JSON.stringify(semaphore)];
        let semaphoreElement = document.getElementById(semaphoreId) as HTMLElement;
        if (semaphoreElement.classList.contains('car-grid__semaphore--red')) {
          semaphoreElement.classList.remove('car-grid__semaphore--red');
          semaphoreElement.classList.add('car-grid__semaphore--green');
        }
      }
    });
  }
  //public function that determines whether the speed limit sign should be contained in the grid cell with the given index column, and calculates it's position if it's true
  isSpeedLimit(index: number, speedLimitElement: HTMLElement) {
    let isSpeedLimit: boolean = false;
    this.traffic.speedLimits.forEach((speedLimit: SpeedLimit) => {
      if (this._isElementInColumn(index, speedLimit.position)) {
        isSpeedLimit = true;
        speedLimitElement.style.marginLeft = this._calculateSignElementPosition(speedLimit.position) - 15 + 'px';
        this._speedLimitsDictionary[index] = speedLimit;
      }

    });

    return isSpeedLimit;
  }

  private _calculateElementIndex(position: number) {
    return position / (this.traffic.distance / 10);
  }

  private _isElementInColumn(columnIndex: number, elementPosition: number) {
    return Math.floor(this._calculateElementIndex(elementPosition)) == columnIndex;
  }

  isSpeedLimitSixty(index: number) {
    let isSixty = false;
    this.traffic.speedLimits.forEach(speedLimit => {
      if (this._isElementInColumn(index, speedLimit.position)) {
        isSixty = speedLimit.speed == 60;
      }
    });

    return isSixty;
  }

  isSpeedLimitEighty(index: number) {
    let isEighty = false;
    this.traffic.speedLimits.forEach(speedLimit => {
      if (this._isElementInColumn(index, speedLimit.position)) {
        isEighty = speedLimit.speed == 80;
      }
    });

    return isEighty;
  }

  private _calculateSignElementPosition(position: number) {
    return (this._getCellWidth() / 10) * (position % 10);
  }

  private _getCellWidth() {
    let cell = document.getElementById('gridHeader');
    let width = cell.clientWidth;
    return width;
  }
  private _getGridWidth() {
    return this._getCellWidth() * 10; //grid has 10 cells
  }

  private _calculateDistanceSingleGridPoint() {
    return this._getGridWidth() / this.traffic.distance;
  }

  private _setRankingBorder(car: Car) {
    let id = this._generateDivIdForGivenCar(car);
    let placement = this._standing.findIndex(_car => _car.id == car.id);

    if (placement == -1)
      throw Error("Car is not listed for tracking");

    placement++;
    switch (placement) {
      case 1: this._setWinnerBorder(id); break;
      case 2: this._setSecondPlaceBorder(id); break;
      case 3: this._setThirdPlaceBorder(id); break;
    }

  }

  private _generateDivIdForGivenCar(car: Car) {
    let row: number = this.trackingCars.findIndex(_car => _car.id == car.id);
    if (row == -1)
      throw Error("Car is not listed for tracking");
    let column: number = this.getCarPosition(car);

    return row.toString() + column.toString();
  }

  private _setWinnerBorder(id: string) {
    let cell = document.getElementById(id) as HTMLDivElement;
    cell.classList.remove("car-grid__border--gray");
    cell.classList.add("car-grid__border--gold");
  }

  private _setSecondPlaceBorder(id: string) {
    let cell = document.getElementById(id) as HTMLDivElement;
    cell.classList.remove("car-grid__border--gray");
    cell.classList.add("car-grid__border--silver");
  }

  private _setThirdPlaceBorder(id: string) {
    let cell = document.getElementById(id) as HTMLDivElement;
    cell.classList.remove("car-grid__border--gray");
    cell.classList.add("car-grid__border--bronze");
  }

  private _isSemaphoreReached(car: Car) {
    let semaphoreElement = document.getElementById('semaphore' + (this._trackDictionary[car.id] + 1));
    return semaphoreElement || false;
  }

  private _isSemaphoreRed(car: Car) {
    let semaphoreElement = document.getElementById('semaphore' + (this._trackDictionary[car.id]));
    return semaphoreElement.classList.contains('car-grid__semaphore--red') || false;
  }

  private _isSemaphoreGreen(semaphore: HTMLElement) {
    if (semaphore.classList.contains("car-grid__semaphore--green"))
      return true;
    return false;
  }

  private _semaphoreDelay(semaphoreId: string): number {
    let keys = Object.keys(this._semaphoreDictionary);
    return keys.reduce((acc, cur) => {
      if (this._semaphoreDictionary[cur] == semaphoreId) {
        let semaphore = JSON.parse(cur) as TrafficLight;
        acc = semaphore.duration;
      }
      return acc;
    }, 0)

  }

  private _isSpeedLimitSignReached(car: Car) {
    let speedLimitElement = document.getElementById('speedLimit' + (this._trackDictionary[car.id] + 1));
    return speedLimitElement || false;
  }

  private _calculateTimerDelayBySpeed(speed: number) {
    let distance = this.traffic.distance / 10; //one cell
    let timer = (distance / speed) * 3600; //set interval delay in miliseconds
    return timer * 1000; //in seconds;
  }


}


