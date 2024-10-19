import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'change-username',
    loadChildren: () => import('./pages/change-username/change-username.module').then( m => m.ChangeUsernamePageModule)
  },
  {
    path: 'add-task',
    loadChildren: () => import('./pages/add-task/add-task.module').then( m => m.AddTaskPageModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./pages/tasks/tasks.module').then( m => m.TasksPageModule)
  },
  {
    path: 'completed-tasks',
    loadChildren: () => import('./pages/completed-tasks/completed-tasks.module').then( m => m.CompletedTasksPageModule)
  },
  {
    path: 'detail-tasks',
    loadChildren: () => import('./pages/detail-tasks/detail-tasks.module').then( m => m.DetailTasksPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./admin/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'add-users',
    loadChildren: () => import('./admin/add-users/add-users.module').then( m => m.AddUsersPageModule)
  },
  {
    path: 'detail-users/:id',
    loadChildren: () => import('./admin/detail-users/detail-users.module').then( m => m.DetailUsersPageModule)
  },
  {
    path: 'edit-users/:id',
    loadChildren: () => import('./admin/edit-users/edit-users.module').then( m => m.EditUsersPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./admin/category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'add-category',
    loadChildren: () => import('./admin/add-category/add-category.module').then( m => m.AddCategoryPageModule)
  },
  {
    path: 'detail-category/:id',
    loadChildren: () => import('./admin/detail-category/detail-category.module').then( m => m.DetailCategoryPageModule)
  },
  {
    path: 'edit-category/:id',
    loadChildren: () => import('./admin/edit-category/edit-category.module').then( m => m.EditCategoryPageModule)
  },
  {
    path: 'adminhome',
    loadChildren: () => import('./admin/adminhome/adminhome.module').then( m => m.AdminhomePageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
  
  

  



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
