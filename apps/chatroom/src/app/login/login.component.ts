import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@fundamental-ngx/core/button';
import {
  FormControlComponent,
  FormItemComponent,
  FormLabelComponent,
} from '@fundamental-ngx/core/form';
import { UserStateService } from '../state/user-state.service';
import { Router } from '@angular/router';
@Component({
  selector: 'standalone-app-login',
  standalone: true,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .login-form {
        padding: 2rem;
        min-width: 20rem;
      }
    `,
  ],
  imports: [
    FormsModule,
    ButtonComponent,
    FormItemComponent,
    FormLabelComponent,
    FormControlComponent,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  login = '';
  private readonly _userState = inject(UserStateService);
  private readonly _router = inject(Router);

  onSubmit(): void {
    this._userState.userName.set(this.login);
    this._router.navigateByUrl('/');
  }
}
