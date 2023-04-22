function checkLength(data, response) {
    if (data.length != 0) {
        response.set('Access-Control-Allow-Origin', '*'); // Quick and dirty way of doing CORS
        response.send(JSON.stringify(data));
        response.end();
      } else {
        response.set('Access-Control-Allow-Origin', '*');
        response.send("Error 404: [exports.getArticleData] Data Not Found!");
        response.end();
      };
};

function checkNone(data, response) {
    if (data.censusData != 'None' || data.topicsData != 'None' || data.censusTracts != 'None') {
        response.set('Access-Control-Allow-Origin', '*');
        response.send(JSON.stringify(data));
        response.end();
    } else if (data.censusData == 'None' && data.topicsData == 'None' && data.censusTracts == 'None') {
        response.set('Access-Control-Allow-Origin', '*');
        response.send(JSON.stringify(data));
        response.end();
    } else {
        response.set('Access-Control-Allow-Origin', '*');
        response.send("Error 501: [exports.getDateAndNeighborhood] Collections Not Found!");
        response.end();
    };
};

// Just to pass through the backend
function passBackend(response) {
    response.set('Access-Control-Allow-Origin', '*');
    response.send("Passed the API Endpoint");
    response.end();
}

// ======================================= PRINTERS ==============================================
function infoPrinter(message, bool, func, obj = {}) {
    if (bool) {
        func.logger.info(message, obj)
    }
}

function errorPrinter(message, bool, func, obj = {}) {
    if (bool) {
        func.logger.error(message, obj)
    }
}


module.exports = { checkLength, checkNone, passBackend, infoPrinter };