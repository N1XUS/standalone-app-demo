import { NgModule } from '@angular/core';

@NgModule({
  imports: [FirstComponent, SecondComponent, ThirdComponent],
  providers: [SharedService],
})
export class ExampleModule {}
