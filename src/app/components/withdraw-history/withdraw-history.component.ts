import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-withdrawhistory',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.scss']
})
export class WithdrawHistoryComponent implements OnInit {

  showSpinner: boolean = false;
  userAccount: any = [];
  depositHistoryList: any = [];
  status: any;
  accountId: any;
  start_date: any;
  end_date: any;
  selStatus = "AnyStatus";
  selectedTimeFrame = "AllTime";
  selectedAnyAccount = "AnyAccount";
  isResetFilter: boolean = false;

  accountLogData: any = [];
  displayedColumns: string[] = ['Request_ID', 'Status', 'Account', 'Amount', 'Details', 'Created','view'];
  dataSource: MatTableDataSource<any>;
  pageIndex = 0;
  pageSize = 0;
  length = 0;
  sizeOptions: number[] = [10, 25, 50, 100, 150];
  pageEvent: PageEvent;

  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    public sharedService: SharedService,
    public apiService: ApiService,
    public router: Router,
  ) {
    this.sharedService.sidebar = true;
    this.sharedService.isHeader = false;
  }

  ngOnInit(): void {
    this.userAccountList();
    this.applyFilter();
    // this.getAccountLog(this.pageIndex);
    // this.dataSource.paginator = this.paginator;
  }

  userAccountList() {
    // this.showSpinner = true;
    this.apiService.getUserAllAccountList().subscribe((res) => {
      // this.showSpinner = false;
      if (res?.status == true) {
        this.userAccount = res?.data;
      }
    });
  }

  selectedStatus(event: any) {
    this.status = event;
  }

  selectedAccount(id: any) {
    this.accountId = id;
  }

  onChangeInterval(event: any) {
    if (event == 'custom') {
      if (!this.start_date && !this.end_date) {
        var startDate = new Date();

        this.start_date = startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear();
        this.end_date = startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear();
      }
      let start_date = this.start_date.split('/');
      start_date = start_date[2] + '-' + start_date[1] + '-' + start_date[0];
      this.start_date = start_date;
      let end_date = this.end_date.split('/');
      end_date = end_date[2] + '-' + end_date[1] + '-' + end_date[0];
      this.end_date = end_date;
    } else {
      this.filterDates(event);
    }
  }

  filterDates(type: any) {
    let date = new Date();
    let start_date, end_date;
    switch (type) {
      case 'current_month':
        start_date = new Date(date.getFullYear(), date.getMonth(), 1);
        end_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        break;
      case 'current_year':
        start_date = new Date(date.getFullYear(), 0, 1);
        end_date = new Date(date.getFullYear(), 11, 31);
        break;
      case 'previous_month':
        start_date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        end_date = new Date(date.getFullYear(), date.getMonth(), 0);
        break;
      case 'previous_year':
        start_date = new Date(date.getFullYear() - 1, 0, 1);
        end_date = new Date(date.getFullYear() - 1, 11, 31);
        break;
      default:
        start_date = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + (date.getDay() == 0 ? -6 : 1) - date.getDay()
        );
        end_date = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + (date.getDay() == 0 ? 0 : 7) - date.getDay()
        );
        break;
    }
    this.start_date =
      start_date.getDate() +
      '/' +
      (start_date.getMonth() + 1) +
      '/' +
      start_date.getFullYear();
    this.end_date =
      end_date.getDate() +
      '/' +
      (end_date.getMonth() + 1) +
      '/' +
      end_date.getFullYear();
  }

  applyFilter() {
    if (this.status || this.accountId || this.start_date || this.end_date) {
      this.isResetFilter = true;
    }
    let payload = {
      // status: this.status,
      // start_date: this.start_date,
      // end_date: this.end_date,
      // account: this.accountId
      page_size: 10
    }
    this.showSpinner = true;
    this.apiService.depositHistory(payload).subscribe((res) => {
      if (res?.status == true) {
        this.dataSource = res?.data;
        this.dataSource.paginator = this.paginator;
        this.pageIndex = res?.pagination?.current_page;
        this.length = res?.pagination?.total_records;;
        this.pageSize = res?.pagination?.current_page;
      }
      this.showSpinner = false;
    });
  }

  resetFilter() {
    this.selStatus = "AnyStatus";
    this.selectedTimeFrame = "AllTime";
    this.selectedAnyAccount = "AnyAccount";
    this.isResetFilter = false;
  }

}
