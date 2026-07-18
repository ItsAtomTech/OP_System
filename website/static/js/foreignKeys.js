// define foriegn keys here along with the value they are ment to have
let keyMaps = {

}


//detect if on keyMaps						
function isForeignKey(key){
	if(keyMaps[key]){
		return true;
	}
	return false;
}

//get the mapped FK value
function applyForeignKey(colm, data) {
    // console.log(colm, data);
    let path = keyMaps[colm].split('.');
    let value = data;

    try {
        for (let i = 0; i < path.length; i++) {
            if (value[path[i]] === undefined) {
                throw new Error('Path not found');
            }
            value = value[path[i]]; //get path one by one
        }
        return value;
    } catch (error) {
        console.warn('Error:', error.message);
        return data[colm]; // Return the original colm value in case of an error
    }
}


// Others

// Parsers Config and Logic
let parseConfig = {
	
	
}




//detect if on keyMaps						
function hasParser(key){
	if(parseConfig[key]){
		return true;
	}
	return false;
}
function dataParse(key,data){
	data = parseConfig[key].parser(key, data);
	return data
}


	
function checkConfirmParser(key, data){
	let b_id = (data[key]);
	try{
		let datas = JSON.parse(b_id);
		if(datas.length >= 1){
			return "Checked";
		}
		
		return "Not checked";
	}catch(e){
		return "  ";
	}
	
	
}
	
	

function listArrayParser(key, data){

	try{
		data = JSON.parse(data[key]).join(", ");
	}catch(e){
		data = data[key];
	}
	return data;
	
}

function addressParser(key, data){	
	try{
		data = JSON.parse(data[key]);
	}catch(e){
		data = data[key];
		return data;
	}	
	let accum = [];	
	for(i = 0; i < data.length; i++){
		accum.push(data[i].join(" "));
	}	
	return accum.join(", ");	
}


//Name format Parser from an array
function nameParser(key, data, format = 'L-F-M-S') {
    let parsedData;
    try {
        parsedData = JSON.parse(data[key]);
    } catch (e) {
        parsedData = data[key];
        return parsedData;
    }

    const formatName = (nameArray) => {
        const parts = { L: nameArray[0], F: nameArray[1], M: nameArray[2], S: nameArray[3] };
        let formattedName = format.split('-').map(part => parts[part] || '').filter(part => part).join(' ');

        // Add a comma after the last name if it is the first component
        if (format.startsWith('L-') && parts.L) {
            formattedName = formattedName.replace(parts.L, parts.L + ',');
        }

        return formattedName;
    };

    let names = [];
    for (let i = 0; i < parsedData.length; i++) {
        names.push(formatName(parsedData[i]));
    }

    return names.join(", ");
}


	
function yesNoParser(key, data) {
    let datas = (data[key]);
	
	if (datas == 1 || datas === true) {
		return "Yes";
	}else if (datas == 0 || datas == false) {
		return "No";
	}else{
		return "No";
	}

 
}


function booleanParser(key, data){
	return yesNoParser(key,data);
}

