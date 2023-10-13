import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  computed,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { DialogModule, DialogRef } from '@fundamental-ngx/core/dialog';
import { PlatformMessagePopoverModule } from '@fundamental-ngx/platform/message-popover';
import {
  SettingsGeneratorComponent,
  SettingsGeneratorModule,
  SettingsModel,
} from '@fundamental-ngx/platform/settings-generator';
import { UserStateService } from '../state/user-state.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { SelectItem } from '@fundamental-ngx/cdk/forms';
import { ThemingService } from '@fundamental-ngx/core/theming';

@Component({
  selector: 'standalone-app-settings',
  standalone: true,
  imports: [
    DialogModule,
    PlatformMessagePopoverModule,
    SettingsGeneratorModule,
  ],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  dialogRef = inject(DialogRef);
  private readonly _theming = inject(ThemingService);

  private readonly _userService = inject(UserStateService);

  private readonly _injector = inject(Injector);

  schema!: SettingsModel;

  ngOnInit(): void {
    const choices: SelectItem[] = this._theming.getThemes().map((theme) => ({
      label:
        theme.name +
        (this._theming.config.defaultTheme === theme.id ? ' (Default)' : ''),
      value: theme.id,
      description: theme.description,
    }));
    const currentTheme = this._theming.getCurrentTheme();
    // Instead of specifying each time the injector, we can run our code in injection context that will automatically pass the injector.
    runInInjectionContext(this._injector, () => {
      this.schema = {
        appearance: 'sidebar',
        items: [
          {
            // We can transform signals to observables.
            title: toObservable(
              computed(() => `User Account (${this._userService.userName()})`)
            ),
            description: this._userService.userName(),
            id: 'userAccount',
            thumbnail: {
              avatar: {
                label: this._userService.userName(),
              },
            },
            groups: [
              {
                title: 'Contact information',
                id: 'contact',
                items: [
                  {
                    name: 'name',
                    message: 'Full name',
                    type: 'input',
                    controlType: 'text',
                    default: this._userService.userName(),
                    guiOptions: {
                      labelColumnLayout: {
                        S: 12,
                        M: 6,
                      },
                      fieldColumnLayout: {
                        S: 11,
                        M: 6,
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            title: 'Appearance',
            description: 'Configure theme and language',
            id: 'appearance',
            thumbnail: {
              icon: 'globe',
            },
            groups: [
              {
                title: 'Theme',
                id: 'theme',
                items: [
                  {
                    type: 'theme-list',
                    name: 'theme',
                    message: 'Theme',
                    choices,
                    default: currentTheme?.id,
                    guiOptions: {
                      noLabelLayout: true,
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    });
  }

  submitSettings(generator: SettingsGeneratorComponent): void {
    generator.submit().subscribe((data: any) => {
      console.log(data);
      this._theming.setTheme(data.appearance.theme.theme);
      localStorage.setItem('theming', data.appearance.theme.theme);
      this.dialogRef.close('Save');
    });
  }
}
