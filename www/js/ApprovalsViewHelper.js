var ApprovalsViewHelper = function() {
}

ApprovalsViewHelper.prototype = {
    setImgSize: function(){
       var w = $(window).width();
       if (w >= 2048)
       {
           this.setIPad4Landscape();
       }
       /*else if (w >= 1920)
       {
            this.setMiniTabletLandscape();
       }*/
       else if (w >= 1536)
       {
           this.setIPad4Portrait();
       }
       /*else if (w >= 1152)
       {
           this.setMiniTabletPortrait();
       }*/
       else if (w >= 1136)
       {
           this.setIPhone5Landscape();
       }
       else if (w >= 1024)
       {
           this.setIPad2Landscape();
       }
       else if (w >= 768)
       {
           this.setIPad2Portrait();
       }
       else if (w >= 640)
       {
           this.setIPhone5Portrait();
       }
       else if (w >= 480)
       {
           this.setIPhone4Landscape();
       }
       else
       {
           this.setIPhone4Portrait();
        }
    },
    setImgByScreenSize: function(){
        $(".splash").show();
        console.log(screen.width);
        console.log(screen.height);
        console.log(window.devicePixelRatio);
        if (window.matchMedia("(orientation : portrait)").matches)
        {
			if(window.matchMedia("(min-aspect-ratio:7/10)").matches)
			{
				if (window.matchMedia("(min-height:204px) and (min-device-pixel-ratio: 2)").matches) {
					console.log("IPad4Portrait");
					this.setIPad4Portrait();
				}
				else if (window.matchMedia("(min-height:204px)").matches) {
					console.log("IPad2Portrait");
					this.setIPad2Portrait();
				}
				else {
					this.setBlank();
				}
			}
			else
			{
			    if (window.matchMedia("(min-height:481px) and (max-device-pixel-ratio: 2.0)").matches)
			    {
			        console.log("IPhone5Portrait");
			        this.setIPhone5Portrait();
			    }
				else if (window.matchMedia("(min-height:667px)").matches) {
					console.log("I6+Portrait");
					this.setIPhone6PlusPortrait();
				}
				else if(window.matchMedia("(min-height:241px)").matches)
				{
					console.log("IPhone4Portrait");
					this.setIPhone4Portrait();
				}
				else {
					this.setBlank();
				}
			}
		}
		else
		{
			if(window.matchMedia("(max-aspect-ratio:10/7)").matches)
			{
				if (window.matchMedia("(min-width:204px) and (-webkit-min-device-pixel-ratio: 2)").matches) {
					console.log("IPad4Landscape");
					this.setIPad4Landscape();
				}
				else if(window.matchMedia("(min-width:204px)").matches)
				{
					console.log("IPad2Landscape");
					this.setIPad2Landscape();
				}
				else {
					this.setBlank();
				}
			}
			else
			{
			    if (window.matchMedia("(min-width:481px) and (max-device-pixel-ratio: 2.0)").matches)
			    {
			        console.log("IPhone5Landscape");
					this.setBlank();
			    }
				else if (window.matchMedia("(min-width:668px)").matches) {
					
					console.log("I6+Landscape");
					this.setIPhone6PlusLandscape();
				}
				else if(window.matchMedia("(min-width:241px)").matches)
				{
					console.log("IPhone4Landscape");
					this.setIPhone4Landscape();
				}
				else {
					this.setBlank();
				}
			}
        }
        
    },
    setRegImgLandscapeByScreenSize: function(){
	    $(".splash").show();
        if (window.matchMedia("(min-height:641px) and (-webkit-min-device-pixel-ratio: 2)").matches) {
            console.log("IPad4Landscape");
            this.setIPad4Landscape();
        }
        else if(window.matchMedia("(min-height:641px)").matches)
        {
            console.log("IPad2Landscape");
            this.setIPad2Landscape();
        }
        else if (window.matchMedia("(min-width:569px)").matches) {
			console.log("IPhone4Landscape");
			this.setIPhone4Landscape();
        }
        else {
            this.setBlank();
        }
	},
	setRegImgPortraitByScreenSize: function(){
        $(".splash").show();
		if(window.matchMedia("(min-aspect-ratio:3/4)").matches)
		{
			if (window.matchMedia("(min-height:204px) and (min-device-pixel-ratio: 2)").matches) {
				console.log("IPad4Portrait");
				this.setIPad4Portrait();
			}
			else if (window.matchMedia("(min-height:204px)").matches) {
				console.log("IPad2Portrait");
				this.setIPad2Portrait();
			}
			else {
				this.setBlank();
			}
		}
		else
		{
		    if (window.matchMedia("(min-height:569px)").matches) {
		        console.log("I6+Portrait");
		        this.setIPhone6PlusPortrait();
		    }
			else if (window.matchMedia("(min-height:481px) and (max-device-pixel-ratio: 2.0)").matches)
			{
				console.log("IPhone5Portrait");
				this.setIPhone5Portrait();
			}
		    else if (window.matchMedia("(min-height:288px)").matches)
			{
				console.log("IPhone4Portrait");
				this.setIPhone4Portrait();
			}
			else {
				this.setBlank();
			}
		}
	},
    setLandscapeLayout:function() {
		this.setOneColumn();
		this.setRegImgLandscapeByScreenSize();
	},
	setPortraitLayout:function() {
		this.setOneColumn();
	    this.setRegImgPortraitByScreenSize();
	},
	isLandscape: function() {
		return (window.matchMedia("(orientation : landscape)").matches);
	},
	isPortrait: function() {
		return (window.matchMedia("(orientation : portrait)").matches);
	},
	setOneColumn:function() {
		$(".my-breakpoint .ui-block-a").css({"width": "99%"});
		$(".my-breakpoint .ui-block-b").css({"width": "99%"});
	},
	setTwoColumns:function() {
		$(".my-breakpoint.ui-grid-a .ui-block-a").css({"margin-right":"1%"});
		$(".my-breakpoint.ui-grid-a .ui-block-b").css({"margin-left":"1%"});
		$(".my-breakpoint.ui-grid-a .ui-block-a").css({"width":"49%"});
		$(".my-breakpoint.ui-grid-a .ui-block-b").css({"width":"49%"});
	},
	setBlank: function()
	{
		$(".splash").attr("src", "");
		$(".splash").hide();
	},
	setTest: function()
	{
		$(".splash").attr("src", "images/ABS_301_Prod_Air Receipting_login page1440x1536_test4-01.png");
	},
    setWidth: function(width)
	{
		$(".splash").width(width);
	},
    setHeight: function(height)
	{
		$(".splash").height(height);
	},
    setIPhone6PlusLandscape: function()
    {
		//$(".splash").attr("src", "images/Air Receipting_login page1920x648.png");
		$(".splash").attr("src", "images/splashscreen_air approvals_2560x864.png");
	},
    setIPhone6PlusPortrait: function()
    {
		$(".splash").attr("src", "images/splashscreen_air approvals_1080x1152.png");
	},
    setSamsungS6Landscape: function()
    {
		$(".splash").attr("src", "images/splashscreen_air approvals_2560x864.png");
	},
    setSamsungS6Portrait: function()
    {
		$(".splash").attr("src", "images/splashscreen_air approvals_1440x1536.png");
	},
    setIPhone4Portrait:function()
    {
		$(".splash").attr("src", "images/splashscreen_air approvals_480_326.png");
	},
    setIPhone4Landscape: function()
    {
		$(".splash").attr("src", "images/splashscreen_air approvals_960x288.png");
	},
    setIPad4Portrait: function()
    {
		$(".splash").attr("src", "images/splashscreen_air approvals_1536x1229.png");
	},
    setIPad4Landscape: function()
	{
		$(".splash").attr("src", "images/splashscreen_air approvals_2048x922.png");
	},
    setIPad2Portrait: function()
	{
		$(".splash").attr("src", "images/splashscreen_air approvals_768x614.png");
	},
    setIPad2Landscape: function()
	{
		$(".splash").attr("src", "images/splashscreen_air approvals_1024x461.png");
	},
    setIPhone5Portrait: function()
	{
		$(".splash").attr("src", "images/splashscreen_air approvals_640_386.png");
	},
    setIPhone5Landscape: function()
	{
		$(".splash").attr("src", "images/splashscreen_air approvals_1136x384.png");
	}
}




