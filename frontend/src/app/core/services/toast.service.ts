import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  readonly items$ = this.toasts$.asObservable();

  show(message: string, type: Toast['type'] = 'info', duration = 4000): void {
    const toast: Toast = { id: ++this.counter, message, type };
    this.toasts$.next([...this.toasts$.value, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }
  success(msg: string): void { this.show(msg, 'success'); }
  error(msg: string): void { this.show(msg, 'error'); }
  info(msg: string): void { this.show(msg, 'info'); }
  dismiss(id: number): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}
