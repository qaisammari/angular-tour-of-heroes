import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {AutocompleteResponse} from '../models/AutoCompleteResponse';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }


  getSuggestions(keyword: string): Observable<AutocompleteResponse[]> {
    console.log('search service: keyword receieved : ' + keyword);
    const params = new HttpParams().set('keyword', keyword);

    return this.http.get<AutocompleteResponse[]>('https://api.triphop.com:8080/autocomplete', {params: params })
      .pipe(
        tap(response => console.log(response))
      );
  }
}
