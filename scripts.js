var fs = require('fs');

// Input params
var payload = JSON.parse(fs.readFileSync('/Users/karthickram/m2p-payload.json', 'utf8')); // Change this file location to your local path
var n = '105'; // I would just keep incrementing this number for every transaction

// Dont forget to change the companyId, userId and tide accountId based on the payee details
var userId = '192d01ab-d910-4e39-ad01-abd9104e39b2';
var companyId = '344ccd41-aada-46ad-aa85-6c612030f7e8';
var primaryTideAccountId = '13884272-9d00-4017-9c43-33d96aeb96dc';

console.log(payload.txn.ts);
var timestamp = (payload.txn.ts).slice(0, -6)
console.log(timestamp);

var output = {};
output.messageId = '97a42ffa-4ee8-43d7-84c3-5051b8fe5' + n;
output.timestamp = timestamp;
output.payload = getPayload(payload);
output.companyId = companyId;
output.userId = userId;
output.eventType = 'application/vnd.tide.payments.inbound-direct-payment-received.v1.0';
output.payloadType = 'application/vnd.tide.payments.inbound-direct-payment-received.v1.0';

function getPayload(payload) {

    let internalPayload = {};
    internalPayload.issuerInstitution = 'TRANSCORP';
    internalPayload.externalTransferTrackingId = payload.txn.id;
    internalPayload.transactionReference = payload.rrn.toString();
    internalPayload.proprietaryBankCode = 'DOMESTIC_TRANSFER';
    internalPayload.bookingDateTime = payload.txn.ts;
    internalPayload.valueDateTime = payload.txn.ts;
    internalPayload.localInstrument = 'IN.UPI';
    internalPayload.source = {
        'type': 'UpiVpa',
        'id': payload.payerDetails.addr
    };
    internalPayload.sourceAccountHolder = payload.payerDetails.name;
    internalPayload.destination = {
        'type': 'TideAccountId',
        'id': primaryTideAccountId
    };
    internalPayload.currency = payload.payerDetails.amount.curr;
    internalPayload.amount = payload.payerDetails.amount.value;
    internalPayload.description = payload.txn.note;

    let escapedJsonString = JSON.stringify(internalPayload);
    return escapedJsonString;
}

console.log(output);
fs.writeFileSync('/Users/karthickram/output-payload.json', JSON.stringify(output));

