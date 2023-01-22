import {IMaterial} from './material';
import {IRole} from './role';
import {IProfile} from './profile';

export interface IUser {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    post?: string;
    avatar?: string;
    password: string;
    createDateTime: Date;
    updateDateTime: Date;
    roles: IRole[];
    profile: IProfile;
    materials: IMaterial[];
}
