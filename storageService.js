app.service('storageService', function() {
    this.saveData = function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    };

    this.getData = function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    };
});
