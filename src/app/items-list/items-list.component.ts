import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ItemsListService} from './items-list.service';
import {Location} from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Item} from '../models/Item';


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
  @Output() loadingEvent = new EventEmitter<boolean>();


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


  }


}
