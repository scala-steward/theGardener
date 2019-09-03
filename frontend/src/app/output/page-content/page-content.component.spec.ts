import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PageContentComponent} from './page-content.component';
import {ActivatedRoute} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRouteStub} from '../../_testUtils/activated-route-stub.spec';
import {PageService} from '../../_services/page.service';
import {of} from 'rxjs';
import {MarkdownModule} from 'ngx-markdown';
import {PageApi} from '../../_models/hierarchy';
import {MatProgressSpinnerModule, MatSnackBarModule} from '@angular/material';
import {SafePipe} from '../../safe.pipe';

describe('PageContentComponent', () => {
  let component: PageContentComponent;
  let fixture: ComponentFixture<PageContentComponent>;
  let page: Page;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageContentComponent,
        SafePipe,
      ],
      imports: [
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MarkdownModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub,
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageContentComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute) as any;

    activatedRoute.testParentParams = {name: '_eng', path: 'suggestionsWS>qa>/pmws/'};
    activatedRoute.testParams = {page: 'overview'};
  });

  it('should get page content from backend and show markdown', async(() => {
    const pageService: PageService = TestBed.get(PageService);
    spyOn(pageService, 'getPage').and.returnValue(of(PAGE_SERVICE_RESPONSE));

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(pageService.getPage).toHaveBeenCalledWith('suggestionsWS>qa>/pmws/overview');

    expect(page.title).toMatch('overview');
    expect(page.pageContent.startsWith('For various reasons'))
      .withContext(`Page content should start with "For various reasons" but was ${fixture.nativeElement.textContent}`)
      .toBeTruthy();
  }));

  it('should show an iframe if page is an external link', async(() => {
    const pageService: PageService = TestBed.get(PageService);
    spyOn(pageService, 'getPage').and.returnValue(of(PAGE_WITH_EXTERNAL_LINK_RESPONSE));

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(page.iframe).toBeTruthy();
    expect(page.iframe.src).toEqual('http://publisher.corp.kelkoo.net/docs/#/Contact%20Management/getContact');
  }));
});

class Page {
  constructor(private fixture: ComponentFixture<PageContentComponent>) {
  }

  get title(): string {
    const title = this.fixture.nativeElement.querySelector('h1');
    expect(title).toBeTruthy();
    return title.textContent;
  }

  get pageContent(): string {
    const pageContent = this.fixture.nativeElement.querySelector('.markdown');
    expect(pageContent).toBeTruthy();
    return pageContent.textContent;
  }

  get iframe() {
    return this.fixture.nativeElement.querySelector('iframe');
  }
}

const PAGE_SERVICE_RESPONSE: PageApi = {
  path: 'publisherManagementWS>qa>/constraints/overview',
  relativePath: '/constraints/overview',
  name: 'overview',
  label: 'overview',
  description: 'overview',
  order: 0,
  // tslint:disable-next-line:max-line-length
  markdown: 'For various reasons, the offers provided to the publishers can be filtered. We don\'t necessary want to provide all the offers to the publishers : ![Overview](../assets/images/constraints_overview.png) This is the constraints objective. The constraints can be defined manually by the **BizDevs** or automatically by the **TrafficOptimizer**. ### Reference and application The constraints are defined and stored in PMWS component. The impact of those constraints is implemented at the client level: - **eCS** and **ShoppingAPI** are filtering the call to Search6 - **FeedService** is filtering the offers provided (offers coming from OfferProcessing) - others systems are also using the constraints to filter offers provided to external clients : example GSA Exporter or COP. The constraints are stored against a profile (which is linked to a contract, which is linked to the publisher itself ([See details](thegardener://${current.project}/${current.branch}/overview))). All trackings of a profile share the same constraints. Clients are most of the time using a tracking as input data to find out what are the constraints to be applied. ### Different sources of constraints There are several ways to define the constraints : - for a publisher, [filter the merchants that can provide offers](thegardener://${current.project}/${current.branch}/constraints/for_a_publisher). - for a merchant, [filter the publishers that can receive offers](thegardener://${current.project}/${current.branch}/constraints/for_a_merchant). - moreover, [offers can be filtered for various reasons](thegardener://${current.project}/${current.branch}/constraints/for_an_offer). ![Sources](../assets/images/constraints_sources_overview.png) All those filters are cumulative : **each offer need to pass through all the filters**. In other words it\'s a AND between each constraint. We can see the impact of [those constraints on the PMBO](thegardener://${current.project}/${current.branch}/constraints/from_pmbo). ',
};

const PAGE_WITH_EXTERNAL_LINK_RESPONSE: PageApi = {
  path: 'publisherManagementWS>qa>/constraints/overview',
  relativePath: '/constraints/overview',
  name: 'overview',
  label: 'overview',
  description: 'overview',
  order: 0,
  markdown: '',
  externalLink: 'http://publisher.corp.kelkoo.net/docs/#/Contact%20Management/getContact'
};
