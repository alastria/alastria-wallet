import { NavControllerBase, App } from 'ionic-angular';

export function getNav(app: App): NavControllerBase {    
    const navs = app.getRootNavs(); 
    const result = (navs && navs.length > 0) ? navs[0] : app.getActiveNav();

    return result;
}
