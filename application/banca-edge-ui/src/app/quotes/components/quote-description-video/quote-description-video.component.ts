import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-quote-description-video',
  templateUrl: './quote-description-video.component.html',
  styleUrls: ['./quote-description-video.component.css']
})
export class QuoteDescriptionVideoComponent implements OnInit {



  url: string = "https://www.youtube.com/watch?v=muyBYvlvqtg";
  urlSafe: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }


}
