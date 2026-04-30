import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly KEY = 'gl_cart';
  private items$ = new BehaviorSubject<CartItem[]>(this.load());
  readonly cart$ = this.items$.asObservable();
  readonly itemCount$ = this.cart$.pipe(map(items => items.reduce((s, i) => s + i.quantity, 0)));
  readonly total$ = this.cart$.pipe(map(items => items.reduce((s, i) => s + i.price * i.quantity, 0)));

  add(item: CartItem): void {
    const items = [...this.items$.value];
    const idx = items.findIndex(i => i.productId === item.productId);
    if (idx >= 0) items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
    else items.push({ ...item });
    this.save(items);
  }

  updateQty(productId: number, qty: number): void {
    const items = this.items$.value.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i);
    this.save(items);
  }

  remove(productId: number): void {
    this.save(this.items$.value.filter(i => i.productId !== productId));
  }

  clear(): void { this.save([]); }
  getItems(): CartItem[] { return this.items$.value; }

  private save(items: CartItem[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.items$.next(items);
  }
  private load(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(this.KEY) ?? '[]'); }
    catch { return []; }
  }
}
