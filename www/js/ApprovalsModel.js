var ApprovalsModel = function(persistentStore)
{
    this.persistentStore = persistentStore;
    this.currentItem = null;
    this.pendingItem = null;
    this.currentCategoryId = null;
    this.categoryItems = [];
    this.categorySet = [];

    this.extendedActivationKey = null;
    this.pendingItems = new Object();
    this.itemIdMap = new Object();
    this.handledItems = new Object();
}

var APPLICATION_KEY = "APPROVALS_APPLICATION_STORE";
var PENDING_ITEMS_KEY = "PENDING_ITEMS_STORE";
var HANDLED_ITEMS_KEY = "HANDLED_ITEMS_STORE";
var MODE_KEY = "MODE_STORE";

ApprovalsModel.prototype = {
    loadDataFromPersistentStore: function()
    {
        console.log( "loadDataFromPersistentStore()" );
        var storeData = this.persistentStore.getPersistedData(APPLICATION_KEY);
        // If the storeData is null then we have not initialised the store yet
        if (storeData != null && storeData.extendedActivationKey != undefined)
        {
            console.log( "Got store values" );
            this.extendedActivationKey = storeData.extendedActivationKey;
            this.pendingItems = this.persistentStore.getPersistedData(PENDING_ITEMS_KEY);
            this.handledItems = this.persistentStore.getPersistedData(HANDLED_ITEMS_KEY);
        }
        else
        {
            console.log( "no persistent data" );
            // No data exists yet so initialise by saving our current state
            this.clearAllPersistentData();
        }
        console.log( "extendedActivationKey " + this.extendedActivationKey);
        console.log( "PendingItems ", this.pendingItems);
        console.log( "HandledItems ", this.handledItems);
    },
    getMode: function()
    {
        console.log( "getMode()" );
        if(this.persistentStore.getPersistedData(MODE_KEY) != null &&
        this.persistentStore.getPersistedData(MODE_KEY) != undefined &&
        this.persistentStore.getPersistedData(MODE_KEY) != "")
        {
           return this.persistentStore.getPersistedData(MODE_KEY).mode;
        }
        else
        {
           return null;
        }
    },
    setMode: function(mode)
    {
        console.log("mode " + mode);
        // Now update the store
        var storeData = { "mode":  mode};
        this.persistentStore.putPersistedData( MODE_KEY, storeData );
    },
    clearAllPersistentData: function() {
        this.wipeAuthenticationDetails();
        this.clearApplicationStoredData();
    },
    clearApplicationStoredData:function()
    {
        this.categorySet = [];
        this.categoryItems = new Object();
        this.pendingItems = new Object();
        this.handledItems = new Object();
        this.itemIdMap = new Object();
        this.persistentStore.putPersistedData( PENDING_ITEMS_KEY, this.pendingItems );
        this.persistentStore.putPersistedData( HANDLED_ITEMS_KEY, this.handledItems );
    },
    wipeAuthenticationDetails: function() {
        this.extendedActivationKey = null;
        var storeData = { extendedActivationKey: this.extendedActivationKey };
        this.persistentStore.putPersistedData( APPLICATION_KEY, "" );
    },
    setApprovalItems:function(items)
    {
        this._createHierarchy(items);
        this._filterHandled();
    },
    setExtendedActivationKey: function(extendedActivationKey)
    {
        console.log("setExtendedActivationKey " + extendedActivationKey);
        this.extendedActivationKey = extendedActivationKey;
        // Now update the store
        var storeData = { extendedActivationKey: this.extendedActivationKey };
        this.persistentStore.putPersistedData( APPLICATION_KEY, storeData );
    },
    _createHierarchy: function (items)
    {
        console.log("items",items);
        if(items != undefined)
        {
            this.itemIdMap = new Object();
            this.categoryItems = new Object();
            var categoryNames = [];
            this.categoryItems["All"] = [];
            for (i = 0; i < items.length; i++)
            {
                var item = items[i];
                var itemCategory = item.category;
                if ($.inArray(itemCategory, categoryNames) < 0)
                {
                    categoryNames.push(itemCategory);
                    this.categoryItems[itemCategory] = [];
                }
                this.categoryItems[itemCategory].push(item);
                //this.categoryItems["All"].push(item);
                this.itemIdMap[item.id] = item;
            }
            for (var cat in this.categoryItems)
            {
                if (this.categoryItems.hasOwnProperty(cat)) {
                    console.log("Cat", cat);
                    console.log("CatItems",this.categoryItems[cat]);
                    //$.extend(true,this.categoryItems["All"], this.categoryItems[cat]);
                    //for (i = 0; i < this.categoryItems[cat].length; i++)
                    //{
                        //this.categoryItems["All"].push(this.categoryItems[cat][i]);
                        $.merge(this.categoryItems["All"],this.categoryItems[cat]);
                        console.log("All", this.categoryItems["All"]);
                    //}
                }
            }
        }
    },
    _filterHandled: function()
    {
        var allItems = this.categoryItems["All"];

        // For each item in the received items if it remains in the Handled Store remove it from the received items
        var itemsToBeRemoved = [];
        for (i = 0; i >= 0 && i < allItems.length; i++)
        {
            var itemId = allItems[i].id;
            // check this in the handled store
            for (var key in this.handledItems)
            {
                if (this.handledItems.hasOwnProperty(key))
                {
                    if (itemId == key)
                    {
                        // Remove it
                        itemsToBeRemoved.push(itemId);
                        break;
                    }
                }
            }
        }

        // Now remove the items
        //console.log("Removed from Approvals",itemsToBeRemoved);
        for (ii = 0; ii < itemsToBeRemoved.length; ii++)
            this.removeItemFromApprovals(itemsToBeRemoved[ii]);

        console.log("allItems"+allItems);
    },
    setHandledTransaction: function(itemId, txId)
    {
        console.log("txId",txId);
        if (this.handledItems[itemId] != null)
        {
           this.handledItems[itemId].txId = txId;
        }
        console.log("HandledItems",this.handledItems);
        this.persistentStore.putPersistedData(HANDLED_ITEMS_KEY,this.handledItems);
    },
    filterTransactions: function(transactionObject)
    {
        console.log("Transaction", transactionObject);
        console.log("TransactionObject", transactionObject.length);
        console.log("HandledItems", this.handledItems);
        for(var i = 0; i < transactionObject.length; i++)
        {
            console.log("Transaction i", transactionObject[i].txId + transactionObject[i].status);
            if(transactionObject[i].status != "PENDING")
            {
                for (var key in this.handledItems)
                {
                    if (this.handledItems.hasOwnProperty(key))
                    {
                      if (this.handledItems[key].hasOwnProperty("txId"))
                      {
                        if (this.handledItems[key].txId == transactionObject[i].txId)
                        {
                            console.log("Deleting HandledItem", this.handledItems[key]);
                            delete this.handledItems[key];
                            if (this.isPending(key))
                            {
                                console.log("Deleting PendingItem", this.pendingItems[key]);
                                delete this.pendingItems[key];
                            }
                        }
                            // Need to save the HandledItems
                      }
                    }
                }
            }
        }
        this.persistentStore.putPersistedData(HANDLED_ITEMS_KEY,this.handledItems);
    },
    updateCategoryCounts: function()
    {
        this.categorySet = [];
        for (var prop in this.categoryItems)
        {
            if (this.categoryItems.hasOwnProperty(prop)) {
                this.categorySet.push({"category":prop, "count":this.categoryItems[prop].length});
            }
        }
    },
    addToQueue: function(accept, commentValue)
    {
        //app.tracker += ", Model AddToPending";

            console.log("Pended"+this.handledItems.hasOwnProperty(this.currentItem.id));
            this.currentItem.comment = commentValue;
            this.currentItem.approved = accept;
            var pendingItem = new Object();
            pendingItem.id = this.currentItem.id;
            pendingItem.header1 = this.currentItem.header1;
            pendingItem.header2 = this.currentItem.header2;
            pendingItem.header4 = this.currentItem.header4;
            pendingItem.approved = accept;
            pendingItem.comment = this.currentItem.comment;
            //pendingItem.sendInProgress = false;
            this.pendingItems[pendingItem.id] = pendingItem;
            this.pendingItems[pendingItem.id].sendInProgress = false;
            //console.log("pendingItem", this.pendingItems[this.currentItem.id]);
            //console.log("pendingItemId",this.currentItem.id);
            this.handledItems[this.currentItem.id] = {id: this.currentItem.id, txId: null};
            console.log("Pended"+pendingItem.id);
            //console.log("handledItem", this.handledItems[this.currentItem.id]);
            //console.log("handledItems", this.handledItems);
            // Save these changes to the store
            //console.log("AddToPendingList");
    },
    isQueued:function(id)
    {
        return (this.isPending(id) || this.isHandled(id));
    },
    isPending:function(id)
    {
      return (this.pendingItems.hasOwnProperty(id));
    },
    isHandled:function(id)
    {
      return (this.handledItems.hasOwnProperty(id));
    },
    persistItems:  function()
    {
        //app.tracker += ", persistItems";
        this.persistentStore.putPersistedData(PENDING_ITEMS_KEY,this.pendingItems);
        this.persistentStore.putPersistedData(HANDLED_ITEMS_KEY,this.handledItems);
    },
    removePendingItem: function(itemId)
    {
        console.log( "Removing pending item " + itemId );
        delete this.pendingItems[itemId];
        app.model.persistItems();
        console.log("PendingItems",this.pendingItems);
    },
    _removeCurrentItemFromApprovals: function ()
    {
        this.removeItemFromApprovals(this.currentItem.id);
    },
    removeItemFromApprovals: function (itemId)
    {
        var allItems = this.categoryItems["All"];
        var foundItem = null;
        for (ri = allItems.length - 1; ri >= 0; ri--)
        {
            n = allItems[ri];
            if (n.id == itemId)
            {
                foundItem = n;
                this.categoryItems["All"].splice(ri, 1);
                break;
            }
        }
        if (foundItem != null)
        {
            var categoryItems = this.categoryItems[foundItem.category];
            for (ri = categoryItems.length - 1; ri >= 0; ri--)
            {
                n = categoryItems[ri];
                if (n.id == itemId)
                {
                    this.categoryItems[foundItem.category].splice(ri, 1);
                    break;
                }
            }
            if (this.categoryItems[foundItem.category].length < 1)
            {
              delete this.categoryItems[foundItem.category];
            }
        }
    },
    getPendingItem: function (itemId)
    {
        return this.pendingItems[itemId];
    },
    setPendingItemToId: function(itemId)
    {
        this.pendingItem = this.getPendingItem(itemId);
    },
    getHandledTransactions: function()
    {
        console.log("HandledItemTransactions", this.handledItems);
        var transactions = [];
        for (var key in this.handledItems)
        {
            if (this.handledItems.hasOwnProperty(key)) {
              if(this.handledItems[key].hasOwnProperty("txId"))
              {
                if (this.handledItems[key].txId  != null)
                {
                   transactions.push(this.handledItems[key].txId);
                }
              }
            }
        }
        return transactions;
    },
    clearSendInProgress:function()
    {
        console.log("ClearSendInProgress");
        for (var key in this.pendingItems)
        {
            if (this.pendingItems.hasOwnProperty(key)) {
                this.pendingItems[key].sendInProgress = false;
            }
        }
        this.persistentStore.putPersistedData(PENDING_ITEMS_KEY,this.pendingItems);
    },
    isCategoryEmpty:function(categoryId)
    {
       return (this.categoryItems[categoryId].length == 0);
    },
    setCurrentItemToId: function(itemId)
    {
        this.currentItem = this.itemIdMap[itemId];
        console.log("currentItem", this.currentItem);
    },
    getItem: function(item)
    {
       return this.itemIdMap[item];
    },
    isRegistered:function()
    {
       return (this.extendedActivationKey != undefined && this.extendedActivationKey != null);
    }
}
