
//For loading more devices from api
var offsetCount = 0;

window.addEvent('domready', function(){


  //call back function
 



  

  
  //makes initial JSONP request to the apis
  this.myJSONP();
  

  //Dynamically create elements for prototyping
  for(var i = 0; i < 10; i++)
  {
      var anItem = new Element('div');
      $(anItem).set('class', 'item');
       //anItem = $(anItem).clone().cloneEvents(methods);
      $(anItem).inject("items",'bottom');

  };

 
  this.addDrag($$('.item'));

});


var myJSONP = function(){ new Request.JSONP({
    url: 'http://www.ifixit.com/api/1.0/topics',
    callbackKey: 'jsoncallback',
    log: true,
    data: {
        offset: offsetCount,
        limit: '200',
        jsonp: 'jsoncallback'
    },
    onRequest: function(url){
        // a script tag is created with a src attribute equal to url

    },
    onComplete: function(data){
        // the request was completed.

    }

}).send();
};

this.jsoncallback = function(data){
  for(var i = 0; i < data.length; i++){
    var apiID = data[i].topic.replace(/\s/g,"+");

    var apiGet = "http://www.ifixit.com/api/1.0/topic/" + apiID;
    var myJSONP = new Request.JSONP({
            url: apiGet,
            callbackKey: 'imageCallback',
            log: true,
            data: {
                jsonp: 'imageCallback'
            },
            onRequest: function(url){
                // a script tag is created with a src attribute equal to url
                

            },
            onComplete: function(data){
                // the request was completed.
            },
            onCancel: function()
            {
              console.log("error");
            },
            onTimeout: function()
            {
              console.log("error");
            }

          }).send();
          //Increments offset
          offsetCount += 200;
        };
      };

 this.imageCallback = function(data)
  {
      if(data[0] == "error")
      {
        console.log("error");
      }
      if(data.image.text!= null)
      {
        //the devices image url
        var aDeviceImage = data.image.text + '.thumbnail';



        //adding a new device to the grid
        var anItem = new Element('div');
        $(anItem).set('style', "background-image:url("+ aDeviceImage + ")");
        $(anItem).set('class', 'item');


        //Come back to this, adds Device name to image

        //var deviceSpan = new Element('span');
        //$(deviceSpan).set('text', data.description);
        //$(deviceSpan).inject('anItem');
        //console.log(deviceSpan);

        //inject element
        this.addDrag($(anItem));
        $(anItem).inject("items",'bottom');

      }
        
  }


/*add the cart and drag methods to argument*/
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
            device.clone().inject(cart);
          cart.highlight('#7389AE', '#FFF');

          /*This is where the sql update occurs*/
          //Check to see if the cart has an item with same img
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
}
