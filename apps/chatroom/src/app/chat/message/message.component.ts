import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CompleteMessage } from '@chatroom/shared';
import { UserStateService } from '../../state/user-state.service';
import { AvatarComponent } from '@fundamental-ngx/core/avatar';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'standalone-app-message',
  standalone: true,
  imports: [AvatarComponent, DatePipe],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnChanges {
  @Input({ required: true })
  message: CompleteMessage | undefined;

  @Input({
    transform: (value: string | boolean) => {
      return coerceBooleanProperty(value);
    },
    required: true,
  })
  transformedBooleanValue = false;

  private readonly _userState = inject(UserStateService);

  _userId = this._userState.user().id;

  private readonly _cdr = inject(ChangeDetectorRef);

  @HostBinding('class.mine')
  get isMessageMine(): boolean {
    return this._userId === this.message?.author.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('message' in changes && changes['message'].firstChange) {
      this._cdr.detectChanges();
    }
  }
}
