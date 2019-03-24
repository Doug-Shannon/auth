import { LoggerService } from '../services/logger.service';
import { CrdsSigninService } from '../services/crds-signin.service';
import { Directive, ElementRef, OnInit, Input, Renderer2 } from '@angular/core';
@Directive({
  selector: '[crdsSignInWidget]'
})
export class CRDSSignInWidgetDirective implements OnInit {
  constructor(private el: ElementRef, private crdsAuth: CrdsSigninService, private log: LoggerService, private renderer: Renderer2) {}
  @Input() crdsSignInWidget;

  ngOnInit() {
    this.renderer.setAttribute(this.el, 'id', 'widget-container')
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
