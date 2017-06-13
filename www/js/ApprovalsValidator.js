var ApprovalsValidator = function()
{
    this.maxPinLength = 8;
    this.minPinLength = 4;
    this.numberPattern = [0-9];
}

ApprovalsValidator.prototype = {
    validateLogin: function()
    {
        var pin = $('#loginPin').val();
        // Check for not null and in range
        if (pin == null || pin == "")
        {
            // Invalid pin
            app.view.showModalDialog( "Pin cannot be empty",
                function() { app.controller.handleGoToLoginPage(); }, 45 );
            return false;
        }
        else if (pin.length < this.minPinLength || pin.length > this.maxPinLength || !$.isNumeric(pin))
        {
            app.view.showModalDialog( "Pin must be between 4 and 8 characters, using numbers only",
                function() { app.controller.handleGoToLoginPage(); }, 45 );
            return false;
        }
        return true;
    },
    validateRegistration: function()
    {
        var activationKey = $('#activationKey').val();
        var registrationPin = $('#registrationPin').val();
        if(activationKey === "TESTSYSTEM")
        {
            if(app.mode != "TEST")
            {
                app.controller.setToTestMode();
                return false;
            }
            else
            {
                app.controller.handleAlreadyInTestMode();
                return false;
            }
        }
        else if(activationKey === "TRIAL")
        {
            app.controller.setToTrialMode();
            return true;
        }
        return true;
    }
}

