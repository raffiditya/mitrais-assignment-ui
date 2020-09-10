import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppService } from "./app.service";
import { Observable } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  title: string = "Mitrais Register";
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  succeed = false;

  constructor(private formBuilder: FormBuilder, private service: AppService, private toastr: ToastrService) { }

  get f() { return this.registerForm.controls; }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+62[0-9]{9,}$/)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)],
      gender: [null],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.loading = true;
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.loading = false;
      return;
    }

    this.validateMobileNumber()
      .pipe(
        mergeMap(() => this.validateEmail())
      )
      .subscribe(
        value => this.sendRegistration(),
        error => {
          this.toastr.error(error.error.message, 'Error');
          this.loading = false;
        }
      );
  }

  validateMobileNumber()
    :
    Observable<any> {
    return this.service.isValidMobileNumber(encodeURIComponent(this.registerForm.get('mobileNumber').value))
      .pipe(
        tap(
          value => this.registerForm.get('mobileNumber').markAsPristine(),
          error => this.registerForm.get('mobileNumber').setErrors({notUnique: true})
        )
      );
  }

  validateEmail()
    :
    Observable<any> {
    return this.service.isValidEmail(this.registerForm.get('email').value)
      .pipe(
        tap(
          value => this.registerForm.get('email').markAsPristine(),
          error => this.registerForm.get('email').setErrors({notUnique: true})
        )
      );
  }

  sendRegistration() {
    let gender = this.registerForm.get('gender').value;
    let bodyRequest = this.registerForm.getRawValue();
    if (gender !== null) {
      bodyRequest.gender = parseInt(gender);
    }

    this.service.register(this.registerForm.value)
      .subscribe(
        value => {
          this.succeed = true;
          this.toastr.success('User successfully registered', 'Success');
        },
        error => this.toastr.error(error.error.message, 'Error'),
        () => this.loading = false
      );
  }
}
