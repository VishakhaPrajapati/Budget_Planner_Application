var app = angular.module('budgetApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'login.html',
            controller: 'LoginController'
        })
        .when('/dashboard', {
            templateUrl: 'dashboard.html',
            controller: 'DashboardController'
        })
        .otherwise({ redirectTo: '/' });
});

app.controller('MainController', function($scope) {
    $scope.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode');
    };
});

