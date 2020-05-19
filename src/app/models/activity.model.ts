import { AppConfig } from '../../app.config';

export class ActivityM {
    activityId: number;
    title: string;
    subtitle: string;
    description: string;
    datetime: string;
    type: string;
    status: AppConfig.ActivityStatus;
    removeKey: string;
}