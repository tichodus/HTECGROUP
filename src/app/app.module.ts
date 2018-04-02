import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppComponent } from './app.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { RequestService } from './services/RequestService.service';
import { TrafficService } from './services/traffic.service';
import { CarBoxComponent } from './components/car-box/car-box.component';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { CarGridComponent } from './components/car-grid/car-grid.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPanelComponent,
    CarBoxComponent,
    FilterInputComponent,
    CarGridComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatCheckboxModule,
    FormsModule
  ],
  providers: [RequestService, TrafficService],
  bootstrap: [AppComponent]
})
export class AppModule { }
