import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { mobiscroll } from '@mobiscroll/angular';
import { Issue_voucher } from '../../models/issue_voucher.model';

@Component({
  selector: 'app-issue-voucher-print',
  templateUrl: './issue-voucher-print.component.html',
  styleUrls: ['./issue-voucher-print.component.css']
})
export class IssueVoucherPrintComponent implements OnInit {

  issue_voucher: Partial<Issue_voucher> = {};

  mobiSettings: any;

  mobi: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.issue_voucher = this.data.issue_voucher;

    this.mobi = mobiscroll;

    this.mobiSettings = {
      lang: 'ar',
      rtl: true,
    };

  }

}
