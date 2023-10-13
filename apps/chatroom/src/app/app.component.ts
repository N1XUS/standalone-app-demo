import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { delay, of } from 'rxjs';

export const dummyAwaitablePromise = (timeout = 200): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });

/**
 * App component serves as a root component that performs root-level routing such as login or chats.
 */
@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'standalone-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
