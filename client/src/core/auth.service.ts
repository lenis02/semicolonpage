import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  // 구글 로그인 페이지로 이동
  loginWithGoogle(): void {
    window.location.href = 'http://localhost:3000/api/auth/google'
  }
  
  // 카카오 로그인 페이지로 이동
  loginWithKakao(): void {
    window.location.href = 'http://localhost:3000/api/auth/kakao'
  }

  // 토큰 저장
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // 토큰 가져오기
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 로그아웃 (토큰 삭제)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // 로그인 상태 확인
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}