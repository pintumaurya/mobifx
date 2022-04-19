import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SharedService } from '../../services/shared.service';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, FreeMode, SwiperOptions } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, FreeMode]);

@Component({
  selector: 'app-open-real-account',
  templateUrl: './open-real-account.component.html',
  styleUrls: ['./open-real-account.component.scss']
})
export class OpenRealAccountComponent implements OnInit {

  isShowBalance: boolean = false;
  isHideFixedRate: boolean = true;
  isHideAccType: boolean = true;
  isHideCurrency: boolean = true;
  currencySign = "$";
  Leverage = "1";
  acc_type = "1";
  leverageValue = "1";
  currencyValue = "USD";
  fixedRateValue = "1";
  balanceValue = "5000";
  planData: any = [];
  leverageData: any = [];
  id: any;
  accInfoData: any;
  isShowSuccesPage: boolean = true;
  isShowDemoPage: boolean = false;
  isShowRealPage: boolean = false;

  config: SwiperOptions = {
    // A11y: true,
    direction: 'horizontal',
    slidesPerView: 3,
    slideToClickedSlide: true,
    mousewheel: true,
    scrollbar: false,
    // watchSlidesProgress: true,
    // navigation: true,
    keyboard: true,
    // pagination: false,
    centeredSlides: true,
    loop: false,
    roundLengths: true,
    // slidesOffsetBefore: 100,
    // slidesOffsetAfter: 100,
    spaceBetween: 10,
    // breakpoints: {
    //   // when window width is >= 320px
    //   1080: {
    //     slidesPerView: 3
    //   }
    // }
  };

  constructor(
    public sharedService: SharedService,
    public apiService: ApiService,
  ) {
    this.sharedService.sidebar = true;
    this.sharedService.isHeader = false;
    this.id = localStorage.getItem('id');
  }

  ngOnInit() {
    this.getPlans();
    this.getLeverage();
  }

  onSwiper([swiper]) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }

  getPlans() {
    this.apiService.getPlan().subscribe((res) => {
      if (res) {
        this.planData = res?.data;
      }
    });
  }

  getLeverage() {
    this.apiService.getLeverage().subscribe((res) => {
      if (res) {
        this.leverageData = res?.data;
      }
    });
  }

  onSelectChange(searchValue: string) {
    this.acc_type = searchValue;
    if (searchValue == "0") {
      this.isShowBalance = true;
      this.isHideFixedRate = false;
    }
    else {
      this.isShowBalance = false;
      this.isHideFixedRate = true;
    }
  }

  onSelectChange1(searchValue: string) {
    this.currencyValue = searchValue;
    if (searchValue == "EUR") {
      this.isHideFixedRate = false;
      this.currencySign = "€";
    } else {
      this.currencySign = "$";
      this.isHideFixedRate = true;
    }
  }

  onSelectChange2(searchValue: string) {
    if (searchValue == "1") {
      this.fixedRateValue = searchValue;
      this.isHideAccType = false;
      this.isHideCurrency = false;
    } else {
      this.isHideAccType = true;
      this.isHideCurrency = true;
    }
  }

  onSelectLeverage(event: any) {
    this.leverageValue = event.value;
  }

  openAccount() {
    if (this.acc_type == "1") {
      let payload = {
        user_id: this.id,
        plan_id: "1",
        leverage_id: this.leverageValue,
        account_type: this.acc_type,
        currency: this.currencyValue,
        fixed_rate: this.fixedRateValue,
        balance: "0",
        main_balance: "0"
      }
      if (this.id) {
        this.apiService.accountInfo(payload).subscribe((res) => {
          if (res?.status == true) {
            this.accInfoData = res?.data;
            this.isShowSuccesPage = false;
            this.isShowRealPage = true;
          }
        });
      }
    } else {
      let payload = {
        user_id: this.id,
        plan_id: "1",
        leverage_id: this.leverageValue,
        account_type: this.acc_type,
        currency: this.currencyValue,
        fixed_rate: this.fixedRateValue,
        balance: this.balanceValue,
        main_balance: "0"
      }
      if (this.id) {
        this.apiService.accountInfo(payload).subscribe((res) => {
          if (res?.status == true) {
            this.accInfoData = res?.data;
            this.isShowSuccesPage = false;
            this.isShowDemoPage = true
          }
        });
      }
    }
  }

}
