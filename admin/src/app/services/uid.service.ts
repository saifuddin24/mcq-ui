import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UidService {
  public ids: string[] = [];

  constructor() {}

  public getString(): string {
    let isUnique = false;
    let tempId = '';

    while (!isUnique) {
      tempId = this.generator();
      if (!this.idExists(tempId)) {
        isUnique = true;
        this.ids.push(tempId);
      }
    }

    return tempId;
  }

  public remove(id: string): void {
    const index = this.ids.indexOf(id);
    this.ids.splice(index, 1);
  }

  private generator(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;

    return isString;
  }

  private idExists(id: string): boolean {
    return this.ids.includes(id);
  }

  private S4(): string {
    // tslint:disable-next-line:no-bitwise
    return ( ((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}
