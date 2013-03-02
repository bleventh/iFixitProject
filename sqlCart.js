//Creating the sqllite html5 database

var sqlDB = new MooSQL({
        //Database name
        dbName:'gearBag',
        //Database version (max 4 numbers seperated by dots)
        dbVersion:'3.0',
        //Database description (officially database display name)
        dbDesc:'This is a Gear Bag!',
        //Estimated size
        dbSize:30
});


//Add events
sqlDB.addEvent('databaseCreated',function(){
    
    console.log('database is created!!');
});
sqlDB.addEvent('databaseReady', function(){
  console.log("ready");
})

function addDeviceToDataBase(deviceImage, deviceText)
{
  console.log(deviceText);
  var imageData = {'deviceImage': deviceImage, 'deviceText': deviceText};
  sqlDB.insert('gearBag', imageData, callback);

};

function callback(transaction, output)
{
};

