var notificationCloseFunction;
var confirmationYesFunction;
var confirmationNoFunction;
var refreshFunction;
var ApprovalsView = function(pModel)
{
    this.model = pModel;
    this.helper = new ApprovalsViewHelper();
    $.templates({
        categoriesTemplate: '<li data-filtertext="{{:category}}"><a class="category"><div id="{{:category}}" name="{{:category}}" style="display:inline"><strong>{{:category}}</strong></div><span class="ui-li-count">{{:count}}</span></a></li>',
        wp8CategoriesTemplate: '<li data-filtertext="{{:category}}"><a class="category"><div id="{{:category}}" name="{{:category}}" style="display:inline"><strong>{{:category}}</strong></div><span class="ui-li-count">{{:count}}</span><br/><br/><br/></a></li>',
        /*categoryItemsTemplate: '<li category="{{:category}}"><a class="categoryItem"><div id="{{:id}}" style="display:none;"></div><span class="columnA" style="float:left"><p>{{:header1}}</p><p>{{:header2}}</p></span><span class="columnB" style="overflow: visible; float:right"><p>{{:header4}}</p></span></a></li>',*/
		categoryItemsTemplate: '<li category="{{:category}}"><a class="categoryItem"><div id="{{:id}}"></div><div><span style="text-overflow:clip; overflow:hidden; width:70%; white-space: normal; display:inline;"><p>{{:header1}}</p></span><span style="text-overflow:clip; overflow:hidden; width:*; white-space: normal; display:inline;"><p>{{:header4}}</p></span></div><div><p>{{:header2}}</p></div></a></li>',
        categoriesTitle:'<h1>{{:category}}</h1>',
        detailsTemplate:'<li><p class="name" style="margin-top:3px"><strong>{{:key}}</strong></p><p class="description" style="margin:0;padding:0;">{{:value}}</p> </li>',
        itemHeaderTemplate:'<h1>{{:header1}}</h1><p>{{:header2}}</p><p>{{:header3}}</p><p>{{:header4}}</p>',
        auxButtonTemplate:'<li><a class="{{:name}}" href="{{:location}}" rel="external" target="_blank"><strong>{{:msg}}</strong></a></li>',

        pendingTemplate: '<li category="{{:category}}"><a class="pendingItem"><div id="{{:id}}"></div><div><span style="text-overflow:clip; overflow:hidden; width:70%; white-space: normal; display:inline;"><h3><span style="color: {{if approved==true}} Green {{else}} Red {{/if}}">{{if approved==true}} Approved {{else}} Rejected {{/if}}</span></h3><p>{{:header1}}</p></span><span style="text-overflow:clip; overflow:hidden; width:*; white-space: normal; display:inline;"><p>{{:header4}}</p></span></div><div><p>{{:header2}}</p></div></a></li>',
        pendingItemTemplate:'<h2>{{:header1}}</h2><p>{{:header2}}</p><p>{{:header4}}</p><span style="color: {{if approved==true}} Green {{else}} Red {{/if}}"><p style="font-weight:600">{{if approved==true}} Approved {{else}} Rejected {{/if}}</p></span>',
        wp8LinesTemplate:'<div data-role="collapsible" class="coll"><h3 style="white-space: pre-line; overflow: visible; text-overflow: clip;">{{:header2}}</h3><ul class="list" data-role="listview" data-inset="false">{{for details}}<li><p style="margin-top:3px"><strong>{{:key}}</strong></p><p class="description" style="margin:0;padding:0;">{{:value}}</p></li>{{/for}} </ul></div>',
        linesTemplate:'<ul data-role="button" class="detailsButton"><details><summary style="white-space:normal;">{{:header2}}</summary><br/><ul class="list" data-role="listview" data-inset="false">{{for details}}<li>'
         +'<p style="margin-top:3px"><strong>{{:key}}</strong></p><p class="description" style="margin:0;padding:0;">{{:value}}</p></li>{{/for}}</ul></details></ul>',
		linesTemplate2:'<ul data-role="button" class="detailsButton" data-inset="false" data-role="listview"><details><summary>{{:header2}}</summary><br/><ul class="list" data-inset="false">{{for details}}<div>'
				+'<p style="margin-top:3px"><strong>{{:key}}</strong></p><p class="description" style="margin:0;padding:0;">{{:value}}</p></div>{{/for}}</ul></details></ul>',
		linesTemplate3:'<ul data-role="button" data-shadow="false" data-inset="true" class="detailsButton"><details><summary style="white-space:normal;">{{:header2}}</summary><br/><ul class="list" data-role="listview" data-inset="true">{{for details}}<li>'
				+'<p style="margin-top:3px"><strong>{{:key}}</strong></p><p class="description" style="margin:0;padding:0;">{{:value}}</p></li>{{/for}}</ul></details></ul>',
        linesTemplate4:'<div data-role="collapsible" class="coll" data-icon="carat-r" data-collapsed-icon="carat-r" data-expanded-icon="carat-d"><h3 style="white-space: pre-line; overflow: visible; text-overflow: clip;">{{:header2}}</h3><ul class="list" data-role="listview" data-inset="false">{{for details}}<li><p style="margin-top:3px"><strong>{{:key}}</strong></p><p class="description" style="margin:0;padding:0;">{{:value}}</p></li>{{/for}} </ul></div>',
		altLinesTemplate:'<div data-role="collapsible" class="coll" data-icon="arrow-r"><h3 style="white-space: pre-line; overflow: visible; text-overflow: clip;">{{:header2}}</h3><ul class="list" data-role="listview" data-inset="false">{{for details}}<li><p style="margin-top:3px"><strong>{{:key}}</strong></p><p class="description" style="margin:0;padding:0;">{{:value}}</p></li>{{/for}} </ul></div>'
    });
    /*if (/Windows Phone/i.test(navigator.userAgent)) {
        $("[data-role=footer]").css("position", "absolute");
        $("[data-role=header]").css("position", "absolute");
        $("html, body").css("-ms-touch-action", "pan-y");
        $("html, body").css("touch-action", "pan-y");
        $("html, body").css("-ms-content-zooming", "none");
    }
    else if (/Windows/i.test(navigator.userAgent)) {
        $("[data-role=footer]").css("position", "fixed");
    }*/
}
function initViewEventHandlers()
{
    $("#closeDialogBtn").on("click", function(e)
    {
        e.stopPropagation();
        e.preventDefault();
        app.modalDialogShown = false;
        console.log("notificationCloseFunction",notificationCloseFunction);
        if (notificationCloseFunction != null)
        {
            notificationCloseFunction();
        }
        else
        {
            closeDialog();
        }
    });
    $("#yesDialogBtn").on("click", function(e)
    {
        e.stopPropagation();
        e.preventDefault();
        app.modalDialogShown = false;
        if (confirmationYesFunction != null)
        {
            confirmationYesFunction();
        }
        else
        {
            closeDialog();
        }
    });
    $("#noDialogBtn").on("click", function(e)
    {
        e.stopPropagation();
        e.preventDefault();
        app.modalDialogShown = false;
        if (confirmationNoFunction != null)
        {
            confirmationNoFunction();
        }
        else
        {
            closeDialog();
        }
    });
    $("body").on("click", "#allLinesButton", function (e) {
        e.stopPropagation();
        e.preventDefault();
        app.view.handleToggleLines();
    });
}

ApprovalsView.prototype = {
    hideLoading: function()
    {
        //$.mobile.hidePageLoadingMsg();
        $.mobile.loading('hide');
    },
    showLoading: function( msg )
    {
        this._showLoadingDialog(msg);
    },
    showErrorPage: function(message, code)
    {
        //this.hideLoading();
        $.mobile.changePage("#errorPage");
        $("#errorMessage").html(message);
        if ($.isNumeric(code))
        {
            $("#errorType").html("Error Type: " + code);
        }
        else
        {
            $("#errorType").html("");
        }
    },
    showStatusErrorPage: function(message, status)
    {
        //this.hideLoading();
        console.log("Transaction ",status);
        $.mobile.changePage("#errorPage");
        $("#errorMessage").html(message);
        $("#errorType").html("Status: " + status);
    },
    showTransactionErrorPage: function(message, transaction)
    {
        //this.hideLoading();
        console.log("Transaction ",transaction);
        $.mobile.changePage("#errorPage");
        $("#errorMessage").html(message);
        $("#errorType").html("Transaction: " + transaction);
        $("#errorType").html("");
    },
    showModalDialog: function(msg, okFunction, code)
    {
        //this.hideLoading();
        console.log("Modal "+code);
        this._showNotificationDialog(msg, okFunction, code);
        console.log( "NotificationDialog should be showing" );
    },
    showModalConfirmDialog: function(title, msg, yesFunction, noFunction)
    {
        //this.hideLoading();
        this._showConfirmationDialog(title, msg, yesFunction, noFunction);
    },
    showRegistrationPage: function(appName, appVersion)
    {
        console.log("showRegistrationPage()");
		$.mobile.changePage("#registrationPage");
        $('#appName').val(appName);
        $('#appVersion').val(appVersion);
        $('#activationKey').val('');
        $('#registrationPin').val('');
        //$( window ).off();
        app.view.helper.setPortraitLayout();
        $( window ).on( "orientationchange", function( event ) {
            app.view.setRegistrationImage(event);
        });
		app.view.helper.setPortraitLayout();
    },
	setRegistrationImage: function(event)
	{
		if(event.orientation == "landscape")
		{
			app.view.helper.setLandscapeLayout();
		}
		else
		{
			app.view.helper.setPortraitLayout();
		}
	},
	showLoginPage:function()
    {
        console.log("showLoginPage()");
        //this.hideLoading();
        this.helper.setImgByScreenSize();
        //setPortrait();
        $( window ).off();
        $(window).on("resize", function()
        {
            app.view.helper.setImgByScreenSize();
        });
        $.mobile.changePage("#loginPage");
        $('#loginPin').val("");
    },
    showCategoriesPage:function(mode)
    {
        console.log("showCategoriesPage()");
        if(app.updateListInProgress && $.mobile.activePage.attr("id") == "categoriesPage")
        {
            $("#header").attr("hidden",true);
            $("#footer").attr("hidden",true);
            $("#content").attr("hidden",true);
        }
        else
        {   
            $("#header").attr("hidden",false);
            $("#footer").attr("hidden",false);
            $("#content").attr("hidden",false);
            $('input[data-type="search"]').val("");
            $('input[data-type="search"]').trigger("change");
            if (mode == 1)
            {
                $.mobile.changePage("#categoriesPage");
            }
            else if (mode == -1)
            {
                $.mobile.changePage("#categoriesPage");
            }
            else
            {
                $.mobile.changePage("#categoriesPage");
            }
            $("#categoriesPage").trigger("pagecreate");
            this.model.updateCategoryCounts();
            var wp = /Windows Phone/i.test(navigator.userAgent);
            if (wp) {
                $("#categoriesView").html(
                    $.templates.wp8CategoriesTemplate.render(this.model.categorySet)
                );
            }
            else {
                $("#categoriesView").html(
                    $.templates.categoriesTemplate.render(this.model.categorySet)
                );
            }
            $("#categoriesView").listview("refresh");
            $(".category").on("click", function (e) {
                e.preventDefault();
                var currentCategoryId = $(this).children("div").attr("id");
                app.controller.handleGoToCategoryItemsPage(1, currentCategoryId);
                return false;
            });
            //(".category").addClass("ui-disabled");
            
            //$("a").addClass("ui-disabled");
            
            
            $("#header").trigger('create');
        }
    },
    showCategoryItemsPage: function(mode)
    {   
        $("#categoryItemsView").html(
            $.templates.categoryItemsTemplate.render(this.model.categoryItems[this.model.currentCategoryId])
        );
        $("#titleCategory").html(this.model.currentCategoryId);
        
        if (mode == 1)
        {
            $('input[data-type="search"]').val("");
            $.mobile.changePage("#categoryItemsPage");
        }
        else if (mode == -1)
        {
            $.mobile.changePage("#categoryItemsPage");
        }
        else
        {
            $('input[data-type="search"]').val("");
            $.mobile.changePage("#categoryItemsPage");
        }
        $('input[data-type="search"]').trigger("change");
        $("#categoryItemsPage").trigger("pagecreate");
        $("#categoryItemsView").listview(
        {
             autodividers: true,
             autodividersSelector: function (li) {
                var out = li.attr("category");
                return out;
             }
        }).listview("refresh");
        $(".categoryItem").on("click", function(e)
        {
            e.preventDefault();
            var currentItemId = $(this).children("div").attr("id");
            app.controller.handleGoToItemPage(1, currentItemId);
            return false;
        });
        $("#header").trigger('create');
    },
    showItemPage: function(mode)
    {
        //this.model.currentItem.docURL = "https://air.advancedcomputersoftware.com/gateway";
        if (this.model.currentItem.hasOwnProperty("docURL"))
        {
            var loc;
            console.log(this.model.currentItem.docURL);
            if (this.model.currentItem.docURL.indexOf(":") != -1)
            {
                loc = this.model.currentItem.docURL;
            }
            else
            {
                loc = "https://air.advancedcomputersoftware.com/resources/" + this.model.currentItem.docURL;
            }
            $("#otherButtons").html($.templates.auxButtonTemplate.render({name: "docButton", location: loc, msg:"View Document"}));
        }
        else
        {
            $("#otherButtons").empty();
        }
        if (this.model.currentItem.hasOwnProperty("details"))
        {
            $("#itemDetailsView").html($.templates.detailsTemplate.render(this.model.currentItem.details));
        }
        // Create lines
        if (this.model.currentItem.hasOwnProperty("lines"))
        {
            var lines;
            lines = this.model.currentItem.lines;
            $("#linesView").html(
             $.templates.linesTemplate4.render(lines)
            );
            //$("#lineButtonArea").trigger('create');
            $("#lineButtonArea").trigger('refresh');
        }
        // Create the header
        if (this.model.currentCategoryId === "All")
        {
            $("#itemCategory").text("All");
        }
        else
        {
            $("#itemCategory").text(this.model.currentCategoryId);
        }
        $("#itemHeader").html(
            $.templates.itemHeaderTemplate.render(this.model.currentItem)
        );
        this.handleLineToggleNeeded();
        if (mode == -1)
        {
            $.mobile.changePage("#itemPage");
        }
        else
        {
            $.mobile.changePage("#itemPage");
        }
        $("#linesView").trigger("create");
        $("#itemHeader").trigger("create");
        $("#itemPage").trigger("pagecreate");
        $("#itemDetailsView").listview("refresh");
        $("#otherButtons").listview("refresh");
        $("#approvePageBtn").one("click", function(e)
        {
            if (app.clickTime != null && (e.timeStamp - app.clickTime < 500))
            {
                return false;
            }
            else
            {
                app.clickTime = e.timeStamp;
                e.stopPropagation();
                e.preventDefault();
                app.controller.handleApproveItem();
            }
        });
        $("#rejectPageBtn").unbind("click");
        $("#rejectPageBtn").bind("click", function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            $("#rejectPageBtn").unbind("click");
            app.controller.handleRejectItem();
        });
        /*if (!/Windows Phone/i.test(navigator.userAgent)) {
            $(".detailsButton").on("click", function (e) {
                e.preventDefault();
                //$(this).children("details").trigger("click");
                //alert($(this).children("span").children("span").children("details").attr("open") );
                //console.log("this",this);
                if ($(this).children("span").children("span").children("details").attr("open") != undefined) {
                    $(this).children("span").children("span").children("details").attr("open", false);
                }
                else {
                    $(this).children("span").children("span").children("details").attr("open", true);
                }
                return false;
            });
        }*/
        /*$(".detailsButton").on("click", function(e)
        {*/
            //$(".detailsButton").attr("data-theme", "e");
            //$(".collapsible").css("background", "red");
            //$(".collapsible").button("refresh");
        //});
    },
    showSettingsPage: function()
    {
        //this.hideLoading();
        $.mobile.changePage("#settingsPage");
        var uuid = app.device.deviceUUID;
        $("#internalAppname").html(app.appName);
        $("#version").html(app.clientVersion);
        $("#uuid").html("..." + uuid.substr(uuid.length - 5, 5));
        $("#deviceModel").html(app.device.deviceModel);
        $("#devicePlatform").html(app.device.devicePlatform);
        $("#deviceVersion").html(app.device.deviceVersion);
        //$("#traceRoute").html(app.tracker);
    },
    showPendingPage: function(mode)
    {
        //this.hideLoading();
        console.log("Pending Items "+app.model.pendingItems.length);
        $('input[data-type="search"]').val("");
        $('input[data-type="search"]').trigger("change");
            //console.log("ArrayObject",this.model.pendingItems[0].id);
        $("#pendingView").html(
            $.templates.pendingTemplate.render(this.objectToArray(this.model.pendingItems))
        );
        //}
        if (mode == -1)
        {
            $.mobile.changePage("#pendingPage");
        }
        else
        {
            $.mobile.changePage("#pendingPage");
        }
        $("#pendingPage").trigger("pagecreate");
        $("#pendingView").listview("refresh");
        $(".pendingItem").on("click", function (e) {
            e.preventDefault();
            var currentPendingId = $(this).children("div").attr("id");
            app.controller.handleGoToPendingItemPage(currentPendingId);
            return false;
        });
    },
    showPendingItemPage: function()
    {
        $("#pendingItemHeader").html(
            $.templates.pendingItemTemplate.render(this.model.pendingItem)
        );
        $.mobile.changePage("#pendingItemPage");
        $("#pendingItemHeader").trigger("create");
        $("#pendingItemPage").trigger("create");
    },
    showExtendedDescriptionPage: function(header, description)
    {
        $("#extendedDescriptionTitle").html(header);
        $("#extendedDescriptionHeader").html("<h2>"+header+"</h2>");
        $("#extendedDescription").html(description);
        $.mobile.changePage("#extendedDescriptionPage");
        $("#extendedDescriptionPage").trigger("create");
    },
    showRejectCommentDialog: function()
    {
        textArea.value = "";
        $.mobile.changePage("#commentDialog", {transition:"none"});
        $("#rejectDialogBtn").one("click", function(e)
        {
            if (app.clickTime != null && (e.timeStamp - app.clickTime < 500))
            {
                return false;
            }
            else
            {
                app.clickTime = e.timeStamp;
                e.stopPropagation();
                e.preventDefault();
                app.controller.handleRejectItemWithComment(textArea.value);
            }
        });
        $("#commentDialog").trigger("pagecreate");
    },
    _showNotificationDialog: function(msg, closeFunction, code)
    {
        console.log("Notification "+code);
        app.modalDialogShown = true;
        // Set up the close function
        console.log("notificationCloseFunction",closeFunction);
        notificationCloseFunction = closeFunction;
        textArea.value = "";
        $.mobile.changePage("#notificationDialog",{transition:"none"});
        if(!!$.isNumeric(code))
        {
          $('#noteCode').html("Error Type: " + code);
        }
        else
        {
            $("#noteCode").html("");
        }
        $('#note').html(msg);
        $("#notificationDialog").trigger("pagecreate");
    },
    _showLoadingDialog: function(msg)
    {
        document.activeElement.blur();
        $('#loadingMsg').html(msg);
        if (msg != null)
        {
            $.mobile.loadingMessage = msg;
            $.mobile.loadingMessageTextVisible = true;
        }
        //$.mobile.showPageLoadingMsg();
        //$.mobile.loading('show', {theme:"e", text:"Please wait...", textonly:false, textVisible: true});
        $.mobile.loading("show", {
            text: msg,
            textVisible: true,
            theme: $.mobile.loader.prototype.options.theme,
            textonly: false,
            html: ""
        });
    },
    _showConfirmationDialog: function(title, msg, yesFunction, noFunction)
    {
        app.modalDialogShown = true;
        // Set up the close functions
        confirmationYesFunction = yesFunction;
        confirmationNoFunction = noFunction;
        $.mobile.changePage("#confirmationDialog",{transition:"none"});
        $("#title").html(title);
        $("#confirm").html(msg);
        $("#confirmationDialog").trigger("pagecreate");
    },
    showLoadingPage: function()
    {
        $.mobile.changePage("#loadingPage");
        $("#loadingPage").trigger("pagecreate");
    },
    isSettingsPageDisplayed:function()
    {
        return !app.modalDialogShown && $("#settingsPage").is(".ui-page-active");
    },
    isCategoriesPageDisplayed:function()
    {
        return !app.modalDialogShown && $("#categoriesPage").is(".ui-page-active");
    },
    isCategoryItemsPageDisplayed:function()
    {
        return !app.modalDialogShown && $("#categoryItemsPage").is(".ui-page-active");
    },
    isPendingPageDisplayed:function()
    {
        return $("#pendingPage").is(".ui-page-active");
    },
    isPendingItemPageDisplayed:function()
    {
        return $("#pendingItemPage").is(".ui-page-active");
    },
    isItemPageDisplayed:function()
    {
        return $("#itemPage").is(".ui-page-active");
    },
    isInPendingSection:function()
    {
       return (this.isPendingPageDisplayed() || this.isPendingItemPageDisplayed());
    },
    isRegisterPageDisplayed:function()
    {
        return $("#registerPage").is(".ui-page-active");
    },
    isLoginPageDisplayed:function()
    {
        return $("#loginPage").is(".ui-page-active");
    },
    isDialog:function()
    {
        return $.mobile.activePage.attr("id") == "commentDialog" || $.mobile.activePage.attr("id") == "notificationDialog" || $.mobile.activePage.attr("id") == "#confirmationDialog" || $.mobile.activePage.attr("id") == "loadingDialog";
    },
    handleGoToLoginHelp: function()
    {
		var help;
		if (/Windows/i.test(navigator.userAgent)) {
			
              help = window.open("http://air.advancedcomputersoftware.com/approvalsHelp","_blank", "location=yes");
		}
		else
		{
              help = cordova.InAppBrowser.open("http://air.advancedcomputersoftware.com/approvalsHelp","_blank", "location=yes,clearcache=yes");
		}
        help.addEventListener('loaderror',function(event) {
            alert(event.code+" "+" "+event.message);
            help.close();
        });
    },
    handleGoToRegisterHelp: function()
    {
		var help;
		if (/Windows/i.test(navigator.userAgent)) {
            help = window.open("http://air.advancedcomputersoftware.com/approvalsHelp","_blank", "location=yes");
		}
		else
		{
            help = cordova.InAppBrowser.open("http://air.advancedcomputersoftware.com/approvalsHelp","_blank", "location=yes,clearcache=yes");
		}
        help.addEventListener('loaderror',function(event) {
            alert(event.code+" "+" "+event.message);
            help.close();
        });
    },
    objectToArray: function(object)
    {
        console.log("Object", object);
        var values = [];
        var buffer = "["
        /*var buffer=[
        {"id":"FPMID999","header1":"Debtor - SPC001","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen", "options":[{"action":"Approve", "reply":"approved", "role":"pos", "commentRequired":false},{"action":"Reject", "reply":"rejected", "role":"neg", "commentRequired":true}], "documents":[{"docId": "FPMID1279", "msg":"Invoice"},{"docId": "FPM1279", "msg":"Receipt"}], "category":"Debtor Invoices","details":[{"key":"Invoice prefix","value":"S - 12"},{"key":"Customer","value":"SPC002 - STEVENS LTD"},{"key":"Sub ledger","value":"S01"},{"key":"Transaction type","value":"I - Invoice"},{"key":"Period","value":"5"},{"key":"Year","value":"2012"},{"key":"Reference","value":"PO78788"},{"key":"Print status","value":"N - No Print"},{"key":"Header text","value":"Hire 31/10/12"},{"key":"Footer text","value":"Terms strictly 10 days from invoice date"},{"key":"Additional text","value":""}],"lines":[{"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[{"key":"Quantity","value":"1"},{"key":"Unit of measure","value":"EA - EACH"},{"key":"Price","value":"1000.00"},{"key":"Per","value":"1"},{"key":"Net value","value":"1000.00"},{"key":"VAT code","value":"SR - 20"},{"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},{"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},{"key":"Activity","value":""},{"key":"Job","value":""},{"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}]}]},
        {"id":"FPMID991","header1":"Debtor - SPC002","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen", "options":[{"action":"Approve", "reply":"approved", "role":"pos", "commentRequired":false},{"action":"Reject", "reply":"rejected", "role":"neg", "commentRequired":true}], "category":"Debtor Invoices","details":[{"key":"Invoice prefix","value":"S - 12"},{"key":"Customer","value":"SPC002 - STEVENS LTD"},{"key":"Sub ledger","value":"S01"},{"key":"Transaction type","value":"I - Invoice"},{"key":"Period","value":"5"},{"key":"Year","value":"2012"},{"key":"Reference","value":"PO78788"},{"key":"Print status","value":"N - No Print"},{"key":"Header text","value":"Hire 31/10/12"},{"key":"Footer text","value":"Terms strictly 10 days from invoice date"},{"key":"Additional text","value":""}],"lines":[{"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[{"key":"Quantity","value":"1"},{"key":"Unit of measure","value":"EA - EACH"},{"key":"Price","value":"1000.00"},{"key":"Per","value":"1"},{"key":"Net value","value":"1000.00"},{"key":"VAT code","value":"SR - 20"},{"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},{"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},{"key":"Activity","value":""},{"key":"Job","value":""},{"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}]}]},
        {"id":"FPMID992","header1":"Debtor - SPC003","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen", "options":[{"action":"Approve", "reply":"approved", "role":"pos", "commentRequired":false},{"action":"Reject", "reply":"rejected", "role":"neg", "commentRequired":true}], "category":"Debtor Invoices","details":[{"key":"Invoice prefix","value":"S - 12"},{"key":"Customer","value":"SPC002 - STEVENS LTD"},{"key":"Sub ledger","value":"S01"},{"key":"Transaction type","value":"I - Invoice"},{"key":"Period","value":"5"},{"key":"Year","value":"2012"},{"key":"Reference","value":"PO78788"},{"key":"Print status","value":"N - No Print"},{"key":"Header text","value":"Hire 31/10/12"},{"key":"Footer text","value":"Terms strictly 10 days from invoice date"},{"key":"Additional text","value":""}],"lines":[{"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[{"key":"Quantity","value":"1"},{"key":"Unit of measure","value":"EA - EACH"},{"key":"Price","value":"1000.00"},{"key":"Per","value":"1"},{"key":"Net value","value":"1000.00"},{"key":"VAT code","value":"SR - 20"},{"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},{"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},{"key":"Activity","value":""},{"key":"Job","value":""},{"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}]}]},
        {"id":"FPMID993","header1":"Debtor - SPC004","header2":"Reference - PO78788","header3":"","header4":"Ann Bowen", "options":[{"action":"Approve", "reply":"approved", "role":"pos", "commentRequired":false},{"action":"Reject", "reply":"rejected", "role":"neg", "commentRequired":true}], "category":"Debtor Invoices","details":[{"key":"Invoice prefix","value":"S - 12"},{"key":"Customer","value":"SPC002 - STEVENS LTD"},{"key":"Sub ledger","value":"S01"},{"key":"Transaction type","value":"I - Invoice"},{"key":"Period","value":"5"},{"key":"Year","value":"2012"},{"key":"Reference","value":"PO78788"},{"key":"Print status","value":"N - No Print"},{"key":"Header text","value":"Hire 31/10/12"},{"key":"Footer text","value":"Terms strictly 10 days from invoice date"},{"key":"Additional text","value":""}],"lines":[{"header1":"Product code","header2":"MUS001 - MUSEUM HIRE - PUMP HOUSE","details":[{"key":"Quantity","value":"1"},{"key":"Unit of measure","value":"EA - EACH"},{"key":"Price","value":"1000.00"},{"key":"Per","value":"1"},{"key":"Net value","value":"1000.00"},{"key":"VAT code","value":"SR - 20"},{"key":"Cost centre","value":"CC03 - ACCOUNTS RECEIVABLE"},{"key":"Account","value":"40017 - FACILITY CHARGES INCOME"},{"key":"Activity","value":""},{"key":"Job","value":""},{"key":"Line text","value":"PRIVATE HIRE OF LECTURE HALL AND PRIVATE TOUR."}]}]}
        ];*/
       // var buffer = [];
        var keys = Object.keys(object);
        for(var i = 0; i<keys.length; i++)
        {
            if (object.hasOwnProperty(keys[i]))
            {
                buffer += JSON.stringify(object[keys[i]]);
            }
            if(i< keys.length)
            {
              buffer += ",";
            }
        }
        buffer += "]";
        console.log(buffer)
        return eval(buffer);
    },
    handleToggleLines: function()
    {
        if ($(".ui-collapsible-heading").hasClass('ui-collapsible-heading-collapsed')) {
             $(".ui-collapsible-heading").removeClass("ui-collapsible-heading-collapsed");
             $(".ui-collapsible-content").removeClass("ui-collapsible-content-collapsed");
            $("#allLinesButton").data("data-icon", "carat-d");
            $("#allLinesButton").addClass("ui-icon-carat-d").removeClass("ui-icon-carat-r");
            $(".ui-collapsible-heading a").data("data-icon", "carat-d");
            $(".ui-collapsible-heading a").addClass("ui-icon-carat-d").removeClass("ui-icon-carat-r");
        }
        else {
            $(".ui-collapsible-heading").addClass("ui-collapsible-heading-collapsed");
            $(".ui-collapsible-content").addClass("ui-collapsible-content-collapsed");
            $("#allLinesButton").attr("data-icon", "carat-r");
            $("#allLinesButton").addClass("ui-icon-carat-r").removeClass("ui-icon-carat-d");
            $(".ui-collapsible-heading").data("data-icon", "carat-r");
            $(".ui-collapsible-heading a").addClass("ui-icon-carat-r").removeClass("ui-icon-carat-d");
        }
        $(".ui-collapsible-heading").trigger('create');
        $(".ui-collapsible-heading").trigger('refresh');
        $("#allLinesButton").trigger('create');
        $("#allLinesButton").trigger('refresh');
        $("#lineButtonArea").trigger('create');
        $("#lineButtonArea").trigger('refresh');

    },
    handleLineToggleNeeded: function()
    {
       var children = $( "#linesView" ).children().length;
       if(children >1)
       {
           $("#lineButtonArea").html('<a data-id="allLinesButton" id="allLinesButton" data-role="button" return false" data-icon="carat-r">All Lines</a>');
           $("#lineButtonArea").trigger('create');
           $("#lineButtonArea").trigger('refresh');
		   //$($.mobile.activePage).trigger("pagecreate");
       }
    }
}
