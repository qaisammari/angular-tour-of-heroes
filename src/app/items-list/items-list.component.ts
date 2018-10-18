import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ItemsListService} from './items-list.service';
import {Location} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Item} from '../models/Item';
import {Sorter} from '../models/Filter';


@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})

export class ItemsListComponent implements OnInit, OnDestroy {
  resultList: Item[];
  originalList: Item[];
  navigationSubscription;
  walmartChecked = false;
  ebayChecked = false;
  oneStarChecked = false;
  twoStarsChecked = false;
  threeStarsChecked = false;
  fourStarsChecked = false;
  fiveStarsChecked = false;
  destinations: string[];
  maxPriceFilter: number;
  maxPrice: number;
  minPriceFilter: number;
  destinationsFilter: string[];
  @Output() loadingEvent = new EventEmitter<boolean>();

  sorters: Sorter[] = [
    {
      title: 'Default Sorting',
      value: ''
    },
    {
      title: 'Sort Price (Low To High)',
      value: 'price:asc'
    },
    {
      title: 'Sort Price (High To Low)',
      value: 'price:desc'
    },
    {
      title: 'Sort Rating (Low To High)',
      value: 'star:asc'
    },
    {
      title: 'Sort Rating (High To Low)',
      value: 'star:desc'
    }
  ];

  selectedSort: string;


  constructor(private route: ActivatedRoute,
              private itemsListService: ItemsListService,
              private location: Location,
              private router: Router) {
  }

  ngOnInit() {
    this.getItemsList();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        if (this.route.snapshot.paramMap.get('keyword')) {
          this.getItemsList();
        }
      }
    });
  }


  getItemsList(): void {
    const keyword = this.route.snapshot.paramMap.get('keyword');
    if (keyword) {
      this.sendLoadingEvent(true);
      this.itemsListService.getItems(keyword)
        .subscribe(list => {
          this.resultList = list.itemList;
          this.originalList = list.itemList;
          this.getUniqueDestinationsAndMaxPrice();
          this.sendLoadingEvent(false);
        });
    }
  }

  ngOnDestroy() {
    console.log('destroying....');
  }

  sendLoadingEvent(event: boolean): void {
    this.loadingEvent.emit(event);
  }


  walmartFilter(event) {
    if (event.target.checked) {
      this.walmartChecked = true;
    } else {
      this.walmartChecked = false;
    }
    this.filterAll();

  }


  ebayFilter(event) {
    if (event.target.checked) {
      this.ebayChecked = true;
    } else {
      this.ebayChecked = false;
    }
    this.filterAll();
  }

  destinationFilter(destination, event){
    let index = -1;
      if (this.destinationsFilter) {
        index = this.destinationsFilter.indexOf(destination);
      } else {
        this.destinationsFilter = [];
      }
    if (event.target.checked && index === -1) {
      this.destinationsFilter.push(destination);
    } else {
      if (index !== -1) {
        this.destinationsFilter.splice(index, 1);
      }
    }
    this.filterAll();
  }

  oneStarFilter(event) {
    if (event.target.checked) {
      this.oneStarChecked = true;
    } else {
      this.oneStarChecked = false;
    }
    this.filterAll();

  }

  twoStarsFilter(event) {
    if (event.target.checked) {
      this.twoStarsChecked = true;
    } else {
      this.twoStarsChecked = false;
    }
    this.filterAll();

  }

  threeStarsFilter(event) {
    if (event.target.checked) {
      this.threeStarsChecked = true;
    } else {
      this.threeStarsChecked = false;
    }
    this.filterAll();

  }

  fourStarsFilter(event) {
    if (event.target.checked) {
      this.fourStarsChecked = true;
    } else {
      this.fourStarsChecked = false;
    }
    this.filterAll();
  }

  fiveStarsFilter(event) {
    if (event.target.checked) {
      this.fiveStarsChecked = true;
    } else {
      this.fiveStarsChecked = false;
    }
    this.filterAll();

  }

  filterAll() {

    this.resultList = this.originalList;

    if (this.walmartChecked
      || this.ebayChecked) {

      let walmartList: Item[];
      let ebayList: Item[];

      if (this.walmartChecked) {
        walmartList = this.resultList.filter(item => item.vendor === 'WALMART');
      }
      if (this.ebayChecked) {
        ebayList = this.resultList.filter(item => item.vendor === 'EBAY');
      }

      let tmp: Item[] = [];

      if (walmartList) {
        tmp = tmp.concat(walmartList);
      }
      if (ebayList) {
        tmp = tmp.concat(ebayList);
      }
      this.resultList = tmp;
    }

    if (this.oneStarChecked
    || this.twoStarsChecked
    || this.threeStarsChecked
    || this.fourStarsChecked
    || this.fiveStarsChecked) {
      let oneStarsList: Item[];
      let twoStarsList: Item[];
      let threeStarsList: Item[];
      let fourStarsList: Item[];
      let fiveStarsList: Item[];

      if (this.oneStarChecked) {
        oneStarsList =  this.resultList.filter(item => item.rating === 1);
      }
      if (this.twoStarsChecked) {
        twoStarsList = this.resultList.filter(item => item.rating === 2);
      }
      if (this.threeStarsChecked) {
        threeStarsList = this.resultList.filter(item => item.rating === 3);
      }
      if (this.fourStarsChecked) {
        fourStarsList = this.resultList.filter(item => item.rating === 4);
      }
      if (this.fiveStarsChecked) {
        fiveStarsList = this.resultList.filter(item => item.rating === 5);
      }

      let tmp: Item[] = [];

      if (oneStarsList) {
        tmp = tmp.concat(oneStarsList);
      }
      if (twoStarsList) {
        tmp = tmp.concat(twoStarsList);
      }
      if (threeStarsList) {
        tmp = tmp.concat(threeStarsList);
      }
      if (fourStarsList) {
        tmp = tmp.concat(fourStarsList);
      }
      if (fiveStarsList) {
        tmp = tmp.concat(fiveStarsList);
      }
      this.resultList = tmp;
    }

    if(this.destinationsFilter && this.destinationsFilter.length > 0) {
      let tmp: Item[] = [];
      for (let i = 0; i < this.destinationsFilter.length; i++) {
        tmp = tmp.concat(this.resultList.filter(item => item.shipToDestinations === this.destinationsFilter[i]));
      }
      this.resultList = tmp;
    }


    if (this.minPriceFilter || this.maxPriceFilter) {
      let tmp: Item[] = [];

      if (!this.minPriceFilter) {
        this.minPriceFilter = 0;
      }
      if (!this.maxPriceFilter) {
        this.maxPriceFilter = this.maxPrice;
      }
      for (let i = 0; i < this.resultList.length; i++) {
        tmp = this.resultList.filter(item => item.itemPrice >= this.minPriceFilter && item.itemPrice <= this.maxPriceFilter);
      }
      this.resultList = tmp;
    }
  }


  getUniqueDestinationsAndMaxPrice() {
    this.destinations = [];
    this.maxPrice = 0;
    for (let i = 0; i < this.originalList.length; i++) {
      if (!this.destinations.includes(this.originalList[i].shipToDestinations)) {
        this.destinations.push(this.originalList[i].shipToDestinations);
      }
      if (this.originalList[i].itemPrice > this.maxPrice) {
        this.maxPrice = this.originalList[i].itemPrice;
      }
    }
  }


  priceRangeOnUpdate($event) {
    return;
  }

  priceRangeOnChange($event) {
    return;
  }

  priceRangeOnFinish($event) {
    console.log($event.from + '-' + $event.to);
    this.maxPriceFilter = $event.to;
    this.minPriceFilter = $event.from;
    this.filterAll()
    return;
  }

  sortResults($event) {
    this.filterAll();
    switch ($event) {
      case 'price:asc':
        this.resultList.sort(function(a, b) {
          return a.itemPrice - b.itemPrice;
        });
        break;

      case 'price:desc':
        this.resultList.sort(function(b, a) {
          return a.itemPrice - b.itemPrice;
        });
        break;
       case 'star:asc':
          this.resultList.sort(function(a, b) {
            return a.rating - b.rating;
          });
          break;

        case 'star:desc':
          this.resultList.sort(function(b, a) {
            return a.rating - b.rating;
          });
          break;
      default:
        break;
    }
  }
}
