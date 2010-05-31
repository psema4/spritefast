
$(function() {

     (function() {

        var defaultColor = "#ff0000"
        ,currentSptiteView = null
        ,snapto = false
        ,followSuit = false
        ,spriteClasses = {}
        ,editmode = true
		,guides = false;

		var SELECTORS = {
			// TODO: create static selector references.
		};

        return {

            Main: function() {

                APP.exec.call(this, {

                    ns: "fm.spritefast",

                    plan: [ /* an array of names of functions that will be executed. */

                        "Init" /* sample parameters */
                        ,"CreateTabs"
                        ,"CreateToolbar"
                        ,"CreateWorkArea"
                        ,"AfterLoad"
                    ]
                });
            },

            Init: function() {

                $(window).resize(function() {
                    if(editmode) {
                        setTimeout(function() {
                            var spritesource = $(".spritesource");
                            $(".workarea").css({
                                "top": spritesource.get(0).offsetTop,
                                "left": spritesource.get(0).offsetLeft,
                                "width": spritesource.width(),
                                "height": spritesource.height()
                            });
                        }, 100);
                    }
                });

				$("#tabs-2 .ui-tabs-panel").sortable()
            },

            CreateTabs: function() {
                var tabs = $("#tabs");
                tabs.tabs({
                    select: function(event, ui) {
                        
                        if(ui.index == 0) { // image tab.
                            editmode = true;
                            $(window).resize();
                        }
                        else if(ui.index == 1) { // preview tab.
                            
                            editmode = false;
                            
                            var rules = [];
                            var samples = [];

                            $.each(spriteClasses, function(i, o) {
                                rules.push(o.value);
                                samples.push(["div", { "class": "ui-corner-all" },
									["div", { "class": "spritepreview " + o.rule }],
									["div", { "class": "rule" }, o.value]
								]);
                            });
                            
                            rules = rules.join(" ");                            
                            
                            $("#tabs-2").html(JUP.html([
                                ["style", ".spritepreview { background-image: url(" + $(".spritesource").attr("src") + ") } " + rules],
                                ["div", { "class": "spritepreviewarea" }, samples]
                            ]));
                        }
                        else if(ui.index == 2) { // css tab.
                            
                            editmode = false;
                            
                            $("#cssresults").html("");
                            $.each(spriteClasses, function(i, o) {
                                $("#cssresults").append(JUP.html(["div", o]));
                            });
                        }
                    }
                })
                    .find(".ui-tabs-nav")
                    .append(JUP.html(["span", { "class": "logo"}]))
                    .disableSelection();                
            },

            CreateToolbar: function() {
                $("#imageopacity").slider({
                    value: 100,
                    slide: function(event, ui) {
                        $(".spritesource").css("opacity", (ui.value/100));
                    }
                });

                $("#maskopacity").slider({
                    value: 30,
                    slide: function(event, ui) {
                        $(".mask").css("opacity", (ui.value/100));
                    }
                });

                $("#outlinecolor").toggle(function() {
                    $("#colorPicker1").show();
                }, function() {
                    $("#colorPicker1").hide();
                    $("label[for=" + $(this).attr("id") + "]").removeClass("ui-state-active");
                });

                $("#backgroundcolor").toggle(function() {
                    $("#colorPicker2").show();
                }, function() {
                    $("#colorPicker2").hide();
                    $("label[for=" + $(this).attr("id") + "]").removeClass("ui-state-active");
                })    

                $("#colorPicker1").farbtastic(function(color) {
                    $(".spriteview, .spritesurface").css("border-color", color);
                    defaultColor = color;
                }).hide();

                $("#colorPicker2").farbtastic(function(color) {
                    $("#tabs .ui-tabs-panel").css("background-color", color);
                }).hide();

                $("#className").keyup(function() {
                    $("#"+currentSptiteView)
                        .data("className", $(this).val())
                        .attr("title", $(this).val());
                });

                $("#modes").buttonset();

                $("#snap").toggle(function() {
                    snapto = true;
                    $(".spriteview").draggable("option", "snap", ".spriteview, .spritesurface");
                }, function() {
                    snapto = false;        
                    $(".spriteview").draggable("option", "snap", false);
                    $("label[for=" + $(this).attr("id") + "]").removeClass("ui-state-active");
                });

                $("#resize").toggle(function() {
                    $(".spriteview").resizable("option", "alsoResize", ".spriteview");
                }, function() {
                    $(".spriteview").resizable("option", "alsoResize", false);
                    $("label[for=" + $(this).attr("id") + "]").removeClass("ui-state-active");
                });

                $("#drag").toggle(function() {
                    $(".spriteview").resizable("option", "alsoResize", ".spriteview");
                }, function() {
                    $(".spriteview").resizable("option", "alsoResize", false);
                    $("label[for=" + $(this).attr("id") + "]").removeClass("ui-state-active");
                });

				$("#guides").toggle(function() {
					guides = true;
					$(".mask.east, .mask.west").css({"top": "0px", "height": "", "bottom": "0px"});
				}, function() {
					$("label[for=" + $(this).attr("id") + "]").removeClass("ui-state-active");
					guides = false;
					if($(".mask.east, .mask.west").length > 0) {
						$(".mask.east, .mask.west").css({
							"top": $("#"+ currentSptiteView).position().top,
							"height": $("#"+ currentSptiteView).height()
						});						
					}
				});
            },

            CreateWorkArea: function() { 

                function updateSpriteView(north, east, south, west, id, className) {

                    var el = $(this);
                    var elpos = (this !== window) ? $(this).position() : {};
                    var surface = $(".spritesurface");

                    north = parseInt(north) || elpos.top;
                    east = parseInt(east) || (elpos.left + el.width());
                    south = parseInt(south) || (elpos.top + el.height());
                    west = parseInt(west) || elpos.left;
                    
                    height = (this !== window) ? el.height() : 50;    
                    width = (this !== window) ? el.width() : 50;
                    
                    id = id || el.attr("id");
                    className = className || el.data("className");

                    if(north < (surface.position().top - height) ||
                        east > (surface.position().left + surface.width()) + width ||
                        south > (surface.position().top + surface.height()) + height ||
                        west < surface.position().left - width) {
                        
                        el.fadeOut(function() { 
                            delete spriteClasses[id];                            
                            el.remove();
                        });                        

                        if($(".spriteview").length-1 > 0) {
                            $($(".spriteview").get($(".spriteview").length-2)).click();
                        }
                        else {
                            $(".mask").fadeOut();                            
                        }
                        return;
                    }

                    $(".spriteview").css("z-index", "41");
                    el.css("z-index", "42")
                        .attr("title", className);
                    $("#className").val(className);
                    currentSptiteView = id;

					if(north < 0) { 
						height = height + north;
						north = 0;
					}

					if(south > surface.height()) {
						height = surface.height() - north;
					}
					
					if(east > surface.width()) {
						width = surface.width() - west;						
					}
					
					if(west < 0) {
						width = west + width;
						west = 0;
					}

					if(!guides) {	
						$(".mask.east, .mask.west").css({"top": north, "height": height});
					}

                    $(".mask.north").css("height", north);
					$(".mask.east").css("left", east);						
                   	$(".mask.west").css("width", west);
                    $(".mask.south").css("top", south);

                    spriteClasses[id] = {
                        
                        value: [
                            ".", className,
                            " { background-position: ", ((west+"").indexOf("-") == -1) ? "-" + Math.floor(west) : (""+Math.floor(west)).substr(1, west.length),
                            "px ", ((north+"").indexOf("-") == -1) ? "-" + Math.floor(north) : (""+Math.floor(north)).substr(1, north.length),
                            "px; height: ", Math.floor(height),
                            "px; width: ", Math.floor(width), "px }"].join(""),
                        rule: className
                    }
                }

                $(".spriteview").live("click", updateSpriteView);

                $(".spritesurface").click(function(e) {

                    var left = e.layerX;
                    var top = e.layerY;
                    var className = "img" + $(".spriteview").length;
                    var spriteViewId = "spriteView" + Math.floor(Math.random()*9999);

					updateSpriteView(top, (left + 50), (top + 50), left, spriteViewId, className);

                    $(".mask").fadeIn();

                    var spriteview = $(JUP.html(["div", { "class": "spriteview" }]))
                        .css({"left": left, "top": top, "border-color": defaultColor, "position": "absolute" })
                        .data("className", className)
                        .attr("title", className)
                        .attr("id", spriteViewId)
                        .resizable({ 
                            resize: updateSpriteView
                        })
                        .draggable({ 
                            start: updateSpriteView,
                            drag: updateSpriteView,
                            stop: updateSpriteView,
                            snap: (snapto ? ".spriteview, .spritesurface" : false) 
                        });

                    $("#className").val(className);
                    $(this).parent().append(spriteview);
                    currentSptiteView = spriteViewId;
                }) // .selectable();
            },

            AfterLoad: function() {
                $(window).resize();                
            }
        }
    })().Main();
});