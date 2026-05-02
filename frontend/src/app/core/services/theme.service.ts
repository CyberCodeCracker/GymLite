import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'gl_theme';
  private theme$ = new BehaviorSubject<Theme>(this.load());
  readonly current$ = this.theme$.asObservable();

  constructor() { this.apply(this.theme$.value); }

  toggle(): void {
    const next = this.theme$.value === 'dark' ? 'light' : 'dark';
    this.apply(next);
  }

  get isDark(): boolean { return this.theme$.value === 'dark'; }

  private apply(theme: Theme): void {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem(this.KEY, theme);
    this.theme$.next(theme);
  }

  private load(): Theme {
    return (localStorage.getItem(this.KEY) as Theme) ?? 'dark';
  }
}
