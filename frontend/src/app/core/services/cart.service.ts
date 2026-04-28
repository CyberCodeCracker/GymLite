import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'gymlite_cart';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(this.readInitialState());

  readonly items$ = this.itemsSubject.asObservable();
  readonly itemCount$ = this.items$.pipe(
    map((items) => items.reduce((total, item) => total + item.quantity, 0))
  );
  readonly totalAmount$ = this.items$.pipe(
    map((items) =>
      items.reduce((total, item) => total + item.product.price * item.quantity, 0)
    )
  );

  getSnapshot(): CartItem[] {
    return this.itemsSubject.value;
  }

  addItem(product: Product, quantity = 1): void {
    if (quantity <= 0) {
      return;
    }

    const currentItems = [...this.itemsSubject.value];
    const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

    if (existingIndex >= 0) {
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: currentItems[existingIndex].quantity + quantity
      };
    } else {
      currentItems.push({ product, quantity });
    }

    this.updateState(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const nextItems = this.itemsSubject.value.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    this.updateState(nextItems);
  }

  removeItem(productId: number): void {
    const nextItems = this.itemsSubject.value.filter((item) => item.product.id !== productId);
    this.updateState(nextItems);
  }

  clear(): void {
    this.updateState([]);
  }

  private updateState(items: CartItem[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private readInitialState(): CartItem[] {
    const rawState = localStorage.getItem(this.storageKey);
    if (!rawState) {
      return [];
    }

    try {
      const parsed = JSON.parse(rawState) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
