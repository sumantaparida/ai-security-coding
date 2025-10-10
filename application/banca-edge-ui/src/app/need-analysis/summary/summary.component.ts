import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../user-data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoaderService } from '@app/_services/loader.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryComponent implements OnInit {
  data;

  dataDisplay;

  needDetails;

  userStory: string;

  showPlanPage = false;

  showSummaryPage = false;

  inputClass = 'editable-input';

  customerId;

  isDcb = false;

  isKbl = false;

  lobType;

  constructor(
    private userData: UserDataService,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loaderService.showSpinner(true);
    this.route.params.subscribe((params) => {
      if (params.customerId) {
        this.customerId = params.customerId;
      }
      if (params.lobType) {
        this.lobType = params.lobType;
      }
    });
    this.data = this.userData.getCustomerById(this.customerId).subscribe((customer) => {
      this.loaderService.showSpinner(false);
      if (customer['organizationCode'] === 'DCB') {
        this.isDcb = true;
      } else if (customer['organizationCode'] === 'KB') {
        this.isKbl = true;
      }
      // this.data = this.userData.getUserInfo();
      this.dataDisplay = this.userData.getDisplayInfo();
      let story = '';
      story += `I am <span class="orange-color"> ${
        customer['customerNeeds']['age']
      }</span> years old and 
    <span class="orange-color">${customer['customerNeeds']['maritalStatus']}</span>  with 
    <span class="orange-color">${
      customer['customerNeeds']['numKids'] === 0
        ? 'no kids. '
        : customer['customerNeeds']['numKids'] + ' kid(s), '
    }</span>`;
      // if (customer['customerNeeds']['numKids'] === 1) {
      //   story += `and my kid is <span class="orange-color">
      //   ${customer['customerNeeds']['kidAges']}
      //   </span> years old. `;
      // } else if (customer['customerNeeds']['numKids'] === 2) {
      //   story += `and my children are <span class="orange-color">
      //   //
      //   </span> and <span class="orange-color">
      //   //
      //   </span> years old. `;
      // } else if (customer['customerNeeds']['numKids'] === 3) {
      //   story += `and my children are <span class="orange-color">
      //   //
      //   </span> and <span class="orange-color"></span> years old`;
      // }
      //occupation
      if (customer['customerNeeds']['occupation'] == 1) {
        story += ` I make my living as an <span class="orange-color">Employee. </span>`;
      } else if (customer['customerNeeds']['occupation'] == 2) {
        story += ` I am an <span class="orange-color">Employer of people. </span>`;
      } else if (customer['customerNeeds']['occupation'] == 3) {
        story += ` I am the Proprietor of my <span class="orange-color">own Enterprise. </span>`;
      } else if (customer['customerNeeds']['occupation'] == 4) {
        story += ` I work as a <span class="orange-color">Consultant.</span>`;
      } else if (customer['customerNeeds']['occupation'] == 5) {
        story += ` I am a <span class="orange-color">Professional. </span>`;
      }
      // social life
      if (customer['customerNeeds']['onlinePresence'] === 'Y') {
        story += `I need to protect my digital assets from <span class="orange-color">breaches and threats. </span>`;
      }

      //risk
      if (customer['customerNeeds']['riskApetite'] == 1) {
        story += `I am <span class="orange-color">conservative</span> in my investment strategy.`;
      } else if (customer['customerNeeds']['riskApetite'] == 2) {
        story += `I am agreeable to <span class="orange-color">some risk</span> in my investment strategy. </span>`;
      } else if (customer['customerNeeds']['riskApetite'] == 3) {
        story += `I am open to <span class="orange-color">significant risk</span> in my investment strategy. </span>`;
      }

      //house type
      if (customer['customerNeeds']['house'] == 1) {
        story += `I live in<span class="orange-color"> my own home</span>. `;
      } else if (customer['customerNeeds']['house'] == 2) {
        story += `I live in <span class="orange-color">rented accomodation</span>. `;
      } else if (customer['customerNeeds']['house'] == 3) {
        story += `I live <span class="orange-color">with my parents</span>. `;
      }

      //valuables
      if (customer['customerNeeds']['posessions'] == 1) {
        story += `I have a <span class="orange-color">car</span>. `;
      } else if (customer['customerNeeds']['posessions'] == 2) {
        story += `I have a <span class="orange-color">bike</span>. `;
      } else if (customer['customerNeeds']['posessions'] == 3) {
        story += `I <span class="orange-color">possess valuables</span>. `;
      }

      story += `I earn Rs.<span class="orange-color">${customer['customerNeeds']['annualIncome']}</span>
    in a year.`;
      // I can save Rs.<span class="orange-color">${customer['customerNeeds']['disposableIncome']}</span>
      // in a year.`;

      // need loan
      // if (this.data.needLoan === 'Need') {
      //   story += `I intend to take a <span class="orange-color">loan to adjust my finances</span>. `;
      // } else {
      //   story += `I am <span class="orange-color">not looking for a loan</span>. `;
      // }

      this.userStory = story;
    });
  }

  public get userStoryHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.userStory);
  }

  // getNeedAnalysisDetails(){
  //   this.userData.ge
  // }
  seePlansPage() {
    this.router.navigate(['needanalysis/view-plan', this.customerId]);

    // this.showPlanPage = true;
    // this.showSummaryPage = false;
  }

  seeSummaryPage() {
    this.showSummaryPage = true;
    this.showPlanPage = false;
  }

  routeToLms() {
    const journey = 'digital';

    // this.router.navigate(['lms/new-application', this.customerId]);
    this.router.navigate([`/lms/new-application/${this.customerId}/${journey}/${this.lobType}`]);
  }

  routeToCIS() {
    this.router.navigate(['/cis', this.customerId]);
  }
}
