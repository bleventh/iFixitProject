

window.addEvent('domready', function(){

  //call back function
  this.jsoncallback = function(data){
        console.log(data);
      };

  /*Trying the json loads here*/
  var theURL;

  
  //makes a JSONP request to the apis
  var myJSONP = new Request.JSONP({
    url: 'http://www.ifixit.com/api/1.0/topics',
    callbackKey: 'jsoncallback',
    log: true,
    data: {
        limit: '20',
        jsonp: 'jsoncallback'
    },
    onRequest: function(url){
        // a script tag is created with a src attribute equal to url
        theURL = url;
        console.log(theURL);

    },
    onComplete: function(data){
        // the request was completed.
        console.log(data);
    }

}).send();

  

  //Dynamically create elements for prototyping
  for(var i = 0; i < 10; i++)
  {
      var anItem = new Element('div');
      $(anItem).set('class', 'item');
       //anItem = $(anItem).clone().cloneEvents(methods);
      $(anItem).inject("items",'bottom');

  };

  /*add the cart and drag methods to all .item class*/
  $$('.item').addEvent('mousedown', function(event){
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

  

});
  
