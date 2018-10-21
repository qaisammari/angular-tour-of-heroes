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
  marketplaceDropdownList = [];
  starRatingDropdownList = [];
  shipmentDropdownList = [];
  marketplaceSelectedItems = [];
  starRatingSelectedItems = [];
  shipmentSelectedItems = [];
  dropdownSettings = {};

  sorters: Sorter[] = [
    {
      title: 'Default Sorting',
      value: '-1'
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

    this.marketplaceDropdownList = [
      { item_id: 1, item_text: 'Ebay' },
      { item_id: 2, item_text: 'Walmark' }
    ];

    this.starRatingDropdownList = [
      { item_id: 5, item_text: 'Five Stars' },
      { item_id: 4, item_text: 'Four Stars' },
      { item_id: 3, item_text: 'Three Stars' },
      { item_id: 2, item_text: 'Two Stars' },
      { item_id: 1, item_text: 'One Star' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: false,
      enableCheckAll: false
    };
  }

  onMarketplaceSelect (item:any) {
    console.log(item);
    if(item.item_id === 1) {
      this.ebayChecked = true;
    }

    if(item.item_id === 2) {
      this.walmartChecked = true;
    }

    this.filterAll();
  }

  onMarketplaceDeSelect (item:any) {
    console.log(item);

    if(item.item_id === 1) {
      this.ebayChecked = false;
    }

    if(item.item_id === 2) {
      this.walmartChecked = false;
    }

    this.filterAll();
  }


  onShipmentSelect (item:any) {
    console.log(item);
    this.destinationFilter2(item.item_text, true);
  }

  onShipmentDeSelect (item:any) {
    console.log(item);
    this.destinationFilter2(item.item_text, false);

  }

  getItemsList(): void {
    const keyword = this.route.snapshot.paramMap.get('keyword');
    if (keyword) {
      this.sendLoadingEvent(true);
      this.itemsListService.getItems(keyword)
        .subscribe(list => {
          this.resultList = this.shuffle(list.itemList);
          this.originalList = this.resultList.slice();
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

  destinationFilter(destination, event) {
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

  destinationFilter2(destination, isAdd) {
    let index = -1;
    if (this.destinationsFilter) {
      index = this.destinationsFilter.indexOf(destination);
    } else {
      this.destinationsFilter = [];
    }
    if (isAdd && index === -1) {
      this.destinationsFilter.push(destination);
    } else {
      if (index !== -1) {
        this.destinationsFilter.splice(index, 1);
      }
    }
    this.filterAll();
  }


  onRatingItemSelect (item:any) {
    console.log(item);
    if(item.item_id === 1) {
      this.oneStarChecked = true;
    }

    if(item.item_id === 2) {
      this.twoStarsChecked = true;
    }

    if(item.item_id === 3) {
      this.threeStarsChecked = true;
    }

    if(item.item_id === 4) {
      this.fourStarsChecked = true;
    }

    if(item.item_id === 5) {
      this.fiveStarsChecked = true;
    }

    this.filterAll();
  }

  onRatingItemDeSelect (item:any) {
    console.log(item);

    if(item.item_id === 1) {
      this.oneStarChecked = false;
    }

    if(item.item_id === 2) {
      this.twoStarsChecked = false;
    }

    if(item.item_id === 3) {
      this.threeStarsChecked = false;
    }

    if(item.item_id === 4) {
      this.fourStarsChecked = false;
    }

    if(item.item_id === 5) {
      this.fiveStarsChecked = false;
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

    this.resultList = this.originalList.slice();

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
    this.shipmentDropdownList = [];
    this.destinations = [];
    this.maxPrice = 0;
    let item_id = 0;
    for (let i = 0; i < this.originalList.length; i++) {
      if (!this.destinations.includes(this.originalList[i].shipToDestinations)) {
        this.destinations.push(this.originalList[i].shipToDestinations);
        this.shipmentDropdownList.push({item_id: item_id, item_text: this.originalList[i].shipToDestinations});
        item_id++;
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


  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
