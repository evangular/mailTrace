#!/usr/bin/node

var carriers=require('./carriers');

if(process.argv.length<4){
	console.log('trackDat.js <tracking code> <carrier>');
	return;
}

var htmlparser=require("htmlparser"),
	fetchUrl=require("fetch").fetchUrl,
	_=require('lodash'),
	prettyjson=require('prettyjson');


var standard=function(data,url,next,log){
	fetchUrl(url,function(error, meta, body){
		var handler=new htmlparser.DefaultHandler(function(err,dom){
			if(err){
				log({reference: data.reference, carrier: data.carrier, error: err});
			}
			else{
				next(dom,data,log);
			}
		});
		var parser=new htmlparser.Parser(handler);
		parser.parseComplete(body);
	});
};

var carrierMap={
	DHL_PL: 'DHL Poland',
	YODEL: 'Yodel',
	DPD: 'DPD',
	RM: 'Royal Mail'
};

var final=function(data){
	console.log(prettyjson.render(data));
};


var ref=process.argv[2],agent=process.argv[3];
var blank={
	carrier: carrierMap[agent],
	reference: ref,
	id: null,
	to: null,
	from: null,
	log: []
};


switch(agent){
	case 'DHL_PL': standard(blank,'https://ecom.dhl.com.pl/app/tnt/szukaj.aspx?m=0&sn='+ref,carriers.dhlComPl,final); break;
	case 'YODEL': standard(blank,'http://yodel.co.uk/tracking/'+ref,carriers.yodel,final); break;
	case 'DPD': standard(blank,'http://shipment.co/tracking/1450/'+ref,carriers.dpd,final); break;
	case 'RM': standard(blank,'https://www.royalmail.com/track-your-item?trackNumber='+ref,carriers.royalMail,final); break;
	default: console.log('unrecognised carrier',agent); break;
}
