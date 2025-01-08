import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderService, NgxUiLoaderHttpModule } from "ngx-ui-loader";
import { BillsService } from './services/bills.service';
import { AuthapisService } from './services/authapis.service';
import { catchError, interval, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, NgxUiLoaderModule, NgxUiLoaderRouterModule, NgxUiLoaderHttpModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent   {
  title = 'HALLTECT';
}
