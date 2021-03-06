import angular from 'angular';
import uiRouter from 'angular-ui-router';

import ngUiRouterMiddleware from 'redux-ui-router';
import ngRedux from 'ng-redux';
import * as redux from 'redux';
import createLogger from 'redux-logger';

const logger = createLogger({
  level: 'info',
  collapsed: true
});

import {router} from 'redux-ui-router';

console.log(router);

const reducers = redux.combineReducers({
  router
});

import thunk from 'redux-thunk';

export default angular
  .module('demoApp', [
    uiRouter,
    ngRedux,
    ngUiRouterMiddleware
  ])
  .config(($urlRouterProvider, $stateProvider) => {
    $urlRouterProvider.otherwise('/app');

    $stateProvider
      .state('app', {
        url: '/app',
        views: {
          main: {
            template: `
              <pre>{{ globalState | json }}</pre>
                <div class="mainView">
                <h1>Main View</h1>

                <ul>
                  <li>
                    <a ui-sref="app">Main View</a>
                    <ul>
                      <li><a ui-sref="app.child1">Child View 1</a></li>
                      <li><a ui-sref="app.child2">Child View 2</a></li>
                    </ul>
                  </li>
                </ul>
                <div ui-view="child"></div>
              </div>
            `,
            controller: ($scope, $ngRedux) => {
              $scope.globalState = {};

              $ngRedux.connect(state => state, state => $scope.globalState = state);
            }
          }
        }
      })
      .state('app.child1', {
        url: '/child1?hello?optional',
        views: {
          child: {
            controller: ($scope, ngUiRouterActions) => {
              $scope.goto = () => {
                ngUiRouterActions.stateGo('app.child2');
              }

              $scope.transition = () => {
                ngUiRouterActions.stateTransitionTo('app.child2');
              }
            },
            template: `
              <div class="child-view">
                <h2>Child View 1</h2>
                <button ng-click="goto()">$state.go View 2</button>
                <button ng-click="transition()">$state.transition View 2</button>
              </div>
            `
          }
        }
      })
      .state('app.child2', {
        url: '/child2',
        views: {
          child: {
            controller: ($scope, ngUiRouterActions) => {
              $scope.goto = () => {
                ngUiRouterActions.stateGo('app.child1');
              }

              $scope.goWithReload = () => {
                ngUiRouterActions.stateReload('app.child1');
              }

              $scope.goWithParams = () => {
                ngUiRouterActions.stateGo('app.child1', {
                  hello: 'world',
                  optional: true
                });
              }
            },
            template: `
              <div class="child-view">
                <h2>Child View 2</h2>
                <button ng-click="goto()">$state.go View 1</button>
                <button ng-click="goWithReload()">$state.reload</button>
                <button ng-click="goWithParams()">$state.go to View 1 with Params</button>
              </div>
            `
          }
        }
      })
  })
  .config(($ngReduxProvider) => {
    $ngReduxProvider.createStoreWith(reducers, ['ngUiRouterMiddleware', logger, thunk]);
  })
  .name;
