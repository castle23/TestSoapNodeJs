var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000; 
var parser = require('xml2json');
var soap = require('soap');
app.listen(port);

console.log('Test Soap y NodeJs server started on: ' + port);

var xml = "<Fare_MasterPricerCalendar><numberOfUnit><unitNumberDetail><numberOfUnits>2</numberOfUnits><typeOfUnit>PX</typeOfUnit></unitNumberDetail></numberOfUnit><paxReference><ptc>ADT</ptc><traveller><ref>1</ref></traveller></paxReference><paxReference><ptc>CHD</ptc><traveller><ref>2</ref></traveller></paxReference><paxReference><ptc>INF</ptc><traveller><ref>1</ref><infantIndicator>1</infantIndicator></traveller></paxReference><fareOptions><pricingTickInfo><pricingTicketing><priceType>ET</priceType><priceType>RP</priceType><priceType>RU</priceType><priceType>TAC</priceType></pricingTicketing></pricingTickInfo></fareOptions><travelFlightInfo/><itinerary><requestedSegmentRef><segRef>1</segRef></requestedSegmentRef><departureLocalization><departurePoint><locationId>CCS</locationId></departurePoint></departureLocalization><arrivalLocalization><arrivalPointDetails><locationId>BOG</locationId></arrivalPointDetails></arrivalLocalization><timeDetails><firstDateTimeDetail><date>310518</date></firstDateTimeDetail><rangeOfDate><rangeQualifier>C</rangeQualifier><dayInterval>3</dayInterval></rangeOfDate></timeDetails></itinerary><itinerary><requestedSegmentRef><segRef>2</segRef></requestedSegmentRef><departureLocalization><departurePoint><locationId>BOG</locationId></departurePoint></departureLocalization><arrivalLocalization><arrivalPointDetails><locationId>CCS</locationId></arrivalPointDetails></arrivalLocalization><timeDetails><firstDateTimeDetail><date>180618</date></firstDateTimeDetail><rangeOfDate><rangeQualifier>C</rangeQualifier><dayInterval>3</dayInterval></rangeOfDate></timeDetails></itinerary></Fare_MasterPricerCalendar>";

// xml to json
var json = parser.toJson(xml);
console.log("to json 1 -> %s", json);
console.log("\n\n to XML 1 -> %s", parser.toXml(json));

// Cliente SOAP print JSON 
  var url = 'http://www.holidaywebservice.com//HolidayService_v2/HolidayService2.asmx?wsdl';
  soap.createClient(url, function(err, client) {
    
    //en caso de que necesite seguridad basic
    //client.setSecurity(new soap.BasicAuthSecurity('username', 'password'));
    
    //o por token
    //client.setSecurity(new soap.BearerSecurity('token'));

    //En caso de Que se necesite otro Header
    //client.addHttpHeader('User-Agent', `CustomUserAgent`);

      client.GetCountriesAvailable(function(err, result) {
          console.log("\n\n to json 2 -> %s", JSON.stringify(result));

          client.GetHolidaysAvailable({countryCode: result.GetCountriesAvailableResult.CountryCode[0].Code},function(err, result) {
              console.log("\n\n to json 3 -> %s", JSON.stringify(result));
          });

          console.log("\n\n to XML 2 -> %s", parser.toXml(result));
      });
  });