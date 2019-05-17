import { Component, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the OptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'options',
  templateUrl: 'options.html'
})
export class OptionsComponent {

  @Output() handleSelectAll: EventEmitter<boolean> = new EventEmitter();
  @Output() handleDeleteActivities: EventEmitter<any> = new EventEmitter();
  @Output() handleBackupActivities: EventEmitter<any> = new EventEmitter();
  public isSelectAll: boolean;

  constructor() {
  }

  /**
   * Function that emit event when click in checkbox 'todos'
  */
  public clickSelectAll(): void {
    this.handleSelectAll.emit(this.isSelectAll);
  }

  /**
   * Function that emit event when click in delete icon
  */
  public deleteActivities(): void {
    this.handleDeleteActivities.emit();
  }

  /**
   * Function that emit event when click in backup icon
  */
  public backupActivities(): void {
    this.handleBackupActivities.emit();
  }
}
