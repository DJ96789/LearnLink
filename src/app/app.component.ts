import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NewStudentDialogComponent } from './Components/new-student-dialog/new-student-dialog.component';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  title = 'LearnLink';
  routerUrl:string = '';
  notifications:number = 0;
  showSpinner:boolean = false;
  selectedValue1:string = "";
  selectedValue2:string = "";
  selectedValue3:string = "";
  selectedValue4:string = "";
  autocompleteOptions:string[] = ['Angular', 'React', 'View'];
  objectOptions = [
    {name: 'Angular'},
    {name: 'Angular Material'},
    {name: 'React'},
    {name: 'Vue'},
  ];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>|undefined;

  minDate = new Date(2018,3,10);
  maxDate = new Date(2019,3,10);

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private _router: Router) {
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        console.log('Route change detected');
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        this.routerUrl = event.url;
        console.log(event);
      }

      if (event instanceof NavigationError) {
        // Hide progress spinner or progress bar

        // Present error to user
        console.log(event.error);
      }
    });
  }

  ngOnInit(): void {
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      )
      this.routerUrl = this._router.url;
  }

  private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.autocompleteOptions.filter(option => 
        option.toLowerCase().includes(filterValue)
        );
  }

  openSnackBar(message:string, action:string) {
    let snackBarRef = this.snackBar.open(message, action, {duration : 2000});
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('The snackbar was dismissed')
    });

    snackBarRef.onAction().subscribe(() => {
      console.log('The snackbar action was triggered')
    });

  }

  openDialog() {
    let dialogRef = this.dialog.open(NewStudentDialogComponent, { data:{name: 'Username'}});

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', {result});
    });
  }


  loadData() {
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 2000);
  }

  displayFn(subject:any) {
    return subject ? subject.name : undefined;
  }

}
