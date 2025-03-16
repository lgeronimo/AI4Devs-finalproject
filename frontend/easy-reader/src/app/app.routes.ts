import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reader',
    children: [
      {
        path: 'pdf',
        loadComponent: () => 
          import('./features/reader/pages/pdf-viewer/pdf-viewer.component')
            .then(m => m.PdfViewerComponent)
      },
      {
        path: 'web',
        loadComponent: () => 
          import('./features/reader/pages/web-viewer/web-viewer.component')
            .then(m => m.WebViewerComponent)
      }
    ]
  },
  { path: '', redirectTo: '/reader/web', pathMatch: 'full' }
];
