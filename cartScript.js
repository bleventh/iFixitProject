//For loading more devices from api
var scrollSize = 0;
var limitValue = 70;
var offsetCount = 0;


//Figure out how to set offset inbetween first spyact call and api call
var offsetMarker = true;


//creates database if it does not already exist
function databaseInit(){
    sqlDB.exec("CREATE TABLE IF NOT EXISTS gearBag( id INTEGER PRIMARY KEY, deviceImage TEXT, deviceText TEXT)", callback);
    sqlDB.findA('gearbag', checkLoadCart);
};

function checkLoadCart(transaction, output)
{
  
  if(output === undefined)
  {
    startUp();
  }
  else
  {
    loadCart(output);
    startUp();
  }
};

function loadCart(output){
  for(var i = 0; i < output.rows.length; i++)
  {
    var storedDevice = new Element('div');
    //setting image back and description
    $(storedDevice).set('style', output.rows.item(i).deviceImage);
    $(storedDevice).set('html',output.rows.item(i).deviceText);
    $(storedDevice).set('class', 'dataBaseItem');
    $(storedDevice).removeEvents().inject($('cart'), 'top');
  }
}

function startUp()
{
  //makes initial JSONP request to the apis
  this.myJSONP();
  
  //adds drag to first load
  this.addDrag($$('.item'));
  
  //lowers the limit on the jsonp api calls
  //makes the page faster because its loading less on each event
  limitValue = 20;

}

var spy;

//Creates a new scrolling event and fires when minimum range is met
var spyAct = function() {
      
      var min = $(window).getScrollSize().y - $(window).getSize().y -300; 
      spy = new ScrollSpy({
        min: min,
        onEnter: function(position, enters) {
          if(enters == 1)
           {
             myJSONP();
           }  
        }
      });
    };




//JSONP call to get names of all devices
var myJSONP = function(){ new Request.JSONP({
    url: 'http://www.ifixit.com/api/1.0/topics',
    callbackKey: 'jsoncallback',
    log: true,
    data: {
        offset: offsetCount,
        limit: limitValue,
        jsonp: 'jsoncallback'
    },
    onRequest: function(url)
    {

    },
    

}).send();
};

//Call back method for myJSONP
this.jsoncallback = function(data){
  for(var i = 0; i < data.length; i++){
    var apiID = data[i].topic.replace(/\s/g,"+");

    var apiGet = "http://www.ifixit.com/api/1.0/topic/" + apiID;
    var getImages = new Request.JSONP({
            url: apiGet,
            callbackKey: 'imageCallback',
            log: true,
            data: {
                jsonp: 'imageCallback'
            },
            onRequest: function(url){
                // a script tag is created with a src attribute equal to url  
            },

          }).send();
        
        };
        //incremenets offset
        if(offsetMarker)
        {
          offsetCount = 70;
          offsetMarker = false;
        }
        else
        {
          offsetCount += limitValue;
        }
        //Creates new instance of spy with a higher minimum range
        spyAct();
       
      };

  //Call back method to get images
 this.imageCallback = function(data)
  {
      if(data[0] == "error")
      {
        console.log("error");
      }
      if(data.image.text!= undefined)
      {
        //the devices image url
        var aDeviceImage = data.image.text + '.thumbnail';
     
      }
      else
      {
        //if device does not have image it gives it a standard image
        var aDeviceImage = 'noImageReplace.png';
      }
        //adding a new device to the grid
        var anItem = new Element('div');
        $(anItem).set('style', "background-image:url("+ aDeviceImage + ")");
        $(anItem).set('html', '<span>' + data.topic_info.name + '</span>');
        $(anItem).set('class', 'item');

        //give element drag capability and inject element 
        this.addDrag($(anItem));
        $(anItem).inject("items",'bottom');

      
        
  };


//add the cart and drag methods to argument
var addDrag = function(theListener) {
  theListener.addEvent('mousedown', function(event){
      event.stop();

      var device = this;

      var clone = device.clone().setStyles(device.getCoordinates()).setStyles({
      opacity: 0.7,
      position: 'absolute'
    }).inject(document.body);

      var drag = new Drag.Move(clone, {
        droppables: $('cart'),

        onDrop: function(dragging, cart){
          dragging.destroy();
          if(cart != null){
            var gearBagItems = $$(cart).getChildren()[0];
            var deviceInBag = false;
            //Checks if device is already in bag
            for(var i = 0; i < gearBagItems.length; i++)
            {
              if(device.getProperty('html') == gearBagItems[i].getProperty('html'))
              {
                deviceInBag = true;
              }
            }
            if(!deviceInBag)
              {
                //gets rid of drag events and injects
                device.clone().inject(cart, 'top');
                //This is where the sql update occurs
                addDeviceToDataBase(device.getProperty('style'), device.getProperty('html'));          
              }  
          cart.highlight('#7389AE', '#FFF');

          
          }
        },
        onEnter: function(dragging, cart){
        cart.tween('background-color', '#98B5C1');
      },
      onLeave: function(dragging, cart){
        cart.tween('background-color', '#FFF');
      },
      onCancel: function(dragging){
        dragging.destroy();
      }

      });
      drag.start(event);
  });
};

//adds full screen
function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
//checks for the enter button pressed to go into fullscreen
document.addEventListener("keydown", function(e) {
  if (e.keyCode == 13) {
    toggleFullScreen();
  }
}, false);

window.addEvent('domready', function(){
  
  databaseInit();

});