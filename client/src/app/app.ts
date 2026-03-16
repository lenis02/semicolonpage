import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnInit {
  public authService = inject(AuthService);
  private http = inject(HttpClient);

  dashboardData: any = null;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.fetchDashboardSummary();
    }
  }

  fetchDashboardSummary() {
    this.http.get('http://localhost:3000/api/dashboard/summary').subscribe({
      next: (data) => {
        console.log('백엔드에서 가져온 통계 데이터', data);
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('데이터 가져오기 실패', err);
      },
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithKakao() {
    this.authService.loginWithKakao();
  }

  logout() {
    this.authService.logout();
    this.dashboardData = null;
  }
}
