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
      }
    ]
  },
  { path: '', redirectTo: '/reader/pdf', pathMatch: 'full' }
];
