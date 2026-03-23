import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { FacultyLogin } from './components/faculty-login/faculty-login';
import { CrLogin } from './components/cr-login/cr-login';
import { FacultyDashboard } from './components/faculty-dashboard/faculty-dashboard';
import { CrDashboard } from './components/cr-dashboard/cr-dashboard';
import { authGuard } from './guards/auth-guard';
import { FacultySignup } from './components/faculty-signup/faculty-signup';
import { CrSignup } from './components/cr-signup/cr-signup';

export const routes: Routes = [
  { path: '',component: Home },
  { path: 'faculty-signup', component: FacultySignup },
  { path: 'faculty-login', component: FacultyLogin },
  { path: 'cr-signup', component: CrSignup },
  { path: 'cr-login', component: CrLogin },
  { path: 'faculty-dashboard', component: FacultyDashboard, canActivate: [authGuard] },
  { path: 'cr-dashboard', component: CrDashboard, canActivate: [authGuard] }
];