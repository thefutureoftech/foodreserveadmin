import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mobiscroll } from '@mobiscroll/angular';
import { ActionLog } from 'src/app/models/action_log.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  action_logs: Partial<ActionLog>[] = [];

  mobiSettings: any;

  mobi: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.mobi = mobiscroll;

    this.mobiSettings = {
      lang: 'ar',
      rtl: true,
    };

    this.action_logs = this.data.logs

    this.action_logs.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.action_date as Date).getTime() - new Date(b.action_date as Date).getTime();
    });

    console.log(this.action_logs);


  }

}
