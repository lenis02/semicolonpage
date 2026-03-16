import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  public authService = inject(AuthService);
  private http = inject(HttpClient);

  dashboardData: any = null;

  isClientModalOpen = false;
  newClient = {
    name: '',
    company: '',
    email: '',
  };

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

  openClientModal() {
    this.isClientModalOpen = true;
  }
  closeClientModal() {
    this.isClientModalOpen = false;

    this.newClient = { name: '', company: '', email: '' };
  }

  saveClient() {
    if (!this.newClient.name.trim()) {
      alert('클라이언트 이름은 필수입니다!');
      return;
    }

    this.http
      .post('http://localhost:3000/api/client', this.newClient)
      .subscribe({
        next: (res) => {
          alert('클라이언트가 성공적으로 등록되었습니다!');
          this.closeClientModal();
          this.fetchDashboardSummary();
        },
        error: (err) => {
          console.error('저장 실패:', err);
          alert('저장에 실패했습니다.');
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
