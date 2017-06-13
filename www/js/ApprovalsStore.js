var ApprovalsStore = function() {
}

ApprovalsStore.prototype = {
    getPersistedData: function(key)
    {
        return JSON.parse(localStorage.getItem(key));
    },
    putPersistedData: function(key,data)
    {
        localStorage.setItem(key, JSON.stringify(data));
    }
}




