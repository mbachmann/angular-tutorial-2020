import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertService} from '../../shared/component/alert/alert.service';
import {UserService} from '../../shared/service/user.service';
import {CustomValidationService} from '../../shared/service/custom-validation.service';
import {NoWhiteSpaceValidator} from '../../shared/validator/no-white-space-validator';
import {PasswordValidator} from '../../shared/validator/password-validator';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  passwordFieldType;

  userNamePattern = '^[a-z0-9_-]{5,15}$';
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private customValidator: CustomValidationService
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
        firstName: ['', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          NoWhiteSpaceValidator.cannotContainSpace]
        ],
        lastName: ['', [
          Validators.required, Validators.minLength(2),
          Validators.maxLength(30),
          NoWhiteSpaceValidator.cannotContainSpace]
        ],
        email: ['', [
          NoWhiteSpaceValidator.cannotContainSpace,
          Validators.required,
          Validators.email,
        ]
        ],
        username: ['', [
          Validators.required,
          Validators.pattern(this.userNamePattern)],
        ],
        password: ['', [
          Validators.required,
          PasswordValidator.passwordValidator]
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.customValidator.matchPassword('password', 'confirmPassword'),
      }
    );

  }

  togglePasswordFieldType(): void {
    this.passwordFieldType = !this.passwordFieldType;
  }

  // convenience getter for easy access to form fields
  get registerCtrl(): any {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.registerCtrl.email.setValue(this.registerCtrl.email.value.toLowerCase());

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', {keepAfterRouteChange: true});
          this.router.navigate(['../login'], {relativeTo: this.route});
        },
        err => {
          // console.log('error=' + error.error.message, JSON.stringify(error));
          this.alertService.error(err.error.message, {keepAfterRouteChange: true});
          this.loading = false;
        });
  }
}
