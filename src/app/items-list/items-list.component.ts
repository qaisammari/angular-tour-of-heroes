import {Component, OnDestroy, OnInit} from '@angular/core';
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


  constructor(private route: ActivatedRoute,
                private itemsListService: ItemsListService,
                private location: Location,
                private router: Router) { }

  ngOnInit() {
    this.getItemsList();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      let k;
      if (e instanceof NavigationEnd) {
        if (this.route.snapshot.paramMap.get('keyword')) {
          this.getItemsList();
        }
      }
    });
  }


  getItemsList(): void {
    const keyword = this.route.snapshot.paramMap.get('keyword');
    this.itemsListService.getItems(keyword)
      .subscribe(list => this.resultList = list);
  }

  ngOnDestroy() {
    console.log('destroying....');
  }


}
