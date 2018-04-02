import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class RequestService<T> {

    private _url: string;
    constructor(private http: HttpClient) {
        this._url = "http://localhost:4200/assets/data.json/";
    }

    public createGetRequest(data: any, action: string): Observable<T> {
        let dataJsonString: string = this._dataToString(data);
        let options = this._createRequestOptions();
        let requestUrl = this._createGetRequestUrl(this._url, action, dataJsonString);
        return this.http.get<T>(requestUrl, options);
    }

    public createPostRequest(data: any, action: string): Observable<T> {
        let options = this._createRequestOptions();
        let dataJsonString = this._dataToString(data);
        return this.http.post<T>(this._url + 'action', data, options);
    }

    private _dataToString(data: any) {
        let requestData: string;
        if (typeof data == "object" && data)
            requestData = JSON.stringify(data);
        else
            requestData = data || "";

        return requestData;
    }

    private _createGetRequestUrl(url: string, action: string, data: string) {
        let requestUrl: string = url;
        if (action && action != "")
            requestUrl += action;
        if (data && data != "")
            requestUrl += "/" + data;
        return requestUrl;
    }

    private _createRequestOptions() {
        let header: HttpHeaders = new HttpHeaders();
        header.append("Content-Type", "application/json")

        return { headers: header };
    }
}