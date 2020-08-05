import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {mockBackendProvider} from './mock-backend-interceptor.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [mockBackendProvider]
})
export class MockModule {
}
