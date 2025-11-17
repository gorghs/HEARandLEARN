import {HttpClient} from '@angular/common/http';
import {Translation, TRANSLOCO_SCOPE, TranslocoLoader} from '@jsverse/transloco';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import {catchError, Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  getTranslation(langPath: string): Observable<Translation> {
    // During SSR, return empty translations to avoid errors
    if (!isPlatformBrowser(this.platformId)) {
      console.log(`SSR: Skipping translation load for ${langPath}`);
      return of({} as Translation);
    }

    const assetPath = `assets/i18n/${langPath}.json`;
    return this.http.get<Translation>(assetPath).pipe(
      catchError(err => {
        console.error(`Couldn't load translation file '${assetPath}'`, err);
        throw err;
      })
    );
  }
}

export const translocoScopes = {
  provide: TRANSLOCO_SCOPE,
  useValue: ['', 'countries', 'languages', 'signedLanguagesShort'],
};
