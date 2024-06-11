import { ChangeDetectionStrategy, Component, Input, VERSION } from '@angular/core';

@Component({
  selector: 'app-app-info',
  templateUrl: './app-info.component.html',
  styleUrl: './app-info.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppInfoComponent {

  ngVersion = VERSION.full;

  @Input()
  hasDevices!: boolean;

  @Input()
  hasPermission!: boolean;

  stateToEmoji(state: boolean | undefined | null): string {

    const states: Record<string, string> = {
      // not checked
      undefined: '❔',
      // failed to check
      null: '⭕',
      // success
      true: '✔',
      // can't touch that
      false: '❌'
    };
  
    return states[String(state)];
  }
}
  