import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, DialogRef } from '@fundamental-ngx/core/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@fundamental-ngx/core/button';
import {
  FormControlComponent,
  FormItemComponent,
  FormLabelComponent,
} from '@fundamental-ngx/core/form';

@Component({
  selector: 'standalone-app-new-room',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
    ButtonComponent,
  ],
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewRoomComponent {
  roomName = '';
  dialogRef = inject(DialogRef);
}
