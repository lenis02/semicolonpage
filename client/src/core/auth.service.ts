import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly http: HttpClient;
  private refreshInFlight: Promise<string | null> | null = null;

  constructor(httpBackend: HttpBackend) {
    // interceptor 영향을 받지 않는 raw HttpClient
    this.http = new HttpClient(httpBackend);
  }

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
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  // 토큰 가져오기
  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private parseJwtPayload(token: string): Record<string, any> | null {
    try {
      const base64 = token.split('.')[1];
      if (!base64) return null;
      const normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
      const payload = decodeURIComponent(
        atob(normalized)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.parseJwtPayload(token);
    if (!payload || typeof payload['exp'] !== 'number') {
      return true;
    }
    const nowSec = Math.floor(Date.now() / 1000);
    return payload['exp'] <= nowSec;
  }

  // 로그아웃 (토큰 삭제)
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;
    if (this.isTokenExpired(refreshToken)) {
      this.logout();
      return null;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<{ accessToken: string; refreshToken: string }>(
          'http://localhost:3000/api/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )
      );

      if (!response?.accessToken || !response?.refreshToken) {
        this.logout();
        return null;
      }

      this.setToken(response.accessToken);
      this.setRefreshToken(response.refreshToken);
      return response.accessToken;
    } catch {
      this.logout();
      return null;
    }
  }

  getRefreshInFlight(): Promise<string | null> | null {
    return this.refreshInFlight;
  }

  setRefreshInFlight(promise: Promise<string | null> | null): void {
    this.refreshInFlight = promise;
  }

  // 로그인 상태 확인
  isLoggedIn(): boolean {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();
    const hasValidAccessToken =
      !!accessToken && !this.isTokenExpired(accessToken);
    const hasValidRefreshToken =
      !!refreshToken && !this.isTokenExpired(refreshToken);

    if (!hasValidAccessToken && !hasValidRefreshToken) {
      this.logout();
      return false;
    }

    return true;
  }
}