'use strict';

module.exports = class InterBotConfig {

    get apiaiAccessToken() {
        return this._apiaiAccessToken;
    }

    set apiaiAccessToken(value) {
        this._apiaiAccessToken = value;
    }

    get apiaiLang() {
        return this._apiaiLang;
    }

    set apiaiLang(value) {
        this._apiaiLang = value;
    }

    get interbotApiKey() {
        return this._interbotApiKey;
    }

    set interbotApiKey(value) {
        this._interbotApiKey = value;
    }

    get interbotBotName() {
        return this._interbotBotName;
    }

    set interbotBotName(value) {
        this._interbotBotName = value;
    }

    get devConfig() {
        return this._devConfig;
    }

    set devConfig(value) {
        this._devConfig = value;
    }

    constructor(apiaiAccessToken, apiaiLang, interbotBotName, interbotApiKey) {
        this._apiaiAccessToken = apiaiAccessToken;
        this._apiaiLang = apiaiLang;
        this._interbotBotName = interbotBotName;
        this._interbotApiKey = interbotApiKey;

    }

    toPlainDoc() {
        return {
            apiaiAccessToken: this._apiaiAccessToken,
            apiaiLang: this._apiaiLang
        }
    }

    static fromPlainDoc(doc){
        return new InterBotConfig(
            doc.apiaiAccessToken,
            doc.apiaiLang);
    }
};
