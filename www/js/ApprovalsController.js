var ApprovalsController = function(pModel, pView)
{
    this.model = pModel;
    this.view = pView;
    this.validator = new ApprovalsValidator();
    this.timer;
    this.pinAttempts = 3;

    //this.deferredApprovalItems = null;

    // Phases
    //this.registerDisabled = false;
    //this.loginDisabled = false;

    //this.showNonCriticalErrors = true; // Have we logged in and got some previous data

    this._createTimer();
}

var timerRefreshInterval = 1000 * 60 * 60; // One hour

ApprovalsController.prototype = {
    destroy: function()
    {
        clearInterval(this.timer); // Clear any previous
        this.timer = null;
    },
    showFirstPage: function()
    {
        console.log("showFirstPage() " + this.model.extendedActivationKey);
        app.loggedIn = false;
        // Work out and goto first page
        if (this.model.isRegistered())
        {
            this.handleGoToLoginPage();
        }
        else
        {
            // We are not registered so show registration screen
            this.handleGoToRegistrationPage();
        }
    },
    handleGoToRegistrationPage: function()
    {
        console.log("handleGoToRegistrationPage()");
        this.view.showRegistrationPage(app.appName, app.appVersion);
    },
    handleGoToLoginPage: function()
    {
        console.log("handleGoToLoginPage()");
        this.view.showLoginPage();
    },
    handleGoToExit: function()
    {
//        app.gatewayRuntimeToken = null;
          app.model.persistItems();
          app.restartApp();
    },
    handleRefresh: function()
    {
        // Assume the timer has fired
        this._refreshOnDemand();
    },
    _refreshTimerFired: function()
    {
        if (!app.pausedState && app.loggedIn && !app.modalDialogShown && app.hasHadData)
        {
            if (this.canSend())
            {
                console.log("AutoSending...");
                //app.tracker += ", AutoSending...";
                this.sendPendingItems();
            }
            if (!app.updateListInProgress)
            {
                app.updateListRequired = true;
                if (this.view.isCategoriesPageDisplayed())
                {
                   //this.getApprovalItems(showNetworkErrors);
                   this.handleGoToCategoriesPage(0);
                }
            }
        }
    },
    _refreshOnDemand: function()
    {
            //app.tracker += ", AutoSending...";
        this.sendPendingItems();
        if (!app.updateListInProgress)
        {
            //this.updateListRequired = true;
            //this.getApprovalItems(showNetworkErrors);
            app.updateListRequired = true;
            this.handleGoToCategoriesPage(0,true);
        }
    },
    canSend:function()
    {
        //return !this.view.isItemPageDisplayed();
        return !this.view.isInPendingSection() && !this.view.isItemPageDisplayed();
    },
    _createTimer: function()
    {
        if (this.timer != null)
            clearInterval(this.timer); // Clear any previous
        this.timer = setInterval("app.controller._refreshTimerFired();", timerRefreshInterval);
    },
    handleGoToCategoriesPage:function(mode, showErrors)
    {
        console.log("HandleGoToCategoriesPage");
        if (!app.loggedIn)
            return;

        var showNetworkErrors = false;
        if(app.hasHadData != true && app.hasHadData != false)
        {
            app.hasHadData = false;
        }
        if (showErrors == true || showErrors == false)
        {
           showNetworkErrors = showErrors;
        }
        else
        {
           showNetworkErrors = !app.hasHadData;
        }
        if(!app.updateListRequired)
        {
            app.updateListInProgress = false;
            app.updateListRequired = false;
            this.view.showCategoriesPage(mode);
        }
        else
        {
            app.updateListInProgress = true;
            app.updateListRequired = false;
            if ($.mobile.activePage.attr("id") == "categoriesPage")
            {
                this.view.showCategoriesPage(mode);
            }
            this.getApprovalItems(showNetworkErrors);
        }
    },
    getApprovalItems:function(showNetworkErrors)
    {
            app.view.showLoading("Getting Data");
            console.log("Getting more data");
            console.log("Show Network Errors" + showNetworkErrors);
            // We need to get the data from server and when completed we should go to
            // the display of the data.

            //var transactions = app.model.getHandledTransactions();
            //console.log("Transactions",transactions);
            app.routerService.getApprovalItems( app.model.extendedActivationKey, showNetworkErrors,
                function(response)
                {
                    app.controller.approvalsRetrieved(response.approvals);
                },
                function (error)
                {
                    app.controller.retrievalFailed(error);
                }
            );
    },
    setApprovalItems:function(items)
    {
        /*if (this.deferredApprovalItems != null)
        {*/
            // We have items so update the model
            this.model.setApprovalItems(items);
            //this.deferredApprovalItems = null;
        //}
    },
    _filterTransactions:function()
    {
        var trans = app.model.getHandledTransactions();
        console.log("Trans", trans);
        if (trans.length > 0)
        {
            //var trans = [{"txId":"123","status":"SUCCESS"},{"txId":"456","status":"PENDING"},{"txId":"789","status":"FAIL"}];
            app.routerService.getTransactionStatusList(this.model.extendedActivationKey, trans,
                function(transactionSet)
                {
                    console.log("transactionSet",transactionSet);
                    app.model.filterTransactions(transactionSet);
                },
                function (error)
                {
                    app.controller.retrievalFailed(error);
                }
            );
        }
    },
    approvalsRetrieved: function(items)
    {
         // As we have got some Approvals from a previous time
        // we have got some items back from server, but we may not be on the screen to display them

        //this.deferredApprovalItems = items;
        /*if (this.view.isCategoriesPageDisplayed())
        {*/
        // We need to refresh the page
            console.log("Retrieved", items);
            this._filterTransactions();
            this.setApprovalItems(items);
            //this.showNonCriticalErrors = false;
            app.hasHadData = true;
            this._finaliseRetrieval();
        //}
    },
    retrievalFailed: function(error)
    {
        this._finaliseRetrieval();
    },
    _finaliseRetrieval: function()
    {
        this.view.hideLoading();
        app.updateListInProgress = false;
        app.updateListRequired = false;
        this.view.showCategoriesPage(0);
    },
    handleGoToCategoryItemsPage: function(mode, currentCategoryId)
    {
        // Set the current category id if moving forward
        if (currentCategoryId != undefined)
        {
            this.model.currentCategoryId = currentCategoryId;
        }
        //this.view.hideLoading();
        this.view.showCategoryItemsPage(mode);
    },
    handleGoToItemPage: function (mode, itemId)
    {
        //this.view.showLoading("Loading");
        if (itemId != null && itemId != undefined && itemId != "")
        {
          this.model.setCurrentItemToId(itemId);
        }
        //this.view.hideLoading();
        this.view.showItemPage(mode);
        //this.view.hideLoading();
    },
    handleGoToSettingsPage:function()
    {
        this.view.showSettingsPage();
    },
    handleGoToPendingPage:function(mode)
    {
        this.view.showPendingPage(mode);
    },
    handleGoToPendingItemPage:function(currentPendingId)
    {
        this.model.setPendingItemToId(currentPendingId)
        if (!(this.model.pendingItem == {} || this.model.pendingItem == null || this.model.pendingItem == undefined))
        {
            this.view.showPendingItemPage();
        }
        else
        {
            this.model.setPendingItemToId(null);
            this.view.showPendingPage();
        }
    },
    handleGoToExtendedDescriptionPage: function(header, description)
    {
        app.view.showExtendedDescriptionPage(header, description);
    },
    handleApproveItem: function()
    {
        console.log("Pending ",this.model.pendingItems);
        if (!this.model.pendingItems.hasOwnProperty(this.model.currentItem.id))
        {
            console.log("Add to Pending "+this.model.currentItem.id);
            app.controller._addToQueue(true, "");
        }
        else
        {
            console.log("Wont add to Pending "+this.model.currentItem.id);
        }
    },
    handleRejectItem: function()
    {
        app.controller.view.showRejectCommentDialog();
    },
    handleRejectItemWithComment: function(comment)
    {
        console.log("Pending ",this.model.pendingItems);
        if (!this.model.pendingItems.hasOwnProperty(this.model.currentItem.id))
        {
            console.log("Add to Pending "+this.model.currentItem.id);
            app.controller._addToQueue(false, comment);
        }
        else
        {
            console.log("Wont add to Pending "+this.model.currentItem.id);
        }
    },
    _addToQueue: function(accept, commentValue)
    {
       //app.tracker += ", Cont AddToPending";
        this.view.showLoadingPage();
        this.model._removeCurrentItemFromApprovals();
        this.goBackFromItemPage();
        this.model.addToQueue(accept, commentValue);
        //this.view.goBackFromItemPage(this.model.currentCategoryId);
        console.log("Submitting...");
        //app.tracker += ", Submitting...";
        this.sendPendingItems();
        app.model.persistItems();
    },
    handleRegisterDevice: function()
    {
        if(this.validator.validateRegistration())
        {
            this.view.showLoading( "Registering");
            if(app.registerDisabled != true)
            {
                app.registerDisabled = true;
                // Don't like the extract of the screen fields, seems too tightly coupled
                var activationKey = $('#activationKey').val();
                var registrationPin = $('#registrationPin').val();
                console.log( "Trying to register device with " + activationKey + " " + registrationPin );
                app.routerService.setDevice(app.device);
                app.routerService.setClientVersion(app.clientVersion);
                app.routerService.registerDevice(activationKey, registrationPin,
                    function(extendedActivationKey, deviceId)
                    {
                        app.controller.registered(extendedActivationKey,deviceId);
                    }
                );
            }
        }
    },
    registered: function (extendedActivationKey, deviceId)
    {
        this.view.hideLoading();
        app.registerDisabled = false;
        app.setPersistentUUID(deviceId);
        console.log("registered( )" + extendedActivationKey);
        this.model.setExtendedActivationKey(extendedActivationKey);
        this.handleGoToLoginPage();
    },
    handleLogin: function (pin)
    {
            console.log( "Log in click");
            this.view.showLoading( "Logging In");
            LOADING_DESTINATION = "#loginPage";
                app.loginDisabled = true;
                // Use router to validate
                app.routerService.setDevice(app.device);
                app.routerService.setClientVersion(app.clientVersion);
                app.routerService.loginToRouter(this.model.extendedActivationKey, pin,
                    function(token,refreshInterval)
                    {
                        app.controller.successfulLogin(pin,token,refreshInterval);
                    },
                    function()
                    {
                        app.controller.invalidPinAttempt();
                    }
                );
    },
    successfulLogin: function (pin,gatewayRuntimeToken, refreshInterval)
    {
        console.log("successfulLogin()");
        console.log( "Logged in with pin " + pin );
        // The refreshInterval is in minutes but we need milliseconds
        timerRefreshInterval = refreshInterval * 1000;
        console.log( "Set refresh interval to " + timerRefreshInterval );
        //timerRefreshInterval = 15000;
        // We can now start the timer
        this._createTimer();
        this.view.hideLoading();
        app.loggedIn = true;
        app.loginDisabled = false;
        app.updateListRequired = true;
        this.pinAttempts = 3;
        app.dataResetPerformed = false;
        app.gatewayRuntimeToken = gatewayRuntimeToken;
        this.handleGoToCategoriesPage(1, true);
    },
    invalidPinAttempt: function()
    {
        app.view.hideLoading();
        app.loginDisabled = false;
        this.pinAttempts--;
        console.log( "invalid pin attempts left is " + this.pinAttempts );
        if (this.pinAttempts == 0)
        {
            // We have exhausted all attempts
            this.view.showErrorPage("You have exceeded the allowed login attempts.");
        }
        else
        {
            this.handleGoToLoginPage();
        }
    },
    sendPendingItems: function()
    {
            console.log("Sending items");
            // The timer has gone off, or an item has been added so we want to try and send to the server
            if(this.model.pendingItems != null)
            {
                for (var key in this.model.pendingItems)
                {
                    if (this.model.pendingItems.hasOwnProperty(key))
                    {
                            var pendingItem = this.model.pendingItems[key];
                            this.sendPendingItem(pendingItem);
                    }
                }
            }
    },
    sendPendingItem:function(pendingItem)
    {
        //console.log("sending item with key " + key);
        // Send this item var envelope = { "id": pendingItem.id };
        console.log("Sending item");
        var envelope = { "id": pendingItem.id };
        if (pendingItem.approved)
        {
            envelope.action = "approved";
            envelope.comment = "";
        }
        else
        {
            envelope.action = "rejected";
            envelope.comment = routerServiceEncode(pendingItem.comment);
        }
        console.log("Envelope",envelope);
        var update = { "ApprovalUpdate": envelope };
        this.sendUpdate(update, pendingItem.id);
    },
    sendUpdate: function(update, id)
    {
        app.routerService.sendApprovalItem(app.model.extendedActivationKey, id, update,
            function(itemId, txId)
            {
                console.log("txIdReceived", txId);
                app.controller.pendingItemSent(itemId,txId);
            },
            function(itemId)
            {
                console.log("itemFailed", itemId);
                if(app.model.pendingItems.hasOwnProperty(itemId))
                {
                    app.model.pendingItems[itemId].sendInProgress = false;
                    console.log("Send In Progress", app.model.pendingItems[itemId].sendInProgress);
                    app.model.persistItems();
                }
            }
        );
    },
    pendingItemSent: function(itemId,txId)
    {
        console.log("We have sent pending item " + itemId);
        this.model.pendingItems[itemId].sendInProgress = false;
        this.model.removePendingItem(itemId);
        app.model.setHandledTransaction(itemId,txId);
        app.model.persistItems();
    },
    goBackFromItemPage: function()
    {
        if (this.model.categoryItems.hasOwnProperty(this.model.currentCategoryId))
        {
            if (this.model.categoryItems[this.model.currentCategoryId].length == 0)
            {
                this.handleGoToCategoriesPage(-1);
            }
            else
            {
                this.handleGoToCategoryItemsPage(-1);
            }
        }
        else
        {
            this.handleGoToCategoriesPage(-1);
        }
    },
    setToTestMode: function()
    {
        app.view.showModalDialog("Connecting to test system. Please enter your registration details for this system",
            function() { app.setMode(TEST_MODE); app.wipeLocalStorage(); app.restartApp() });
        return false;
    },
    setToTrialMode: function()
    {
        app.setMode(TRIAL_MODE);
        app.wipeLocalStorage();
        app.createDynamicClasses();
    },
    handleAlreadyInTestMode: function()
    {
        app.view.showModalDialog("You are already in test mode. Please enter your registration details for this system",
            function() { app.displayFirstScreen() });
        return false;
    }
}




