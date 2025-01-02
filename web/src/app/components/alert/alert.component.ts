import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent implements OnInit, OnDestroy {
  private alertSubscription!: Subscription;
  message: string | null = null;
  state: number = -1;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertSubscription = this.alertService.alert$.subscribe((alert) => {
      this.message = alert.message;
      this.state = alert.state;
    });
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
  }
}
