import { LoggerService } from '../services/logger.service';
import { CrdsSigninService } from '../services/crds-signin.service';
import { Directive, ElementRef, OnInit, Input } from '@angular/core';
@Directive({
  selector: '[crdsSignInWidget]'
})
export class CRDSSignInWidgetDirective implements OnInit {
  constructor(private el: ElementRef, private crdsAuth: CrdsSigninService, private log: LoggerService) {}
  @Input() crdsSignInWidget;

  ngOnInit() {
    const okta = this.crdsAuth.getSignInWidget(this.crdsSignInWidget);

    okta.renderEl(
      { el: '#' + this.el.nativeElement.id },
      () => {},
      err => {
        this.log.Error('error', err);
      }
    );
  }
}
