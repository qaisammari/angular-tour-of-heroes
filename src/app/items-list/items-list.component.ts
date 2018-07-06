import { Component, OnInit } from '@angular/core';
import { ItemsListService } from './items-list.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {Item} from '../models/Item';


@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  resultList: Item[];

  constructor(private route: ActivatedRoute,
              private itemsListService: ItemsListService,
              private location: Location) { }

  ngOnInit() {
    this.getItemsList();
  }


  getItemsList(): void {
    const keyword = this.route.snapshot.paramMap.get('keyword');
    this.itemsListService.getItems(keyword)
      .subscribe(list => this.resultList = list);
  }


}
