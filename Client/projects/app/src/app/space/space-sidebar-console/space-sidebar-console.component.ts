import { Component, OnDestroy, OnInit} from '@angular/core';
import * as dayjs from 'dayjs';
import { Subscription } from 'rxjs';

import { SandboxOutput } from '../../common/sandbox.class';
import { SpaceDevelopService } from '../shared/space-develop.service';

@Component({
  selector: 'app-space-sidebar-console',
  templateUrl: './space-sidebar-console.component.html',
  styleUrls: ['./space-sidebar-console.component.less'],
})
export class SpaceSidebarConsoleComponent implements OnInit, OnDestroy {
  lines: string[] = [];

  private subscription?: Subscription;

  constructor(private developService: SpaceDevelopService) {}

  ngOnInit(): void {
    this.subscription = this.developService.output$.subscribe((output) => {
      this.resolveOutput(output);
    });
    this.resolveOutput({
      type: 'debug',
      data: ['控制台初始化完成'],
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  resolveOutput(output: SandboxOutput): void {
    const time = dayjs().format('HH:mm:ss');
    const content = output.data.map((data) => this.stringify(data)).join(' ');
    this.lines.push(`OnLine  ${time}: ${content}`);
  }

  resolveString(text: string): void {
    this.lines.push(text);
  }

  private stringify(data: unknown): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      return String(data);
    }
  }
}
