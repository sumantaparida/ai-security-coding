import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consent-end-page',
  templateUrl: './consent-end-page.component.html',
  styleUrls: ['./consent-end-page.component.css'],
})
export class ConsentEndPage implements OnInit {
  message;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    console.log(this.message);

    this.route.params.subscribe((params) => {
      console.log(params.msg);
      // if( params.msg ){
      this.message = params.msg;
      //  'Lead has been Sent Successfully'
      //   } else if(params.id == '1'){
      //     this.message = 'Lead has been Rejected';
      //   } else this.message = 'Failed to send lead, please contact RM/Bank'
    });
  }
}
