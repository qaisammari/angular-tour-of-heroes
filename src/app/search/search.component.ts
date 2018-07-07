import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from './search.service';
import {AutocompleteResponse} from '../models/AutoCompleteResponse';
import {logging} from 'selenium-webdriver';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  keyword: string;
  items: AutocompleteResponse[];
  showAutocomplete: boolean;
  loading: boolean;
  message: string;



  constructor(private searchService: SearchService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.keyword = this.route.snapshot.paramMap.get('keyword');
    this.showAutocomplete = false;
    this.loading = false;
  }

  getSuggestions(event): void {
    this.showAutocomplete = false;
    console.log(event);
    if (event.length > 1) {
      this.searchService.getSuggestions(event).subscribe(response => {
        this.items = response;
        this.showAutocomplete = true;
      });
    } else {
      console.log('length is too short');
    }
  }

  goToList(keyword: string) {
    this.keyword = keyword;
    this.router.navigate(['/items', keyword]);
    this.showAutocomplete = false;
  }

  receiveLoadingEvent($event) {
    this.loading = $event;
  }

}
