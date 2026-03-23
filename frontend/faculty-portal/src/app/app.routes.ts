import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { FacultyLogin } from './components/faculty-login/faculty-login';
import { CrLogin } from './components/cr-login/cr-login';
import { FacultyDashboard } from './components/faculty-dashboard/faculty-dashboard';
import { CrDashboard } from './components/cr-dashboard/cr-dashboard';
import { authGuard } from './guards/auth-guard';
import { FacultySignup } from './components/faculty-signup/faculty-signup';
import { CrSignup } from './components/cr-signup/cr-signup';
import { CrHome } from './components/cr-home/cr-home';
import { CrCreateClass } from './components/cr-create-class/cr-create-class';
import { CrCreateSubject } from './components/cr-create-subject/cr-create-subject';
import { CrAssignSchedule } from './components/cr-assign-schedule/cr-assign-schedule';
import { FacultyHome } from './components/faculty-home/faculty-home';
import { FacultyCreateSession } from './components/faculty-create-session/faculty-create-session';
import { FacultyGeneralNotes } from './components/faculty-general-notes/faculty-general-notes';

export const routes: Routes = [
  { path: '',component: Home },
  { path: 'faculty-signup', component: FacultySignup },
  { path: 'faculty-login', component: FacultyLogin },
  { path: 'cr-signup', component: CrSignup },
  { path: 'cr-login', component: CrLogin },
  { path: 'faculty-dashboard', component: FacultyDashboard, canActivate: [authGuard] },
  { path: 'cr-dashboard', component: CrDashboard, canActivate: [authGuard] },
  { path: 'cr-home', component: CrHome, canActivate: [authGuard] },
  { path: 'cr-create-class', component: CrCreateClass, canActivate: [authGuard] },
  { path: 'cr-create-subject', component: CrCreateSubject, canActivate: [authGuard] },
  { path: 'cr-assign-schedule', component: CrAssignSchedule, canActivate: [authGuard]},
  { path: 'faculty-home', component: FacultyHome, canActivate: [authGuard] },
  { path: 'faculty-create-session', component: FacultyCreateSession, canActivate: [authGuard] },
  { path: 'faculty-general-notes', component: FacultyGeneralNotes, canActivate: [authGuard] }
];