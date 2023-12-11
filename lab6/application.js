const BlumBlumShub = require('../lib/blumBlumShub.js');
const ElGamal = require('../lib/elgamal.js');

module.exports = class Application {
    constructor(electionCommittee, registrationBureau) {
        this.electionCommittee = electionCommittee;
        this.registrationBureau = registrationBureau;
        this.signedIn = {};
    }

    signIn(login, password) {
        const credential = this.registrationBureau.credentials[login];
        if (!credential) throw new Error('User does not exist!');
        if (credential !== password) throw new Error('Wrong password!');
    }

    vote(token, candidateId) {
        const {id, publicKey} = token;
        const {message, x0} = BlumBlumShub.encrypt(candidateId, publicKey);
        const encrypted = ElGamal.encrypt(JSON.stringify({id, message, x0}), this.electionCommittee.publicKey);
        this.electionCommittee.receiveVoteMessage(encrypted);
    }
}