import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// TODO:clarify the data stream
@Injectable()
export class SpaceDebugService {
  sendId = 0;
  connected = false;
  requestTokenId = -1;
  url = '';
  device = '';
  serverVersion = -1;
  serverId = '';
  token = '';

  // TODO: ?????
  readonly message$ = new Subject<[type: number, data: string]>();
  readonly connect$ = new Subject<void>();
  readonly close$ = new Subject<void>();
  readonly error$ = new Subject<Event>();

  private ws: WebSocket | null = null;

  constructor() {}

  connect(url: string): void {
    this.ws?.close();
    this.ws = new WebSocket(url);
    this.url = url;
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = () => {
      this.hello();
      this.connected = true;
    };
    this.ws.onmessage = (evt) => {
      const data = this.parseData(evt.data);
      this.onMsgBasic(data[0], data[1]);
    };
    this.ws.onclose = () => {
      if (this.connected) {
        this.close$.next();
        this.connected = false;
      }
    };
    this.ws.onerror = (evt) => {
      this.error$.next(evt);
    };
  }

  hello(): void {
    this.sendJson({
      type: 'hello',
      data: {
        client_version: 3,
      },
    });
  }
  runFile(id: string, code: string, name: string = id): void {
    this.sendJson({
      id: this.sendId,
      type: 'command',
      data: {
        id: id,
        name: name,
        script: code,
        command: 'run',
      },
    });
  }
  saveFile(id: string, code: string, name: string = id): void {
    this.sendJson({
      id: this.sendId,
      type: 'command',
      data: {
        id: id,
        name: name,
        script: code,
        command: 'save',
      },
    });
  }
  requestToken(): void {
    this.requestTokenId = this.sendId;
    this.sendJson({
      id: this.sendId,
      type: 'command',
      data: {
        command: 'browse_files',
      },
    });
  }

  // TODO: type of `data`?
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  private sendJson(data: any): boolean {
    if (this.ws == null) {
      return false;
    }
    const json = JSON.stringify(data);
    const te = new TextEncoder();
    const jsonUints = te.encode(json);

    const buffer = new ArrayBuffer(jsonUints.length + 8);
    const view = new DataView(buffer, 0, jsonUints.length + 8);
    view.setInt32(0, jsonUints.length);
    view.setInt32(4, 1);
    for (let i = 0; i < jsonUints.length; i++) {
      view.setUint8(i + 8, jsonUints[i]);
    }
    this.ws.send(buffer);
    this.sendId++;
    return true;
  }

  // TODO: type of `data`
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  private onMsgBasic(type: number, data: any): void {
    if (type == 1) {
      if (data.type == 'hello') {
        this.device = data.data.device_name;
        this.serverVersion = data.data.server_version;
        this.serverId = data.data.server_id;
        this.connect$.next();
      } else if (data.type == 'response_' + this.requestTokenId) {
        this.token = data.data.token;
      }
    }
    this.message$.next([type, data]);
  }

  // TODO: type of `data`?
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  private parseData(data: any): [number, object] {
    const view = new DataView(data, 0, 8);
    // TODO: unused variable?
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const len = view.getInt32(0, false);
    const type = view.getInt32(4, false);
    if (type == 1) {
      const td = new TextDecoder();
      const str = td.decode(new Uint8Array(data, 8));
      return [type, JSON.parse(str)];
    } else {
      return [type, data];
    }
  }
}