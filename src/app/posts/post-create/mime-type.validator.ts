import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (!control.value || typeof control.value === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
          0,
          4
        );
        let header = '';
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs;
};

// import { AbstractControl } from '@angular/forms';
// // Of is a quick and easy way of adding or creating an
// // observable, which will emit data immediately.
// import { Observable, Observer, of } from 'rxjs';

// export const mimeType = (
//   control: AbstractControl
// ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
//   if (typeof control.value === 'string') {
//     return of(null);
//   }
//   const file = control.value as File;
//   const fileReader = new FileReader();
//   const frObservable = new Observable(
//     (observer: Observer<{ [key: string]: any }>) => {
//       fileReader.addEventListener('loadend', () => {
//         const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(
//           0,
//           4
//         );
//         let header = '';
//         let isValid = false;
//         for (let i = 0; i < arr.length; i++) {
//           header += arr[i].toString(16);
//         }

//         switch (header) {
//           case '89504e47':
//             // observer.next({ mimeType: 'image/png' });
//             isValid = true;
//             break;
//           case '47494638':
//             // observer.next({ mimeType: 'image/gif' });
//             break;
//           case 'ffd8ffe0':
//             // observer.next({ mimeType: 'image/jpeg' });
//             break;
//           case 'ffd8ffe1':
//             // observer.next({ mimeType: 'image/jpeg' });
//             break;
//           case 'ffd8ffe2':
//             // observer.next({ mimeType: 'image/jpeg' });
//             break;
//           case 'ffd8ffe3':
//             // observer.next({ mimeType: 'image/jpeg' });
//             break;
//           case 'ffd8ffe8':
//             // observer.next({ mimeType: 'image/jpeg' });
//             isValid = true;

//             break;
//           default:
//             isValid = false; // Or you can use blob.type as a fallback
//             // observer.next({ mimeType: 'unknown' });
//             break;
//         }
//         if (isValid) {
//           observer.next(null);
//         } else {
//           observer.next({ invalidMimeType: true });
//         }
//         observer.complete();
//       });
//       fileReader.readAsArrayBuffer(file);
//     }
//   );
//   return frObservable;
// };

