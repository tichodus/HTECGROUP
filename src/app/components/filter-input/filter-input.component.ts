import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TrafficService } from '../../services/traffic.service';
import { Traffic } from '../../models/traffic';
import { Car } from '../../models/car';

@Component({
  selector: 'filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.css']
})
export class FilterInputComponent implements OnInit {
  @Output() searchFinished: EventEmitter<Car[]>;
  queryString: string;

  constructor(private trafficService: TrafficService) {
    this.queryString = '';
    this.searchFinished = new EventEmitter();
  }

  ngOnInit() {
  }

  search() {
    this.trafficService.getTraffic().subscribe((traffic: Traffic) => {
      if (this.queryString == '')
        this.searchFinished.emit(traffic.cars);
      else {
        let result: Array<Car> = this._filterCars(traffic.cars);

        if (result.length)
          this.searchFinished.emit(result);
      }
    });
  }

  private _filterCars(cars: Array<Car>): Array<Car> {
    return cars.reduce((acc, cur) => {
      if (cur.name.toLowerCase().includes(this.queryString.toLowerCase()))
        acc.push(cur);
      return acc;
    }, [])
  }
}
