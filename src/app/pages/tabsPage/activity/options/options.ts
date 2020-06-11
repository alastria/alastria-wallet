import { Component, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the OptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'options',
  templateUrl: 'options.html',
  styleUrls: ['/options.scss']
})
export class OptionsComponent {

  @Output() handleSelectAll: EventEmitter<boolean> = new EventEmitter();
  @Output() handleDeleteActivities: EventEmitter<any> = new EventEmitter();
  @Output() handleBackupActivities: EventEmitter<any> = new EventEmitter();
  isSelectAll: boolean;
  isIndeterminate = true;

  constructor() {
  }

  /**
   * Function that emit event when click in checkbox 'todos'
   */
  public clickSelectAll(): void {
    this.isSelectAll = !this.isSelectAll;
    this.handleSelectAll.emit(this.isSelectAll);
  }

  public clickSelectAllFromParent(isIndeterminate: boolean, isSelectAll: boolean): void {
    this.isIndeterminate = isIndeterminate;
    this.isSelectAll = isSelectAll;
    this.handleSelectAll.emit(null);
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
