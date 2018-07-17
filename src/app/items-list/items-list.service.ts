import { Injectable } from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Item} from '../models/Item';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpResponse} from '../models/HttpResponse';


@Injectable({
  providedIn: 'root'
})
export class ItemsListService {
  private itemsUrl = 'http://130.211.113.239:8080/searchItem';  // URL to web api


  constructor( private http: HttpClient ) { }

  getItems(keyword: string): Observable<HttpResponse> {
    console.log('items list service: keyword received : ' + keyword);
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<HttpResponse>(this.itemsUrl, {params: params})
      .pipe(
        tap(response => console.log(response))
      );
  }
}
