var select=require('soupselect').select;
module.exports = {
	dhlComPl: function(dom,data,next){
		var details=select(dom,'#shipments-hdr-table tr td');
		data.id=parseInt(details[0].children[1].children[0].raw.replace(/\r?\n|\r/g, " ").trim(),10);
		data.from=details[1].children[0].raw.replace(/\r?\n|\r/g, " ").trim();
		data.to=details[2].children[0].raw.replace(/\r?\n|\r/g, " ").trim();
		var entries=select(dom,'#shipment-details-hdr-table tr td');
		for(var i=0; i<entries.length; i+=4){
			var parts=entries[i].children[0].raw.replace(/\r?\n|\r/g, " ").trim().split('-');
			var time=entries[i+1].children[0].raw.replace(/\r?\n|\r/g, " ").trim().split(':');
			logDate=new Date(parts[2],parts[1]-1,parts[0],time[0],time[1]); 
			data.log.push({
				status: entries[i+3].children[0].raw.replace(/\r?\n|\r/g, " ").trim(),
				location: entries[i+2].children[0].raw.replace(/\r?\n|\r/g, " ").trim(),
				timestamp: logDate
			});
		};
	next(data);
	},
	yodel: function(dom,data,next){
		var entries=select(dom,'.status-ribbon h3.sub-header');
		entries.forEach(function(entry){
			data.log.push(children[0].raw.replace(/\r?\n|\r/g, " ").trim());
		});
	next(data);
	},
	dpd: function(dom,data,next){
		var entries=select(dom,'.tracking-stage__icon--active');
		entries.forEach(function(entry){
			data.log.push(entry.children[0].raw.replace(/\r?\n|\r/g, " ").trim());
		});
	next(data);
	},
	royalMail: function(dom,data,next){
		var entries=select(dom,'div.result-column div.notice p');
		entries.forEach(function(entry){
			data.log.push(entry.children[1].raw.replace(/\r?\n|\r/g, " ").trim());
		});
	next(data);
	}
};