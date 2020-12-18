import { Injectable } from '@angular/core';
import { ActivityM } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {

    constructor() {

    }

    /**
     * Fake get, without call api (get activities)
     * @param type - parameter for get different types of activities
     * @returns - object with activities list in data property
     */
    getActivities( type: string ): any {
      const activitiesAll: any = {
        data: [
          {
            activityId: '1',
            title: 'Cinesa',
            subtitle: '1 Dato compartido',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam condimentum ante vel finibus luctus.',
            datetime: '12:45 PM',
            type: 'presentations'
          },
          {
            activityId: '2',
            title: 'Cinesa',
            subtitle: 'Autentificación con AlastriaID',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam condimentum ante vel finibus luctus.',
            datetime: 'Ayer',
            type: 'presentations'
          },
          {
            activityId: '3',
            title: 'Univeristat de Barcelona',
            subtitle: '3 nuevos datos añadidos',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam condimentum ante vel finibus luctus.',
            datetime: 'Ayer',
            type: 'otro'
          },
          {
            activityId: '4',
            title: 'Ayuntamiento de Castelldefels',
            subtitle: 'Revocación de 1 dato',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam condimentum ante vel finibus luctus.',
            datetime: 'Ayer',
            type: 'otro'
          }
        ]
      };

      const activitiesFilter = activitiesAll;

      if ( type !== 'all' ) {
        activitiesFilter.data = activitiesAll.data.filter(activity => (activity.type.toLowerCase() === type.toLowerCase()));
      }

      return activitiesFilter;
    }

    /**
     * Fake delete, without call api
     * @param ids - ids of activities for delete
     * @param activities - list of activities fake
     */
    deleteActivities(ids: Array<number>, activities: Array<ActivityM>) {
      const result = activities.filter(activity => {
        let isDelete = false;
        ids.forEach(id => {
          if (activity.activityId === id) {
            isDelete = true;
          }
        });
        if (!isDelete) {
          return activity;
        }
      });
      return {
        data: result
      };
    }

    backupActivities(ids: Array<number>) {
      return true;
    }
}
