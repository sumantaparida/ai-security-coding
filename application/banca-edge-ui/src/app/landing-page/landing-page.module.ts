import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageRouterModule } from './landing-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [LandingPageComponent, HomeComponent],
  imports: [CommonModule, LandingPageRouterModule],
})
export class LandingPageModule {}
