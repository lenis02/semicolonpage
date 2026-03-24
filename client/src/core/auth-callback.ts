import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<div style="padding: 2rem;">
    로그인 처리 중입니다... 잠시만 기다려주세요!
  </div>`,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const refreshToken = params['refreshToken'];

      if (token && refreshToken) {
        this.authService.setToken(token);
        this.authService.setRefreshToken(refreshToken);
        window.location.href = '/';
      } else {
        alert('로그인에 실패했습니다.');
        window.location.href = '/';
      }
    });
  }
}
