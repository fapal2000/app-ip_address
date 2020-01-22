/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
  The ip-cidr package exports a class.
  Assign the class definition to variable IPCIDR.
*/
const IPCIDR = require('ip-cidr');
const path = require('path');
//const ipv6 = require('./ipv6.js');
//const ipv6 = require(path.join(__dirname, 'ipv6.js'));
const { getIpv4MappedIpv6Address } = require(path.join(__dirname, 'ipv6.js'));

class IpAddress {
  constructor() {
    // IAP's global log object is used to output errors, warnings, and other
    // information to the console, IAP's log files, or a Syslog server.
    // For more information, consult the Log Class guide on the Itential
    // Developer Hub https://developer.itential.io/ located
    // under Documentation -> Developer Guides -> Log Class Guide
    log.info('Starting the IpAddress product.');
  }
  getFirstIpAddress(cidrStr, callback) {

        // Initialize return arguments for callback
        let firstIpAddress = null;
        let callbackError = null;

        // Instantiate an object from the imported class and assign the instance to variable cidr.
        const cidr = new IPCIDR(cidrStr);
        // Initialize options for the toArray() method.
        // We want an offset of one and a limit of one.
        // This returns an array with a single element, the first host address from the subnet.
        const options = {
            from: 1,
            limit: 1
        };

        // Use the object's isValid() method to verify the passed CIDR.
        if (!cidr.isValid()) {
            // If the passed CIDR is invalid, set an error message.
            callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
        } else {
            // If the passed CIDR is valid, call the object's toArray() method.
            // Notice the destructering assignment syntax to get the value of the first array's element.
            let ipv4add=null;
            [ipv4add] = cidr.toArray(options);
            /*equivale a 
            let fst=cidr.toArray(options);
            firstIpAddress=fst[0];
            */
            firstIpAddress=JSON.stringify({
                "ipv4" : ipv4add,
                "ipv6" : getIpv4MappedIpv6Address(ipv4add)
            })
        }
        // Call the passed callback function.
        // Node.js convention is to pass error data as the first argument to a callback.
        // The IAP convention is to pass returned data as the first argument and error
        // data as the second argument to the callback function.
        return callback(firstIpAddress, callbackError);
    }
}

module.exports = new IpAddress;