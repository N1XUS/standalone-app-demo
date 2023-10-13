import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import {
  FeedInputAvatarDirective,
  FeedInputButtonDirective,
  FeedInputComponent,
  FeedInputTextareaDirective,
} from '@fundamental-ngx/core/feed-input';
import { AvatarComponent } from '@fundamental-ngx/core/avatar';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@fundamental-ngx/core/button';
import {
  FormControlComponent,
  FormItemComponent,
  FormLabelComponent,
} from '@fundamental-ngx/core/form';
import { RouterModule } from '@angular/router';
import { UserStateService } from '../state/user-state.service';
import { CompleteMessage, Room } from '@chatroom/shared';
import { MessageComponent } from './message/message.component';
import { ChatService } from './chat.service';

@Component({
  selector: 'standalone-app-chat',
  standalone: true,
  imports: [
    RouterModule,
    FeedInputComponent,
    AvatarComponent,
    FormsModule,
    ButtonComponent,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
    FeedInputButtonDirective,
    FeedInputAvatarDirective,
    FeedInputTextareaDirective,
    NgForOf,
    MessageComponent,
  ],
  providers: [ChatService],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements AfterViewInit {
  newMessage = '';

  _messages = signal<CompleteMessage[]>([], {
    // equal: equal,
  });

  readonly _userService = inject(UserStateService);

  private readonly _viewInited = signal(false);

  readonly _chatService = inject(ChatService);

  private readonly _shouldTrackMessagesAreaWidth = computed(
    () => this._viewInited() && this._messages().length
  );

  private _room: Room | undefined;

  @ViewChild('messagesArea')
  private readonly _messagesArea: ElementRef<HTMLDivElement> | undefined;

  constructor() {
    // This effect will be triggered when new messages are added on when view is inited.
    effect(() => {
      const shouldTrack = this._shouldTrackMessagesAreaWidth();
      if (!shouldTrack) {
        return;
      }

      const messageAreaElm = this._messagesArea?.nativeElement;
      if (!messageAreaElm) {
        return;
      }
      setTimeout(() => {
        messageAreaElm.scrollTop =
          messageAreaElm.scrollHeight - messageAreaElm.clientHeight;
      }, 50);
    });
  }

  ngAfterViewInit(): void {
    this._viewInited.set(true);
  }

  sendMessage(): void {
    if (!this.newMessage) {
      return;
    }

    this._chatService.sendMessage(this.newMessage);

    this.newMessage = '';
  }
}
