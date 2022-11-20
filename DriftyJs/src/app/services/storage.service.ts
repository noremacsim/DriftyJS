import {Injectable} from '@angular/core';

import {Storage} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this.storage?.set(key, value);
  }

  public get(key: string) {
    return this.storage?.get(key);
  }
}
