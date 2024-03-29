import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ApiService } from '../../services/api.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'
import { Country } from '@angular-material-extensions/select-country';

@Component({
  selector: 'app-verification-details',
  templateUrl: './verification-details.component.html',
  styleUrls: ['./verification-details.component.scss'],
})
export class VerificationDetailsComponent implements OnInit {

  panelOpenState = false;
  token: any;
  accountInformation: FormGroup;
  showSpinner: boolean = false;
  isValidForm: boolean = false;
  trade = "0";
  isStep: boolean = true;
  isStep1: boolean = true;
  isValidTrade: boolean = false;
  isAccount: boolean = false;
  isAccount1: boolean = true;
  isDeposit: boolean = false;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  day = 0;
  month = 0;
  year = 0;
  selectedDay = "0";
  selectedMonth = "0";
  selectedYear = "0";
  callingCode = "+91";
  planData = [];
  leverageData = [];
  isShowBalance: boolean = false;
  // fixedRates: boolean = true;
  isHideFixedRate: boolean = true;
  isHideAccType: boolean = true;
  isHideCurrency: boolean = true;
  currencySign = "$";
  userInfo: any;
  Leverage = "1";
  userInfoData: any;
  accInfoData: any;
  leverageValue = "1";
  currencyValue = "USD";
  fixedRateValue = "1";
  balanceValue = "5000";
  acc_type = "1";

  constructor(
    private _formBuilder: FormBuilder,
    public sharedService: SharedService,
    public apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accountInformation = this._formBuilder.group({
      city: ['', Validators.required],
      street_address: ['', Validators.required],
      phone_number: ['', Validators.required],
    });
    this.sharedService.isVefiHeader = false;
    this.isValidTrade = false;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.token = queryParams['token'];
      this.router.navigate(['/verification-details']);
    });
    if (this.token) {
      this.emailVerification();
    }
    this.getPlans();
    this.getLeverage();
  }

  logout() {
    localStorage.clear();
  }

  emailVerification() {
    this.apiService.verifyEmail(this.token).subscribe((res) => {
      console.log('res', res);
      if (res.status == true) {
        localStorage.setItem("token", res.data?.accessToken);
        localStorage.setItem('id', res.data?.user_info?.id)
        localStorage.setItem('firstname', res.data?.user_info?.firstname);
        localStorage.setItem('lastname', res.data?.user_info?.lastname);
        localStorage.setItem('email', res.data?.user_info?.email);
        this.userInfo = res?.data?.user_info;
        this.router.navigate(['/verification-details']);
      }
    });
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

  userInformation() {
    // this.haveYouTrade(event);   
    if (this.trade == "1" || this.trade == "2") {
      this.isAccount = true;
    } else {
      this.isAccount = false;
    }

    if (this.accountInformation?.invalid) {
      this.isValidForm = true;
      return;
    } else {
      const payload = {
        user_id: this.userInfo?.id.toString(),
        // user_id: "13",
        country_id: "1",
        country_code: this.callingCode,
        phone: this.accountInformation.get('phone_number').value['number'].replace(/\s/g, ""),
        // bod: this.year + "-" + this.month + "-" + this.day,
        bod: "1995-10-10",
        city: this.accountInformation.get('city').value,
        street_address: this.accountInformation.get('street_address').value
      };
      if (this.userInfo?.id) {
        this.apiService.userInfo(JSON.stringify(payload)).subscribe((res) => {
          if (res?.status == true) {
            this.userInfoData = res?.data;
            this.accountInformation.reset();
          }
        });
      }
    }
  }

  accountInformationSubmit() {
    this.isStep = false;
    this.isStep1 = false;
    this.isAccount1 = false;
    this.isAccount = false;
    this.isDeposit = true;
    if (this.acc_type == "1") {
      let payload = {
        user_id: this.userInfo?.id.toString(),
        plan_id: "1",
        leverage_id: this.leverageValue,
        account_type: this.acc_type,
        currency: this.currencyValue,
        fixed_rate: this.fixedRateValue,
        balance: ""
      }
      console.log('payload', payload);
      if (this.userInfo?.id) {
        this.apiService.accountInfo(JSON.stringify(payload)).subscribe((res) => {
          if (res?.status == true) {
            this.accInfoData = res?.data;
          }
        });
      }
    } else {
      let payload = {
        user_id: this.userInfo?.id.toString(),
        plan_id: "1",
        leverage_id: this.leverageValue,
        account_type: this.acc_type,
        currency: this.currencyValue,
        fixed_rate: this.fixedRateValue,
        balance: this.balanceValue
      }
      if (this.userInfo?.id) {
        this.apiService.accountInfo(JSON.stringify(payload)).subscribe((res) => {
          if (res?.status == true) {
            this.accInfoData = res?.data;
            this.isStep = false;
            this.isStep1 = false;
            this.isAccount1 = false;
            this.isAccount = false;
            this.isDeposit = true;
          }
        });
      }
    }
  }

  haveYouTrade(event: any) {
    this.trade = event.value;
    // // console.log("this.trade", this.trade);
    if (event.value == null) {
      // // console.log("this.trade2", this.trade);
      // this.isAccount = true;
      this.isValidTrade = true;
    } else {
      // // console.log("this.trade3", this.trade);
      // this.isAccount = true;
      this.isValidTrade = false;
    }
  }

  onCountrySelected($event: Country) {
    this.callingCode = $event.callingCode;
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

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
