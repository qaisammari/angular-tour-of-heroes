import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';
import {AutocompleteResponse} from './AutoCompleteResponse';
import {logging} from 'selenium-webdriver';
import {Router} from "@angular/router";



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  keyword: string;
  items: AutocompleteResponse[];


  constructor(private searchService: SearchService,
              private router: Router) { }

  ngOnInit() {
  }

  getSuggestions(event): void {
    console.log(event);
    if (event.length > 1) {
      this.searchService.getSuggestions(event).subscribe(response => {
        this.items = response;
      });
    } else {
      console.log('length is too short');
    }
  }


  goToList(keyword: string) {

    this.router.navigate(['/items', keyword]);

  }

}
