app.controller('LoginController', function($scope, $location) {
    $scope.isRegistering = false;
    $scope.username = '';
    $scope.password = '';
    $scope.registerUsername = '';
    $scope.registerPassword = '';

    // Toggle login/register view
    $scope.toggleForm = function() {
        $scope.isRegistering = !$scope.isRegistering;
    };

    // Register function
    $scope.register = function() {
        if (!$scope.registerUsername || !$scope.registerPassword) {
            alert("Please enter both username and password.");
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        const exists = users.find(u => u.username === $scope.registerUsername);
        if (exists) {
            alert("User already exists!");
            return;
        }

        users.push({
            username: $scope.registerUsername,
            password: $scope.registerPassword
        });

        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful!');
        $scope.isRegistering = false;
    };

    // Login function
    $scope.login = function() {
        let users = JSON.parse(localStorage.getItem('users')) || [];

        const match = users.find(u =>
            u.username === $scope.username && u.password === $scope.password
        );

        if (match) {
            localStorage.setItem('loggedInUser', $scope.username); // store current user
            $location.path('/dashboard');
        } else {
            alert('Invalid credentials!');
        }
    };
});

app.controller('DashboardController', function($scope) {
    // Get current logged-in user
    const currentUser = localStorage.getItem('loggedInUser');
    if (!currentUser) {
        alert("No user logged in!");
        return;
    }

    // ---------- INIT ----------
    $scope.currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
    $scope.currency = localStorage.getItem(currentUser + '_currency') || $scope.currencies[0];

    $scope.transactionType = 'income';
    $scope.amount = null;
    $scope.category = '';
    $scope.note = '';
    $scope.reminderDate = '';
    $scope.transactions = JSON.parse(localStorage.getItem(currentUser + '_transactions')) || [];

    $scope.categories = ['Salary', 'Food', 'Shopping', 'Bills', 'Entertainment', 'Travel', 'Other'];
    $scope.filterCategory = '';
    $scope.filterDate = '';

    // ---------- CURRENCY ----------
    $scope.updateCurrency = function () {
        localStorage.setItem(currentUser + '_currency', $scope.currency);
    };

    // ---------- TRANSACTION ----------
    $scope.addTransaction = function () {
        if (!$scope.amount || !$scope.transactionType || !$scope.category) {
            alert("Please fill required fields.");
            return;
        }

        const transaction = {
            type: $scope.transactionType,
            amount: parseFloat($scope.amount),
            category: $scope.category,
            note: $scope.note || '',
            date: new Date().toISOString(),
            reminder: $scope.reminderDate || '',
            currency: $scope.currency
        };

        $scope.transactions.push(transaction);
        localStorage.setItem(currentUser + '_transactions', JSON.stringify($scope.transactions));

        // Reset inputs
        $scope.amount = '';
        $scope.note = '';
        $scope.reminderDate = '';
        $scope.category = '';
    };

    // ---------- BALANCE ----------
    $scope.getBalance = function () {
        let income = 0;
        let expense = 0;

        $scope.transactions.forEach(function (t) {
            if (t.type === 'income') income += t.amount;
            else if (t.type === 'expense') expense += t.amount;
        });

        return income - expense;
    };

    // ---------- FILTER ----------
    $scope.filterTransactions = function (transaction) {
        const matchesCategory = !$scope.filterCategory || transaction.category === $scope.filterCategory;
        const matchesDate = !$scope.filterDate || (new Date(transaction.date).toDateString() === new Date($scope.filterDate).toDateString());
        return matchesCategory && matchesDate;
    };
});
