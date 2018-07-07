import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { ItemsListService } from './items-list.service';
import { Location } from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Item} from '../models/Item';


@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit, OnDestroy {
  resultList: Item[];
  navigationSubscription;
  @Output() loadingEvent = new EventEmitter<boolean>();


  constructor(private route: ActivatedRoute,
                private itemsListService: ItemsListService,
                private location: Location,
                private router: Router) { }

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
          this.resultList = list;
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


}
