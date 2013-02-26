//Creating the sqllite html5 database

var sqlDB = new MooSQL({
        //Database name
        dbName:'gearBag',
        //Database version (max 4 numbers seperated by dots)
        dbVersion:'1.0',
        //Database description (officially database display name)
        dbDesc:'This is a Gear Bag!',
        //Estimated size
        dbSize:30
});


//Add events
sqlDB.addEvent('databaseCreated',function(){
    sqlDB.exec("CREATE TABLE gearBag( id INTEGER PRIMARY KEY, deviceImage TEXT)", callback);
    console.log('database is Created!!!');
});
sqlDB.addEvent('databaseReady', function(){

})

function addDeviceToDataBase(deviceImage)
{
  var imageData = {'deviceImage': deviceImage};
  sqlDB.insert('gearBag', imageData, callback);

};

function callback(transaction, output)
{
    console.log(output);
};

