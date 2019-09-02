import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageService} from '../../../_services/page.service';
import {DirectoryApi, PageApi} from '../../../_models/hierarchy';
import {sortBy} from 'lodash';
import {of, Subscription} from 'rxjs';
import {NotificationService} from '../../../_services/notification.service';
import {catchError, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-navigate-content',
  templateUrl: './navigate-content.component.html',
  styleUrls: ['./navigate-content.component.scss']
})
export class NavigateContentComponent implements OnInit, OnDestroy {

  pages: Array<PageApi>;
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private pageService: PageService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.pipe(
      map(params => params.path),
      switchMap((path: string) => {
        if (path && path.endsWith('/')) {
          return this.pageService.getRootDirectoryForPath(path);
        } else {
          return of<DirectoryApi>();
        }
      }),
      catchError(err => {
        return of<DirectoryApi>();
      }),
    ).subscribe(res => {
        if (res && res.pages) {
          this.pages = sortBy(res.pages, p => p.order) as Array<PageApi>;

          if (!this.activatedRoute.firstChild ||
            !this.activatedRoute.firstChild.snapshot.params ||
            !this.activatedRoute.firstChild.snapshot.params.page) {
            // No child route (ie directory route). Redirect to first page
            if (this.pages && this.pages[0] && this.pages[0].name) {
              this.router.navigate([this.pages[0].name], {relativeTo: this.activatedRoute});
            }
          }
        } else {
          this.pages = [];
        }
      },
      error => {
        this.notificationService.showError(`Error loading pages`, error);
        this.pages = [];
      });
  }

  trackByPage(index: number, item: PageApi) {
    return item.name;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}