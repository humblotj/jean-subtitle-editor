/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
var MglishNlService = /** @class */ (function () {
    function MglishNlService(http) {
        this.http = http;
        this.debug = true;
    }
    /**
     * @private
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    MglishNlService.prototype.request = /**
     * @private
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    function (text, apiKeyGoogle) {
        /** @type {?} */
        var params = new HttpParams().append('key', apiKeyGoogle);
        /** @type {?} */
        var url = 'https://cors-anywhere.herokuapp.com/https://language.googleapis.com/v1beta2/documents:analyzeSyntax';
        /** @type {?} */
        var request = {
            'document': {
                'content': text,
                'type': 'PLAIN_TEXT',
            },
            'encodingType': 'UTF8',
        };
        /** @type {?} */
        var options = { headers: { 'Content-Type': 'application/json' }, params: params };
        return this.http.post(url, JSON.stringify(request), options);
    };
    /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    MglishNlService.prototype.chunkText = /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    function (text, apiKeyGoogle) {
        var _this = this;
        /** @type {?} */
        var textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-').replace(/\…/g, '...');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        function (subscriber) { return _this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        function (result) {
            subscriber.next(_this.getTextWithChunk(result, textToChunk));
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            subscriber.error(error);
        })); }));
    };
    /**
     * @param {?} textArray
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    MglishNlService.prototype.chunkTextArray = /**
     * @param {?} textArray
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    function (textArray, apiKeyGoogle) {
        var _this = this;
        /** @type {?} */
        var textToChunk = '';
        for (var i = 0; i < textArray.length; i++) {
            textToChunk += textArray[i] + '　';
        }
        textToChunk = textToChunk.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-').replace(/\…/g, '...');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        function (subscriber) { return _this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        function (result) {
            /** @type {?} */
            var textWithChunk = _this.getTextWithChunk(result, textToChunk.replace(/　/g, '|||'));
            /** @type {?} */
            var textChunkArray = textWithChunk.split(/\|{3,}/g);
            textChunkArray.pop();
            subscriber.next(textChunkArray);
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            subscriber.error(error);
        })); }));
    };
    /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    MglishNlService.prototype.textWithMitre = /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    function (text, apiKeyGoogle) {
        var _this = this;
        /** @type {?} */
        var textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        function (subscriber) { return _this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        function (result) {
            subscriber.next(_this.getTextWithMitre(result, textToChunk));
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            subscriber.error(error);
        })); }));
    };
    /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    MglishNlService.prototype.textWithBreakLine = /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    function (text, apiKeyGoogle) {
        var _this = this;
        /** @type {?} */
        var textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        function (subscriber) { return _this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        function (result) {
            subscriber.next(_this.getTextWithBreakLine(result, textToChunk));
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            subscriber.error(error);
        })); }));
    };
    /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    MglishNlService.prototype.chunkPositionList = /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    function (text, apiKeyGoogle) {
        var _this = this;
        /** @type {?} */
        var textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        function (subscriber) { return _this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        function (result) {
            subscriber.next(_this.handle(result, textToChunk));
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        function (error) {
            subscriber.error(error);
        })); }));
    };
    /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    MglishNlService.prototype.getTextWithMitre = /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    function (result, text) {
        /** @type {?} */
        var chunkPositionList = this.handle(result, text);
        if (Object.keys(chunkPositionList).length === 0) {
            return '「' + text + '」';
        }
        else {
            /** @type {?} */
            var newText = '';
            /** @type {?} */
            var previousPosition = 0;
            /** @type {?} */
            var fragment = '';
            for (var key in chunkPositionList) {
                if (chunkPositionList.hasOwnProperty(key)) {
                    /** @type {?} */
                    var tmp = text.substring(chunkPositionList[previousPosition], chunkPositionList[key]);
                    /** @type {?} */
                    var countBegin = 0;
                    /** @type {?} */
                    var countEnd = tmp.length - 1;
                    while (countBegin < tmp.length && tmp.charAt(countBegin) === '\n') {
                        countBegin++;
                    }
                    while (countEnd > 0 && tmp.charAt(countEnd) === '\n') {
                        countEnd--;
                    }
                    countEnd = tmp.length - 1 - countEnd;
                    fragment = '\n'.repeat(countBegin);
                    fragment += '「';
                    fragment += tmp.trim();
                    fragment += '」' + '\n'.repeat(countEnd);
                    if (countEnd === 0) {
                        fragment += '　';
                    }
                    newText = newText + fragment;
                    previousPosition = +key;
                }
            }
            /** @type {?} */
            var tmpLast = text.substring(chunkPositionList[previousPosition], text.length);
            /** @type {?} */
            var count = 0;
            while (count < tmpLast.length && tmpLast.charAt(count) === '\n') {
                count++;
            }
            fragment = count === 0 ? '' : '\n'.repeat(count);
            fragment += '「' + tmpLast.trim() + '」';
            newText = newText + fragment;
            return newText;
        }
    };
    /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    MglishNlService.prototype.getTextWithBreakLine = /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    function (result, text) {
        /** @type {?} */
        var chunkPositionList = this.handle(result, text);
        if (Object.keys(chunkPositionList).length === 0) {
            return text;
        }
        else {
            /** @type {?} */
            var part = [];
            /** @type {?} */
            var previousPosition = 0;
            /** @type {?} */
            var fragment = void 0;
            for (var key in chunkPositionList) {
                if (chunkPositionList.hasOwnProperty(key)) {
                    fragment = text.substring(chunkPositionList[previousPosition], chunkPositionList[key]);
                    part.push(fragment);
                    previousPosition = +key;
                }
            }
            fragment = text.substring(chunkPositionList[previousPosition], text.length);
            part.push(fragment);
            console.log(part);
            return part.join('\n');
        }
    };
    /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    MglishNlService.prototype.getTextWithChunk = /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    function (result, text) {
        /** @type {?} */
        var chunkPositionList = this.handle(result, text);
        if (Object.keys(chunkPositionList).length === 0) {
            return text;
        }
        else {
            /** @type {?} */
            var part = [];
            /** @type {?} */
            var previousPosition = 0;
            /** @type {?} */
            var fragment = void 0;
            for (var key in chunkPositionList) {
                if (chunkPositionList.hasOwnProperty(key)) {
                    fragment = text.substring(chunkPositionList[previousPosition], chunkPositionList[key]);
                    part.push(fragment);
                    previousPosition = +key;
                }
            }
            fragment = text.substring(chunkPositionList[previousPosition], text.length);
            part.push(fragment);
            console.log(part);
            return part.join('|');
        }
    };
    /**
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    MglishNlService.prototype.handle = /**
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    function (result, text) {
        /** @type {?} */
        var chunkPositionList = {};
        /** @type {?} */
        var tokens = result.tokens;
        for (var i = 0; i < tokens.length; i++) {
            switch (tokens[i]['dependencyEdge']['label']) {
                case 'ROOT':
                    this.handleVerb(tokens, i, chunkPositionList);
                    break;
                case 'CCOMP':
                    this.handleVerb(tokens, i, chunkPositionList);
                    break;
                case 'RCMOD':
                    this.handleVerb(tokens, i, chunkPositionList);
                    break;
                case 'CONJ':
                    if (this.isConjugateVerb(i, tokens) || tokens[tokens[i]['dependencyEdge']['headTokenIndex']]['dependencyEdge']['label'] === 'ROOT'
                        || tokens[tokens[i]['dependencyEdge']['headTokenIndex']]['dependencyEdge']['label'] === 'CCOMP'
                        || tokens[tokens[i]['dependencyEdge']['headTokenIndex']]['dependencyEdge']['label'] === 'RCMOD'
                        || tokens[tokens[i]['dependencyEdge']['headTokenIndex']]['dependencyEdge']['label'] === 'ADVCL'
                        || tokens[tokens[i]['dependencyEdge']['headTokenIndex']]['dependencyEdge']['label'] === 'PARATAXIS') {
                        this.handleVerb(tokens, i, chunkPositionList);
                    }
                    break;
                case 'PARATAXIS':
                    if (this.isConjugateVerb(i, tokens)) {
                        this.handleVerb(tokens, i, chunkPositionList);
                    }
                    break;
                case 'ADVCL':
                    if (tokens[i]['partOfSpeech']['tag'] === 'VERB') {
                        this.handleVerb(tokens, i, chunkPositionList);
                    }
                    break;
                // acomp example : being able, cut after acomp if exist
                case 'PCOMP':
                    if (i > 1 && i < tokens.length - 1) {
                        if (i < tokens.length - 2 && this.checkLabel(['ACOMP'], i + 1, tokens)) {
                            this.addChunk(chunkPositionList, i + 2, tokens, 'pcomp + acomp:' + i);
                        }
                        else {
                            this.addChunk(chunkPositionList, i + 1, tokens, 'pcomp:' + i);
                        }
                    }
                    break;
                case 'PREP':
                    // check if previous word is related, chunk if not
                    // special rules: break if previous word = aux
                    // chunk before previous words if previous word = mwe
                    if (i > 2 && (this.checkLabel(['AUX', 'AUXPASS'], i - 1, tokens)
                        && tokens[i - 1]['dependencyEdge']['headTokenIndex'] > i)) {
                        break;
                    }
                    if (i > 2 && ((this.checkLabel(['MWE'], i - 1, tokens) && tokens[i - 1]['dependencyEdge']['headTokenIndex'] === i))) {
                        this.checkCCAndChunk(chunkPositionList, i - 1, tokens, 'prep mwe:' + i);
                        break;
                    }
                    if (i > 0 && tokens[i]['dependencyEdge']['headTokenIndex'] !== i - 1 &&
                        tokens[i - 1]['dependencyEdge']['headTokenIndex'] !== i) {
                        if (i > 1 && this.isConjugateVerb(i - 2, tokens)) {
                            break;
                        }
                        this.checkCCAndChunk(chunkPositionList, i, tokens, 'prep:' + i);
                    }
                    break;
                case 'MARK':
                    if (i > 1) {
                        this.addChunk(chunkPositionList, i, tokens, 'mark: ' + i);
                    }
                    break;
                case 'NSUBJ':
                    this.handleSubj(tokens, i, chunkPositionList);
                    break;
                case 'NSUBJPASS':
                    this.handleSubj(tokens, i, chunkPositionList);
                    break;
                case 'P':
                    if (tokens[i]['text']['content'] === '.' || tokens[i]['text']['content'] === '!' || tokens[i]['text']['content'] === '?') {
                        if (i < tokens.length - 1) {
                            console.log(tokens[i + 1]['text']['content'] === '-');
                        }
                        if (i < tokens.length - 1
                            && !(tokens[i + 1]['text']['content'] === '.'
                                || tokens[i + 1]['text']['content'] === '!'
                                || tokens[i + 1]['text']['content'] === '?'
                                || tokens[i + 1]['text']['content'] === '-')) {
                            this.addChunk(chunkPositionList, i + 1, tokens, 'punctuation: ' + i);
                        }
                    }
                    break;
                case 'CC':
                    // chunk if words behind and after too long
                    /** @type {?} */
                    var indexFirst = tokens[i]['dependencyEdge']['headTokenIndex'];
                    if (i < indexFirst) {
                        break;
                    }
                    /** @type {?} */
                    var indexSecond = void 0;
                    for (var k = i + 1; k < tokens.length; k++) {
                        if (this.checkLabel(['CONJ'], k, tokens) && tokens[k]['dependencyEdge']['headTokenIndex'] === indexFirst) {
                            indexSecond = k;
                            break;
                        }
                    }
                    if (typeof indexSecond === 'undefined') {
                        break;
                    }
                    /** @type {?} */
                    var count = indexSecond - indexFirst;
                    /** @type {?} */
                    var a = indexFirst - 1;
                    while (a > 0 && tokens[a]['dependencyEdge']['headTokenIndex'] === indexFirst) {
                        count++;
                        a--;
                    }
                    /** @type {?} */
                    var b = indexSecond + 1;
                    while (b > tokens.length - 1 && tokens[b]['dependencyEdge']['headTokenIndex'] === indexSecond) {
                        count++;
                        b++;
                    }
                    if (count > 2) {
                        this.addChunk(chunkPositionList, i, tokens, 'cc :' + i);
                    }
                    break;
                case 'AUX':
                    // chunk if following is verb, example 'to do'
                    if (i > 0 && i < tokens.length - 2 && tokens[i]['partOfSpeech']['tag'] === 'PRT'
                        && tokens[i + 1]['partOfSpeech']['tag'] === 'VERB') {
                        this.addChunk(chunkPositionList, i, tokens, 'aux :' + i);
                    }
                    break;
                case 'VMOD':
                    // chunk before vmod if previous word not verb
                    if (i > 2 && tokens[i - 1]['partOfSpeech']['tag'] !== 'PRT') {
                        this.addChunk(chunkPositionList, i, tokens, 'vmod :' + i);
                    }
                    break;
                case 'ADVMOD':
                    // chunk before vmod if previous word not verb
                    if (i > 2 && (tokens[i]['text']['content'] === 'as'
                        || tokens[i]['text']['content'] === 'when' || tokens[i]['text']['content'] === 'where')) {
                        this.addChunk(chunkPositionList, i, tokens, 'advmod :' + i);
                    }
                    break;
                default:
                    break;
            }
        }
        this.handleTooLongPart(tokens, chunkPositionList);
        this.removeTooShortPart(tokens, chunkPositionList);
        return chunkPositionList;
    };
    // chunk after verb, keep following prt if exists
    // chunk after verb, keep following prt if exists
    /**
     * @private
     * @param {?} tokens
     * @param {?} index
     * @param {?} chunkPositionList
     * @return {?}
     */
    MglishNlService.prototype.handleVerb = 
    // chunk after verb, keep following prt if exists
    /**
     * @private
     * @param {?} tokens
     * @param {?} index
     * @param {?} chunkPositionList
     * @return {?}
     */
    function (tokens, index, chunkPositionList) {
        if (index !== tokens.length - 1 &&
            ((this.checkLabel(['PRT', 'XCOMP'], index + 1, tokens) && tokens[index + 1]['dependencyEdge']['headTokenIndex'] === index)
                || this.checkLabel(['ACOMP'], index + 1, tokens))) {
            if (index + 1 < tokens.length - 1) {
                this.addChunk(chunkPositionList, index + 2, tokens, 'verb :' + index);
            }
        }
        else {
            if (index !== tokens.length - 1) {
                this.addChunk(chunkPositionList, index + 1, tokens, 'verb :' + index);
            }
        }
    };
    // check length of subject if too long, chunk subj / verb
    // check length of subject if too long, chunk subj / verb
    /**
     * @private
     * @param {?} tokens
     * @param {?} index
     * @param {?} chunkPositionList
     * @return {?}
     */
    MglishNlService.prototype.handleSubj = 
    // check length of subject if too long, chunk subj / verb
    /**
     * @private
     * @param {?} tokens
     * @param {?} index
     * @param {?} chunkPositionList
     * @return {?}
     */
    function (tokens, index, chunkPositionList) {
        if (!(index < tokens.length - 1 && (((/** @type {?} */ (tokens[index + 1]['text']['content']))).startsWith('\'')
            || ((/** @type {?} */ (tokens[index + 1]['text']['content']))).startsWith('\’')))) {
            /** @type {?} */
            var verbIndex = tokens[index]['dependencyEdge']['headTokenIndex'];
            /** @type {?} */
            var verbIndexHead = tokens[verbIndex]['dependencyEdge']['headTokenIndex'];
            /** @type {?} */
            var k = index - 1;
            while (k >= 0 && (tokens[k]['dependencyEdge']['headTokenIndex'] === index
                || tokens[k]['dependencyEdge']['headTokenIndex'] === k + 1
                || tokens[k]['dependencyEdge']['headTokenIndex'] === verbIndex
                || (tokens[k]['dependencyEdge']['headTokenIndex'] === verbIndexHead && !this.checkLabel(['P'], k, tokens))
                || this.checkLabel(['ADVMOD', 'AMOD', 'PS'], index - 1, tokens))) {
                k--;
            }
            if (k > 0) {
                this.checkCCAndChunk(chunkPositionList, k + 1, tokens, 'nsubj: ' + index);
            }
            if (verbIndex < index) {
                if (index !== tokens.length - 1 &&
                    ((this.checkLabel(['PRT'], verbIndex + 1, tokens) && tokens[verbIndex + 1]['dependencyEdge']['headTokenIndex'] === verbIndex)
                        || this.checkLabel(['ACOMP'], verbIndex + 1, tokens))) {
                    if (verbIndex + 1 < tokens.length - 1) {
                        delete chunkPositionList[verbIndex + 2];
                    }
                }
                else {
                    if (verbIndex !== tokens.length - 1) {
                        delete chunkPositionList[verbIndex + 1];
                    }
                }
            }
            else {
                /** @type {?} */
                var count = verbIndex - index + 1;
                if (verbIndex < tokens.length - 1 &&
                    this.checkLabel(['PRT'], verbIndex + 1, tokens) && tokens[verbIndex + 1]['dependencyEdge']['headTokenIndex'] === index) {
                    count++;
                }
                /** @type {?} */
                var j = index - 1;
                while (j >= 0 && tokens[j]['dependencyEdge']['headTokenIndex'] <= verbIndex
                    && (tokens[j]['dependencyEdge']['headTokenIndex'] >= j)) {
                    count++;
                    j--;
                }
                if (count > 5) {
                    if (verbIndex > 2 && (this.checkLabel(['AUX', 'AUXPASS'], verbIndex - 2, tokens))) {
                        this.addChunk(chunkPositionList, verbIndex - 2, tokens, 'subj + aux 2:' + index);
                    }
                    else {
                        if (verbIndex > 1 && (this.checkLabel(['AUX', 'AUXPASS'], verbIndex - 1, tokens))) {
                            this.addChunk(chunkPositionList, verbIndex - 1, tokens, 'subj + aux 1:' + index);
                        }
                        else {
                            if (verbIndex > 1) {
                                this.addChunk(chunkPositionList, verbIndex, tokens, 'subj:' + index);
                            }
                        }
                    }
                }
                console.log('count ' + index + ': ' + count);
            }
        }
    };
    /**
     * @private
     * @param {?} tokens
     * @param {?} chunkPositionList
     * @return {?}
     */
    MglishNlService.prototype.handleTooLongPart = /**
     * @private
     * @param {?} tokens
     * @param {?} chunkPositionList
     * @return {?}
     */
    function (tokens, chunkPositionList) {
        /** @type {?} */
        var keys = Object.keys(chunkPositionList);
        /** @type {?} */
        var previousKey = 0;
        /** @type {?} */
        var key;
        /** @type {?} */
        var length;
        for (var index = 0; index < keys.length; index++) {
            key = keys[index];
            if (chunkPositionList.hasOwnProperty(key)) {
                length = +key - previousKey;
                if (length >= 6) {
                    /** @type {?} */
                    var stringlength = +tokens[key]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
                    console.log(stringlength);
                    if (stringlength >= 35) {
                        /** @type {?} */
                        var prepList = [];
                        /** @type {?} */
                        var commaList = [];
                        for (var i = previousKey + 2; i < +key; i++) {
                            switch (tokens[i]['dependencyEdge']['label']) {
                                case 'PREP':
                                    // if (i > 1 && tokens[i - 1]['partOfSpeech']['tag'] === 'VERB') {
                                    //   break;
                                    // }
                                    if (i > 2 && (this.checkLabel(['AUX', 'AUXPASS'], i - 1, tokens))
                                        && tokens[i - 1]['dependencyEdge']['headTokenIndex'] > i) {
                                        break;
                                    }
                                    // if (tokens[i]['text']['content'] === 'of') {
                                    //   prepList.push(i + 1);
                                    // } else {
                                    prepList.push(i);
                                    // }
                                    break;
                                case 'P':
                                    if (tokens[i]['text']['content'] === ',' || tokens[i]['text']['content'] === ';') {
                                        commaList.push(i);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        this.chunkTooLong(tokens, chunkPositionList, prepList, commaList, +key, previousKey);
                    }
                    else {
                        console.log('not too long 1: ' + stringlength);
                    }
                }
                previousKey = +key;
            }
        }
        key = tokens.length - 1;
        length = +key - previousKey + 1;
        if (length >= 6) {
            /** @type {?} */
            var stringlength = +tokens[key]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
            if (stringlength >= 35) {
                console.log(previousKey + ' to ' + key + ' too long: ' + stringlength);
                /** @type {?} */
                var prepList = [];
                /** @type {?} */
                var commaList = [];
                for (var i = previousKey + 2; i < +key; i++) {
                    switch (tokens[i]['dependencyEdge']['label']) {
                        case 'PREP':
                            prepList.push(i);
                            break;
                        case 'P':
                            if (tokens[i]['text']['content'] === ',' || tokens[i]['text']['content'] === ';') {
                                commaList.push(i);
                            }
                            break;
                        default:
                            break;
                    }
                }
                this.chunkTooLong(tokens, chunkPositionList, prepList, commaList, +key, previousKey);
            }
            else {
                console.log('not too long 2: ' + stringlength);
            }
        }
        console.log(chunkPositionList);
    };
    /**
     * @private
     * @param {?} tokens
     * @param {?} chunkPositionList
     * @param {?} prepList
     * @param {?} commaList
     * @param {?} key
     * @param {?} previousKey
     * @return {?}
     */
    MglishNlService.prototype.chunkTooLong = /**
     * @private
     * @param {?} tokens
     * @param {?} chunkPositionList
     * @param {?} prepList
     * @param {?} commaList
     * @param {?} key
     * @param {?} previousKey
     * @return {?}
     */
    function (tokens, chunkPositionList, prepList, commaList, key, previousKey) {
        console.log(previousKey + ' to ' + key + ' too long: ');
        /** @type {?} */
        var closest = null;
        if (prepList.length !== 0) {
            console.log(prepList);
            /** @type {?} */
            var goal_1 = (key + previousKey) / 2;
            console.log('goal: ' + goal_1);
            closest = prepList.reduce((/**
             * @param {?} prev
             * @param {?} curr
             * @return {?}
             */
            function (prev, curr) {
                return (Math.abs(curr - goal_1) < Math.abs(prev - goal_1) ? curr : prev);
            }));
            if (closest < key && closest > previousKey) {
                this.addChunk(chunkPositionList, closest, tokens, 'too long part prep: ' + closest);
                /** @type {?} */
                var index = prepList.indexOf(closest);
                prepList.splice(index, 1);
            }
            else {
                closest = null;
            }
        }
        else {
            if (commaList.length !== 0) {
                console.log(commaList);
                /** @type {?} */
                var goal_2 = (+key + previousKey) / 2;
                console.log('goal: ' + goal_2);
                closest = commaList.reduce((/**
                 * @param {?} prev
                 * @param {?} curr
                 * @return {?}
                 */
                function (prev, curr) {
                    return (Math.abs(curr - goal_2) < Math.abs(prev - goal_2) ? curr : prev);
                }));
                console.log('closest: ' + closest);
                if (closest < key && closest > previousKey) {
                    this.addChunk(chunkPositionList, closest + 1, tokens, 'too long part comma:' + closest);
                    /** @type {?} */
                    var index = commaList.indexOf(closest);
                    commaList.splice(index, 1);
                }
                else {
                    closest = null;
                }
            }
        }
        if (closest !== null) {
            /** @type {?} */
            var length1 = +tokens[closest]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
            /** @type {?} */
            var length2 = +tokens[key]['text']['beginOffset'] - +tokens[closest]['text']['beginOffset'];
            console.log('1: ' + length1 + ' 2: ' + length2);
            if (length1 > 30) {
                this.chunkTooLong(tokens, chunkPositionList, prepList, commaList, closest, previousKey);
            }
            if (length2 > 30) {
                this.chunkTooLong(tokens, chunkPositionList, prepList, commaList, key, closest);
            }
        }
    };
    /**
     * @private
     * @param {?} tokens
     * @param {?} chunkPositionList
     * @return {?}
     */
    MglishNlService.prototype.removeTooShortPart = /**
     * @private
     * @param {?} tokens
     * @param {?} chunkPositionList
     * @return {?}
     */
    function (tokens, chunkPositionList) {
        /** @type {?} */
        var keys = Object.keys(chunkPositionList);
        /** @type {?} */
        var previousKey = 0;
        /** @type {?} */
        var key;
        /** @type {?} */
        var length;
        for (var index = 0; index < keys.length; index++) {
            key = keys[index];
            if (chunkPositionList.hasOwnProperty(key)) {
                length = +key - previousKey;
                if (length === 1) {
                    if ((tokens[previousKey]['partOfSpeech']['tag'] === 'VERB' && !this.checkLabel(['VMOD'], previousKey, tokens) ||
                        (previousKey > 0 && this.checkLabel(['P'], previousKey - 1, tokens)))) {
                        delete chunkPositionList[key];
                    }
                    else {
                        if (tokens[previousKey]['dependencyEdge']['headTokenIndex'] < previousKey
                            || (!this.checkLabel(['ADVMOD'], previousKey, tokens) && this.isConjugateVerb(previousKey - 1, tokens))) {
                            delete chunkPositionList[previousKey];
                            console.log('previous');
                        }
                        else {
                            delete chunkPositionList[key];
                            console.log('next');
                        }
                    }
                    if (this.debug) {
                        console.log('remove chunk too short: ' + key);
                    }
                }
                if (length === 2) {
                    if (previousKey !== 0 && this.checkLabel(['P'], +key - 1, tokens)) {
                        // if (tokens[previousKey]['partOfSpeech']['tag'] === 'VERB') {
                        //   delete chunkPositionList[key];
                        // } else {
                        //   if (tokens[previousKey]['dependencyEdge']['headTokenIndex'] < previousKey) {
                        delete chunkPositionList[previousKey];
                        // } else {
                        //   delete chunkPositionList[key];
                        // }
                        // }
                        if (this.debug) {
                            console.log('remove chunk too short: ' + key);
                        }
                    }
                }
                previousKey = +key;
            }
        }
        key = tokens.length - 1;
        length = +key - previousKey + 1;
        if (length === 1) {
            delete chunkPositionList[previousKey];
            if (this.debug) {
                console.log('remove chunk too short: ' + key);
            }
        }
        if (length === 2) {
            if (previousKey !== 0 && this.checkLabel(['P'], +previousKey + 1, tokens)) {
                delete chunkPositionList[previousKey];
                if (this.debug) {
                    console.log('remove chunk too short: ' + key);
                }
            }
        }
        console.log(chunkPositionList);
    };
    /**
     * @private
     * @param {?} chunkPositionList
     * @param {?} index
     * @param {?} tokens
     * @param {?} message
     * @return {?}
     */
    MglishNlService.prototype.addChunk = /**
     * @private
     * @param {?} chunkPositionList
     * @param {?} index
     * @param {?} tokens
     * @param {?} message
     * @return {?}
     */
    function (chunkPositionList, index, tokens, message) {
        if (index > 0 && index < tokens.length - 1) {
            if (this.debug) {
                console.log('add chunk ' + index + ' :' + message);
            }
            if (index > 1 && this.checkLabel(['P'], index - 1, tokens) &&
                (tokens[index - 1]['text']['content'] === '(' ||
                    ((tokens[index - 1]['text']['content'] === '"') && tokens[index - 1]['dependencyEdge']['headTokenIndex'] !== index))) {
                chunkPositionList[index - 1] = tokens[index - 2]['text']['beginOffset'] + tokens[index - 2]['text']['content'].length;
            }
            else {
                /** @type {?} */
                var j = index;
                while (j < tokens.length && this.checkLabel(['P'], j, tokens)) {
                    if (j < tokens.length - 1 && (tokens[j]['text']['content'] === '-'
                        || tokens[j]['text']['content'] === '(' || tokens[j]['text']['content'] === '"')) {
                        break;
                    }
                    j++;
                }
                if (j < tokens.length - 2 && j > 0) {
                    if (((/** @type {?} */ (tokens[j - 1]['text']['content']))).includes('　')) {
                        chunkPositionList[j] = tokens[j - 1]['text']['beginOffset'] + tokens[j - 1]['text']['content'].split('　')[0].length;
                    }
                    else {
                        chunkPositionList[j] = tokens[j - 1]['text']['beginOffset'] + tokens[j - 1]['text']['content'].length;
                    }
                }
            }
            // if (this.checkLabel(['P'], index, tokens)) {
            //   if (index < tokens.length - 2) {
            //     chunkPositionList[index + 1] = tokens[index + 1]['text']['beginOffset'] - 1;
            //   }
            // } else {
            //   chunkPositionList[index] = tokens[index]['text']['beginOffset'] - 1;
            // }
        }
    };
    /**
     * @private
     * @param {?} chunkPositionList
     * @param {?} index
     * @param {?} tokens
     * @param {?} message
     * @return {?}
     */
    MglishNlService.prototype.checkCCAndChunk = /**
     * @private
     * @param {?} chunkPositionList
     * @param {?} index
     * @param {?} tokens
     * @param {?} message
     * @return {?}
     */
    function (chunkPositionList, index, tokens, message) {
        if (this.checkLabel(['CC'], index - 1, tokens)) {
            this.addChunk(chunkPositionList, index - 1, tokens, message);
        }
        else {
            this.addChunk(chunkPositionList, index, tokens, message);
        }
    };
    /**
     * @private
     * @param {?} label
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    MglishNlService.prototype.checkLabel = /**
     * @private
     * @param {?} label
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    function (label, index, tokens) {
        if (index < 0 || index >= tokens.lenght) {
            return false;
        }
        /** @type {?} */
        var b = false;
        for (var i = 0; i < label.length; i++) {
            if (tokens[index]['dependencyEdge']['label'] === label[i]) {
                b = true;
                break;
            }
        }
        return b;
    };
    /**
     * @private
     * @param {?} headTokenIndex
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    MglishNlService.prototype.checkDependency = /**
     * @private
     * @param {?} headTokenIndex
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    function (headTokenIndex, index, tokens) {
        return tokens[index]['dependencyEdge']['headTokenIndex'] === headTokenIndex;
    };
    /**
     * @private
     * @param {?} tag
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    MglishNlService.prototype.checkTag = /**
     * @private
     * @param {?} tag
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    function (tag, index, tokens) {
        return tokens[index]['partOfSpeech']['tag'] === tag;
    };
    /**
     * @private
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    MglishNlService.prototype.isConjugateVerb = /**
     * @private
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    function (index, tokens) {
        if (index < 0 || index >= tokens.lenght) {
            return false;
        }
        return tokens[index]['partOfSpeech']['tag'] === 'VERB' && (tokens[index]['partOfSpeech']['tense'] !== 'TENSE_UNKNOWN'
            || tokens[index]['lemma'] !== tokens[index]['text']['content']);
    };
    MglishNlService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    MglishNlService.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    /** @nocollapse */ MglishNlService.ngInjectableDef = i0.defineInjectable({ factory: function MglishNlService_Factory() { return new MglishNlService(i0.inject(i1.HttpClient)); }, token: MglishNlService, providedIn: "root" });
    return MglishNlService;
}());
export { MglishNlService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    MglishNlService.prototype.debug;
    /**
     * @type {?}
     * @private
     */
    MglishNlService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWdsaXNoLW5sLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9tZ2xpc2gtbmwvIiwic291cmNlcyI6WyJsaWIvbWdsaXNoLW5sLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFHbEM7SUFNRSx5QkFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUY1QixVQUFLLEdBQUcsSUFBSSxDQUFDO0lBRW1CLENBQUM7Ozs7Ozs7SUFFakMsaUNBQU87Ozs7OztJQUFmLFVBQWdCLElBQVksRUFBRSxZQUFvQjs7WUFDMUMsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUM7O1lBQ3JELEdBQUcsR0FBRyxxR0FBcUc7O1lBQzNHLE9BQU8sR0FBRztZQUNkLFVBQVUsRUFBRTtnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixNQUFNLEVBQUUsWUFBWTthQUNyQjtZQUNELGNBQWMsRUFBRSxNQUFNO1NBQ3ZCOztZQUNLLE9BQU8sR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7UUFFbkYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRCxDQUFDOzs7Ozs7SUFFRCxtQ0FBUzs7Ozs7SUFBVCxVQUFVLElBQVksRUFBRSxZQUFvQjtRQUE1QyxpQkFXQzs7WUFWTyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxR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QyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7O2dCQTNxQkYsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFOUSxVQUFVOzs7MEJBRG5CO0NBaXJCQyxBQTVxQkQsSUE0cUJDO1NBenFCWSxlQUFlOzs7Ozs7SUFDMUIsZ0NBQXFCOzs7OztJQUVULCtCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTWdsaXNoTmxTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkZWJ1ZyA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cblxuICBwcml2YXRlIHJlcXVlc3QodGV4dDogc3RyaW5nLCBhcGlLZXlHb29nbGU6IHN0cmluZykge1xuICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKCkuYXBwZW5kKCdrZXknLCBhcGlLZXlHb29nbGUpO1xuICAgIGNvbnN0IHVybCA9ICdodHRwczovL2NvcnMtYW55d2hlcmUuaGVyb2t1YXBwLmNvbS9odHRwczovL2xhbmd1YWdlLmdvb2dsZWFwaXMuY29tL3YxYmV0YTIvZG9jdW1lbnRzOmFuYWx5emVTeW50YXgnO1xuICAgIGNvbnN0IHJlcXVlc3QgPSB7XG4gICAgICAnZG9jdW1lbnQnOiB7XG4gICAgICAgICdjb250ZW50JzogdGV4dCxcbiAgICAgICAgJ3R5cGUnOiAnUExBSU5fVEVYVCcsXG4gICAgICB9LFxuICAgICAgJ2VuY29kaW5nVHlwZSc6ICdVVEY4JyxcbiAgICB9O1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LCBwYXJhbXM6IHBhcmFtcyB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHVybCwgSlNPTi5zdHJpbmdpZnkocmVxdWVzdCksIG9wdGlvbnMpO1xuICB9XG5cbiAgY2h1bmtUZXh0KHRleHQ6IHN0cmluZywgYXBpS2V5R29vZ2xlOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0ZXh0VG9DaHVuayA9IHRleHQucmVwbGFjZSgvXFzigJx8XFzigJ0vZywgJ1xcXCInKS5yZXBsYWNlKC9cXOKAmS9nLCAnXFwnJykucmVwbGFjZSgvXFzigJMvZywgJ1xcLScpLnJlcGxhY2UoL1xc4oCmL2csICcuLi4nKTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHRoaXMucmVxdWVzdCh0ZXh0VG9DaHVuaywgYXBpS2V5R29vZ2xlKS5zdWJzY3JpYmUoXG4gICAgICAocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMuZ2V0VGV4dFdpdGhDaHVuayhyZXN1bHQsIHRleHRUb0NodW5rKSk7XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvciA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgY2h1bmtUZXh0QXJyYXkodGV4dEFycmF5OiBzdHJpbmdbXSwgYXBpS2V5R29vZ2xlOiBzdHJpbmcpIHtcbiAgICBsZXQgdGV4dFRvQ2h1bmsgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgdGV4dFRvQ2h1bmsgKz0gdGV4dEFycmF5W2ldICsgJ+OAgCc7XG4gICAgfVxuICAgIHRleHRUb0NodW5rID0gdGV4dFRvQ2h1bmsucmVwbGFjZSgvXFzigJx8XFzigJ0vZywgJ1xcXCInKS5yZXBsYWNlKC9cXOKAmS9nLCAnXFwnJykucmVwbGFjZSgvXFzigJMvZywgJ1xcLScpLnJlcGxhY2UoL1xc4oCmL2csICcuLi4nKTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHRoaXMucmVxdWVzdCh0ZXh0VG9DaHVuaywgYXBpS2V5R29vZ2xlKS5zdWJzY3JpYmUoXG4gICAgICAocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgY29uc3QgdGV4dFdpdGhDaHVuayA9IHRoaXMuZ2V0VGV4dFdpdGhDaHVuayhyZXN1bHQsIHRleHRUb0NodW5rLnJlcGxhY2UoL+OAgC9nLCAnfHx8JykpO1xuICAgICAgICBjb25zdCB0ZXh0Q2h1bmtBcnJheSA9IHRleHRXaXRoQ2h1bmsuc3BsaXQoL1xcfHszLH0vZyk7XG4gICAgICAgIHRleHRDaHVua0FycmF5LnBvcCgpO1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQodGV4dENodW5rQXJyYXkpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3IgPT4ge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHRleHRXaXRoTWl0cmUodGV4dDogc3RyaW5nLCBhcGlLZXlHb29nbGU6IHN0cmluZykge1xuICAgIGNvbnN0IHRleHRUb0NodW5rID0gdGV4dC5yZXBsYWNlKC9cXOKAnHxcXOKAnS9nLCAnXFxcIicpLnJlcGxhY2UoL1xc4oCZL2csICdcXCcnKS5yZXBsYWNlKC9cXOKAky9nLCAnXFwtJyk7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB0aGlzLnJlcXVlc3QodGV4dFRvQ2h1bmssIGFwaUtleUdvb2dsZSkuc3Vic2NyaWJlKFxuICAgICAgKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCh0aGlzLmdldFRleHRXaXRoTWl0cmUocmVzdWx0LCB0ZXh0VG9DaHVuaykpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3IgPT4ge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHRleHRXaXRoQnJlYWtMaW5lKHRleHQ6IHN0cmluZywgYXBpS2V5R29vZ2xlOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0ZXh0VG9DaHVuayA9IHRleHQucmVwbGFjZSgvXFzigJx8XFzigJ0vZywgJ1xcXCInKS5yZXBsYWNlKC9cXOKAmS9nLCAnXFwnJykucmVwbGFjZSgvXFzigJMvZywgJ1xcLScpO1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4gdGhpcy5yZXF1ZXN0KHRleHRUb0NodW5rLCBhcGlLZXlHb29nbGUpLnN1YnNjcmliZShcbiAgICAgIChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy5nZXRUZXh0V2l0aEJyZWFrTGluZShyZXN1bHQsIHRleHRUb0NodW5rKSk7XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvciA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgY2h1bmtQb3NpdGlvbkxpc3QodGV4dDogc3RyaW5nLCBhcGlLZXlHb29nbGU6IHN0cmluZykge1xuICAgIGNvbnN0IHRleHRUb0NodW5rID0gdGV4dC5yZXBsYWNlKC9cXOKAnHxcXOKAnS9nLCAnXFxcIicpLnJlcGxhY2UoL1xc4oCZL2csICdcXCcnKS5yZXBsYWNlKC9cXOKAky9nLCAnXFwtJyk7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB0aGlzLnJlcXVlc3QodGV4dFRvQ2h1bmssIGFwaUtleUdvb2dsZSkuc3Vic2NyaWJlKFxuICAgICAgKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCh0aGlzLmhhbmRsZShyZXN1bHQsIHRleHRUb0NodW5rKSk7XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvciA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cblxuICBwcml2YXRlIGdldFRleHRXaXRoTWl0cmUocmVzdWx0OiB7IHNlbnRlbmNlczogW10sIHRva2VuczogW10sIGxhbmd1YWdlOiBzdHJpbmcgfSwgdGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgY2h1bmtQb3NpdGlvbkxpc3QgPSB0aGlzLmhhbmRsZShyZXN1bHQsIHRleHQpO1xuICAgIGlmIChPYmplY3Qua2V5cyhjaHVua1Bvc2l0aW9uTGlzdCkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gJ+OAjCcgKyB0ZXh0ICsgJ+OAjSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdUZXh0ID0gJyc7XG4gICAgICBsZXQgcHJldmlvdXNQb3NpdGlvbiA9IDA7XG4gICAgICBsZXQgZnJhZ21lbnQgPSAnJztcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGNodW5rUG9zaXRpb25MaXN0KSB7XG4gICAgICAgIGlmIChjaHVua1Bvc2l0aW9uTGlzdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgY29uc3QgdG1wID0gdGV4dC5zdWJzdHJpbmcoY2h1bmtQb3NpdGlvbkxpc3RbcHJldmlvdXNQb3NpdGlvbl0sIGNodW5rUG9zaXRpb25MaXN0W2tleV0pO1xuICAgICAgICAgIGxldCBjb3VudEJlZ2luID0gMDtcbiAgICAgICAgICBsZXQgY291bnRFbmQgPSB0bXAubGVuZ3RoIC0gMTtcbiAgICAgICAgICB3aGlsZSAoY291bnRCZWdpbiA8IHRtcC5sZW5ndGggJiYgdG1wLmNoYXJBdChjb3VudEJlZ2luKSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgIGNvdW50QmVnaW4rKztcbiAgICAgICAgICB9XG4gICAgICAgICAgd2hpbGUgKGNvdW50RW5kID4gMCAmJiB0bXAuY2hhckF0KGNvdW50RW5kKSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgIGNvdW50RW5kLS07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvdW50RW5kID0gdG1wLmxlbmd0aCAtIDEgLSBjb3VudEVuZDtcblxuICAgICAgICAgIGZyYWdtZW50ID0gJ1xcbicucmVwZWF0KGNvdW50QmVnaW4pO1xuICAgICAgICAgIGZyYWdtZW50ICs9ICfjgIwnO1xuICAgICAgICAgIGZyYWdtZW50ICs9IHRtcC50cmltKCk7XG4gICAgICAgICAgZnJhZ21lbnQgKz0gJ+OAjScgKyAnXFxuJy5yZXBlYXQoY291bnRFbmQpO1xuICAgICAgICAgIGlmIChjb3VudEVuZCA9PT0gMCkge1xuICAgICAgICAgICAgZnJhZ21lbnQgKz0gJ+OAgCc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV3VGV4dCA9IG5ld1RleHQgKyBmcmFnbWVudDtcbiAgICAgICAgICBwcmV2aW91c1Bvc2l0aW9uID0gK2tleTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgdG1wTGFzdCA9IHRleHQuc3Vic3RyaW5nKGNodW5rUG9zaXRpb25MaXN0W3ByZXZpb3VzUG9zaXRpb25dLCB0ZXh0Lmxlbmd0aCk7XG4gICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgd2hpbGUgKGNvdW50IDwgdG1wTGFzdC5sZW5ndGggJiYgdG1wTGFzdC5jaGFyQXQoY291bnQpID09PSAnXFxuJykge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgfVxuXG4gICAgICBmcmFnbWVudCA9IGNvdW50ID09PSAwID8gJycgOiAnXFxuJy5yZXBlYXQoY291bnQpO1xuICAgICAgZnJhZ21lbnQgKz0gJ+OAjCcgKyB0bXBMYXN0LnRyaW0oKSArICfjgI0nO1xuICAgICAgbmV3VGV4dCA9IG5ld1RleHQgKyBmcmFnbWVudDtcbiAgICAgIHJldHVybiBuZXdUZXh0O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VGV4dFdpdGhCcmVha0xpbmUocmVzdWx0OiB7IHNlbnRlbmNlczogW10sIHRva2VuczogW10sIGxhbmd1YWdlOiBzdHJpbmcgfSwgdGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgY2h1bmtQb3NpdGlvbkxpc3QgPSB0aGlzLmhhbmRsZShyZXN1bHQsIHRleHQpO1xuICAgIGlmIChPYmplY3Qua2V5cyhjaHVua1Bvc2l0aW9uTGlzdCkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGFydCA9IFtdO1xuICAgICAgbGV0IHByZXZpb3VzUG9zaXRpb24gPSAwO1xuICAgICAgbGV0IGZyYWdtZW50OiBzdHJpbmc7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBjaHVua1Bvc2l0aW9uTGlzdCkge1xuICAgICAgICBpZiAoY2h1bmtQb3NpdGlvbkxpc3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGZyYWdtZW50ID0gdGV4dC5zdWJzdHJpbmcoY2h1bmtQb3NpdGlvbkxpc3RbcHJldmlvdXNQb3NpdGlvbl0sIGNodW5rUG9zaXRpb25MaXN0W2tleV0pO1xuICAgICAgICAgIHBhcnQucHVzaChmcmFnbWVudCk7XG4gICAgICAgICAgcHJldmlvdXNQb3NpdGlvbiA9ICtrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZyYWdtZW50ID0gdGV4dC5zdWJzdHJpbmcoY2h1bmtQb3NpdGlvbkxpc3RbcHJldmlvdXNQb3NpdGlvbl0sIHRleHQubGVuZ3RoKTtcbiAgICAgIHBhcnQucHVzaChmcmFnbWVudCk7XG4gICAgICBjb25zb2xlLmxvZyhwYXJ0KTtcbiAgICAgIHJldHVybiBwYXJ0LmpvaW4oJ1xcbicpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0VGV4dFdpdGhDaHVuayhyZXN1bHQ6IHsgc2VudGVuY2VzOiBbXSwgdG9rZW5zOiBbXSwgbGFuZ3VhZ2U6IHN0cmluZyB9LCB0ZXh0OiBzdHJpbmcpIHtcbiAgICBjb25zdCBjaHVua1Bvc2l0aW9uTGlzdCA9IHRoaXMuaGFuZGxlKHJlc3VsdCwgdGV4dCk7XG4gICAgaWYgKE9iamVjdC5rZXlzKGNodW5rUG9zaXRpb25MaXN0KS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwYXJ0ID0gW107XG4gICAgICBsZXQgcHJldmlvdXNQb3NpdGlvbiA9IDA7XG4gICAgICBsZXQgZnJhZ21lbnQ6IHN0cmluZztcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGNodW5rUG9zaXRpb25MaXN0KSB7XG4gICAgICAgIGlmIChjaHVua1Bvc2l0aW9uTGlzdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgZnJhZ21lbnQgPSB0ZXh0LnN1YnN0cmluZyhjaHVua1Bvc2l0aW9uTGlzdFtwcmV2aW91c1Bvc2l0aW9uXSwgY2h1bmtQb3NpdGlvbkxpc3Rba2V5XSk7XG4gICAgICAgICAgcGFydC5wdXNoKGZyYWdtZW50KTtcbiAgICAgICAgICBwcmV2aW91c1Bvc2l0aW9uID0gK2tleTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnJhZ21lbnQgPSB0ZXh0LnN1YnN0cmluZyhjaHVua1Bvc2l0aW9uTGlzdFtwcmV2aW91c1Bvc2l0aW9uXSwgdGV4dC5sZW5ndGgpO1xuICAgICAgcGFydC5wdXNoKGZyYWdtZW50KTtcbiAgICAgIGNvbnNvbGUubG9nKHBhcnQpO1xuICAgICAgcmV0dXJuIHBhcnQuam9pbignfCcpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZShyZXN1bHQ6IHsgc2VudGVuY2VzOiBbXSwgdG9rZW5zOiBbXSwgbGFuZ3VhZ2U6IHN0cmluZyB9LCB0ZXh0OiBzdHJpbmcpIHtcbiAgICBjb25zdCBjaHVua1Bvc2l0aW9uTGlzdDogUmVjb3JkPG51bWJlciwgbnVtYmVyPiA9IHt9O1xuICAgIGNvbnN0IHRva2VucyA9IHJlc3VsdC50b2tlbnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgc3dpdGNoICh0b2tlbnNbaV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2xhYmVsJ10pIHtcbiAgICAgICAgY2FzZSAnUk9PVCc6XG4gICAgICAgICAgdGhpcy5oYW5kbGVWZXJiKHRva2VucywgaSwgY2h1bmtQb3NpdGlvbkxpc3QpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdDQ09NUCc6XG4gICAgICAgICAgdGhpcy5oYW5kbGVWZXJiKHRva2VucywgaSwgY2h1bmtQb3NpdGlvbkxpc3QpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdSQ01PRCc6XG4gICAgICAgICAgdGhpcy5oYW5kbGVWZXJiKHRva2VucywgaSwgY2h1bmtQb3NpdGlvbkxpc3QpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdDT05KJzpcbiAgICAgICAgICBpZiAodGhpcy5pc0Nvbmp1Z2F0ZVZlcmIoaSwgdG9rZW5zKSB8fCB0b2tlbnNbdG9rZW5zW2ldWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddXVsnZGVwZW5kZW5jeUVkZ2UnXVsnbGFiZWwnXSA9PT0gJ1JPT1QnXG4gICAgICAgICAgICB8fCB0b2tlbnNbdG9rZW5zW2ldWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddXVsnZGVwZW5kZW5jeUVkZ2UnXVsnbGFiZWwnXSA9PT0gJ0NDT01QJ1xuICAgICAgICAgICAgfHwgdG9rZW5zW3Rva2Vuc1tpXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2xhYmVsJ10gPT09ICdSQ01PRCdcbiAgICAgICAgICAgIHx8IHRva2Vuc1t0b2tlbnNbaV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J11dWydkZXBlbmRlbmN5RWRnZSddWydsYWJlbCddID09PSAnQURWQ0wnXG4gICAgICAgICAgICB8fCB0b2tlbnNbdG9rZW5zW2ldWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddXVsnZGVwZW5kZW5jeUVkZ2UnXVsnbGFiZWwnXSA9PT0gJ1BBUkFUQVhJUycpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlVmVyYih0b2tlbnMsIGksIGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1BBUkFUQVhJUyc6XG4gICAgICAgICAgaWYgKHRoaXMuaXNDb25qdWdhdGVWZXJiKGksIHRva2VucykpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlVmVyYih0b2tlbnMsIGksIGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0FEVkNMJzpcbiAgICAgICAgICBpZiAodG9rZW5zW2ldWydwYXJ0T2ZTcGVlY2gnXVsndGFnJ10gPT09ICdWRVJCJykge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVWZXJiKHRva2VucywgaSwgY2h1bmtQb3NpdGlvbkxpc3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gYWNvbXAgZXhhbXBsZSA6IGJlaW5nIGFibGUsIGN1dCBhZnRlciBhY29tcCBpZiBleGlzdFxuICAgICAgICBjYXNlICdQQ09NUCc6XG4gICAgICAgICAgaWYgKGkgPiAxICYmIGkgPCB0b2tlbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgaWYgKGkgPCB0b2tlbnMubGVuZ3RoIC0gMiAmJiB0aGlzLmNoZWNrTGFiZWwoWydBQ09NUCddLCBpICsgMSwgdG9rZW5zKSkge1xuICAgICAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpICsgMiwgdG9rZW5zLCAncGNvbXAgKyBhY29tcDonICsgaSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpICsgMSwgdG9rZW5zLCAncGNvbXA6JyArIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUFJFUCc6XG4gICAgICAgICAgLy8gY2hlY2sgaWYgcHJldmlvdXMgd29yZCBpcyByZWxhdGVkLCBjaHVuayBpZiBub3RcbiAgICAgICAgICAvLyBzcGVjaWFsIHJ1bGVzOiBicmVhayBpZiBwcmV2aW91cyB3b3JkID0gYXV4XG4gICAgICAgICAgLy8gY2h1bmsgYmVmb3JlIHByZXZpb3VzIHdvcmRzIGlmIHByZXZpb3VzIHdvcmQgPSBtd2VcbiAgICAgICAgICBpZiAoaSA+IDIgJiYgKHRoaXMuY2hlY2tMYWJlbChbJ0FVWCcsICdBVVhQQVNTJ10sIGkgLSAxLCB0b2tlbnMpXG4gICAgICAgICAgICAmJiB0b2tlbnNbaSAtIDFdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID4gaSkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaSA+IDIgJiYgKCh0aGlzLmNoZWNrTGFiZWwoWydNV0UnXSwgaSAtIDEsIHRva2VucykgJiYgdG9rZW5zW2kgLSAxXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA9PT0gaSkpKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ0NBbmRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgaSAtIDEsIHRva2VucywgJ3ByZXAgbXdlOicgKyBpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaSA+IDAgJiYgdG9rZW5zW2ldWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddICE9PSBpIC0gMSAmJlxuICAgICAgICAgICAgdG9rZW5zW2kgLSAxXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSAhPT0gaSkge1xuICAgICAgICAgICAgaWYgKGkgPiAxICYmIHRoaXMuaXNDb25qdWdhdGVWZXJiKGkgLSAyLCB0b2tlbnMpKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jaGVja0NDQW5kQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGksIHRva2VucywgJ3ByZXA6JyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTUFSSyc6XG4gICAgICAgICAgaWYgKGkgPiAxKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpLCB0b2tlbnMsICdtYXJrOiAnICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdOU1VCSic6XG4gICAgICAgICAgdGhpcy5oYW5kbGVTdWJqKHRva2VucywgaSwgY2h1bmtQb3NpdGlvbkxpc3QpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdOU1VCSlBBU1MnOlxuICAgICAgICAgIHRoaXMuaGFuZGxlU3Viaih0b2tlbnMsIGksIGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUCc6XG4gICAgICAgICAgaWYgKHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICcuJyB8fCB0b2tlbnNbaV1bJ3RleHQnXVsnY29udGVudCddID09PSAnIScgfHwgdG9rZW5zW2ldWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJz8nKSB7XG4gICAgICAgICAgICBpZiAoaSA8IHRva2Vucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRva2Vuc1tpICsgMV1bJ3RleHQnXVsnY29udGVudCddID09PSAnLScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGkgPCB0b2tlbnMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICAmJiAhKHRva2Vuc1tpICsgMV1bJ3RleHQnXVsnY29udGVudCddID09PSAnLidcbiAgICAgICAgICAgICAgICB8fCB0b2tlbnNbaSArIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJyEnXG4gICAgICAgICAgICAgICAgfHwgdG9rZW5zW2kgKyAxXVsndGV4dCddWydjb250ZW50J10gPT09ICc/J1xuICAgICAgICAgICAgICAgIHx8IHRva2Vuc1tpICsgMV1bJ3RleHQnXVsnY29udGVudCddID09PSAnLScpKSB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGkgKyAxLCB0b2tlbnMsICdwdW5jdHVhdGlvbjogJyArIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQ0MnOlxuICAgICAgICAgIC8vIGNodW5rIGlmIHdvcmRzIGJlaGluZCBhbmQgYWZ0ZXIgdG9vIGxvbmdcbiAgICAgICAgICBjb25zdCBpbmRleEZpcnN0ID0gdG9rZW5zW2ldWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddO1xuICAgICAgICAgIGlmIChpIDwgaW5kZXhGaXJzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBpbmRleFNlY29uZDogbnVtYmVyO1xuICAgICAgICAgIGZvciAobGV0IGsgPSBpICsgMTsgayA8IHRva2Vucy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tMYWJlbChbJ0NPTkonXSwgaywgdG9rZW5zKSAmJiB0b2tlbnNba11bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IGluZGV4Rmlyc3QpIHtcbiAgICAgICAgICAgICAgaW5kZXhTZWNvbmQgPSBrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBpbmRleFNlY29uZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgY291bnQgPSBpbmRleFNlY29uZCAtIGluZGV4Rmlyc3Q7XG4gICAgICAgICAgbGV0IGEgPSBpbmRleEZpcnN0IC0gMTtcbiAgICAgICAgICB3aGlsZSAoYSA+IDAgJiYgdG9rZW5zW2FdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSBpbmRleEZpcnN0KSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgYS0tO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgYiA9IGluZGV4U2Vjb25kICsgMTtcbiAgICAgICAgICB3aGlsZSAoYiA+IHRva2Vucy5sZW5ndGggLSAxICYmIHRva2Vuc1tiXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA9PT0gaW5kZXhTZWNvbmQpIHtcbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICBiKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjb3VudCA+IDIpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGksIHRva2VucywgJ2NjIDonICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBVVgnOlxuICAgICAgICAgIC8vIGNodW5rIGlmIGZvbGxvd2luZyBpcyB2ZXJiLCBleGFtcGxlICd0byBkbydcbiAgICAgICAgICBpZiAoaSA+IDAgJiYgaSA8IHRva2Vucy5sZW5ndGggLSAyICYmIHRva2Vuc1tpXVsncGFydE9mU3BlZWNoJ11bJ3RhZyddID09PSAnUFJUJ1xuICAgICAgICAgICAgJiYgdG9rZW5zW2kgKyAxXVsncGFydE9mU3BlZWNoJ11bJ3RhZyddID09PSAnVkVSQicpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGksIHRva2VucywgJ2F1eCA6JyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnVk1PRCc6XG4gICAgICAgICAgLy8gY2h1bmsgYmVmb3JlIHZtb2QgaWYgcHJldmlvdXMgd29yZCBub3QgdmVyYlxuICAgICAgICAgIGlmIChpID4gMiAmJiB0b2tlbnNbaSAtIDFdWydwYXJ0T2ZTcGVlY2gnXVsndGFnJ10gIT09ICdQUlQnKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpLCB0b2tlbnMsICd2bW9kIDonICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBRFZNT0QnOlxuICAgICAgICAgIC8vIGNodW5rIGJlZm9yZSB2bW9kIGlmIHByZXZpb3VzIHdvcmQgbm90IHZlcmJcbiAgICAgICAgICBpZiAoaSA+IDIgJiYgKHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICdhcydcbiAgICAgICAgICAgIHx8IHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICd3aGVuJyB8fCB0b2tlbnNbaV1bJ3RleHQnXVsnY29udGVudCddID09PSAnd2hlcmUnKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgaSwgdG9rZW5zLCAnYWR2bW9kIDonICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlVG9vTG9uZ1BhcnQodG9rZW5zLCBjaHVua1Bvc2l0aW9uTGlzdCk7XG4gICAgdGhpcy5yZW1vdmVUb29TaG9ydFBhcnQodG9rZW5zLCBjaHVua1Bvc2l0aW9uTGlzdCk7XG5cbiAgICByZXR1cm4gY2h1bmtQb3NpdGlvbkxpc3Q7XG4gIH1cblxuICAvLyBjaHVuayBhZnRlciB2ZXJiLCBrZWVwIGZvbGxvd2luZyBwcnQgaWYgZXhpc3RzXG4gIHByaXZhdGUgaGFuZGxlVmVyYih0b2tlbnM6IGFueSwgaW5kZXg6IG51bWJlciwgY2h1bmtQb3NpdGlvbkxpc3Q6IFJlY29yZDxudW1iZXIsIG51bWJlcj4pIHtcbiAgICBpZiAoaW5kZXggIT09IHRva2Vucy5sZW5ndGggLSAxICYmXG4gICAgICAoKHRoaXMuY2hlY2tMYWJlbChbJ1BSVCcsICdYQ09NUCddLCBpbmRleCArIDEsIHRva2VucykgJiYgdG9rZW5zW2luZGV4ICsgMV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IGluZGV4KVxuICAgICAgICB8fCB0aGlzLmNoZWNrTGFiZWwoWydBQ09NUCddLCBpbmRleCArIDEsIHRva2VucykpXG4gICAgKSB7XG4gICAgICBpZiAoaW5kZXggKyAxIDwgdG9rZW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgaW5kZXggKyAyLCB0b2tlbnMsICd2ZXJiIDonICsgaW5kZXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW5kZXggIT09IHRva2Vucy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGluZGV4ICsgMSwgdG9rZW5zLCAndmVyYiA6JyArIGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBjaGVjayBsZW5ndGggb2Ygc3ViamVjdCBpZiB0b28gbG9uZywgY2h1bmsgc3ViaiAvIHZlcmJcbiAgcHJpdmF0ZSBoYW5kbGVTdWJqKHRva2VuczogYW55LCBpbmRleDogbnVtYmVyLCBjaHVua1Bvc2l0aW9uTGlzdDogUmVjb3JkPG51bWJlciwgbnVtYmVyPikge1xuICAgIGlmICghKGluZGV4IDwgdG9rZW5zLmxlbmd0aCAtIDEgJiYgKCg8c3RyaW5nPnRva2Vuc1tpbmRleCArIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXSkuc3RhcnRzV2l0aCgnXFwnJylcbiAgICAgIHx8ICg8c3RyaW5nPnRva2Vuc1tpbmRleCArIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXSkuc3RhcnRzV2l0aCgnXFzigJknKSkpKSB7XG4gICAgICBjb25zdCB2ZXJiSW5kZXggPSB0b2tlbnNbaW5kZXhdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddO1xuICAgICAgY29uc3QgdmVyYkluZGV4SGVhZCA9IHRva2Vuc1t2ZXJiSW5kZXhdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddO1xuXG4gICAgICBsZXQgayA9IGluZGV4IC0gMTtcbiAgICAgIHdoaWxlIChrID49IDAgJiYgKHRva2Vuc1trXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA9PT0gaW5kZXhcbiAgICAgICAgfHwgdG9rZW5zW2tdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSBrICsgMVxuICAgICAgICB8fCB0b2tlbnNba11bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IHZlcmJJbmRleFxuICAgICAgICB8fCAodG9rZW5zW2tdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSB2ZXJiSW5kZXhIZWFkICYmICF0aGlzLmNoZWNrTGFiZWwoWydQJ10sIGssIHRva2VucykpXG4gICAgICAgIHx8IHRoaXMuY2hlY2tMYWJlbChbJ0FEVk1PRCcsICdBTU9EJywgJ1BTJ10sIGluZGV4IC0gMSwgdG9rZW5zKSkpIHtcbiAgICAgICAgay0tO1xuICAgICAgfVxuICAgICAgaWYgKGsgPiAwKSB7XG4gICAgICAgIHRoaXMuY2hlY2tDQ0FuZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBrICsgMSwgdG9rZW5zLCAnbnN1Ymo6ICcgKyBpbmRleCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2ZXJiSW5kZXggPCBpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggIT09IHRva2Vucy5sZW5ndGggLSAxICYmXG4gICAgICAgICAgKCh0aGlzLmNoZWNrTGFiZWwoWydQUlQnXSwgdmVyYkluZGV4ICsgMSwgdG9rZW5zKSAmJiB0b2tlbnNbdmVyYkluZGV4ICsgMV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IHZlcmJJbmRleClcbiAgICAgICAgICAgIHx8IHRoaXMuY2hlY2tMYWJlbChbJ0FDT01QJ10sIHZlcmJJbmRleCArIDEsIHRva2VucykpXG4gICAgICAgICkge1xuICAgICAgICAgIGlmICh2ZXJiSW5kZXggKyAxIDwgdG9rZW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjaHVua1Bvc2l0aW9uTGlzdFt2ZXJiSW5kZXggKyAyXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHZlcmJJbmRleCAhPT0gdG9rZW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjaHVua1Bvc2l0aW9uTGlzdFt2ZXJiSW5kZXggKyAxXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjb3VudCA9IHZlcmJJbmRleCAtIGluZGV4ICsgMTtcblxuICAgICAgICBpZiAodmVyYkluZGV4IDwgdG9rZW5zLmxlbmd0aCAtIDEgJiZcbiAgICAgICAgICB0aGlzLmNoZWNrTGFiZWwoWydQUlQnXSwgdmVyYkluZGV4ICsgMSwgdG9rZW5zKSAmJiB0b2tlbnNbdmVyYkluZGV4ICsgMV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IGluZGV4KSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgICAgICBsZXQgaiA9IGluZGV4IC0gMTtcbiAgICAgICAgd2hpbGUgKGogPj0gMCAmJiB0b2tlbnNbal1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPD0gdmVyYkluZGV4XG4gICAgICAgICAgJiYgKHRva2Vuc1tqXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA+PSBqKSkge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgai0tO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvdW50ID4gNSkge1xuICAgICAgICAgIGlmICh2ZXJiSW5kZXggPiAyICYmICh0aGlzLmNoZWNrTGFiZWwoWydBVVgnLCAnQVVYUEFTUyddLCB2ZXJiSW5kZXggLSAyLCB0b2tlbnMpKSkge1xuICAgICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgdmVyYkluZGV4IC0gMiwgdG9rZW5zLCAnc3ViaiArIGF1eCAyOicgKyBpbmRleCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh2ZXJiSW5kZXggPiAxICYmICh0aGlzLmNoZWNrTGFiZWwoWydBVVgnLCAnQVVYUEFTUyddLCB2ZXJiSW5kZXggLSAxLCB0b2tlbnMpKSkge1xuICAgICAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCB2ZXJiSW5kZXggLSAxLCB0b2tlbnMsICdzdWJqICsgYXV4IDE6JyArIGluZGV4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmICh2ZXJiSW5kZXggPiAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgdmVyYkluZGV4LCB0b2tlbnMsICdzdWJqOicgKyBpbmRleCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ2NvdW50ICcgKyBpbmRleCArICc6ICcgKyBjb3VudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVUb29Mb25nUGFydCh0b2tlbnM6IGFueSwgY2h1bmtQb3NpdGlvbkxpc3Q6IFJlY29yZDxudW1iZXIsIG51bWJlcj4pIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoY2h1bmtQb3NpdGlvbkxpc3QpO1xuICAgIGxldCBwcmV2aW91c0tleSA9IDA7XG4gICAgbGV0IGtleSwgbGVuZ3RoOiBudW1iZXI7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgIGlmIChjaHVua1Bvc2l0aW9uTGlzdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGxlbmd0aCA9ICtrZXkgLSBwcmV2aW91c0tleTtcbiAgICAgICAgaWYgKGxlbmd0aCA+PSA2KSB7XG4gICAgICAgICAgY29uc3Qgc3RyaW5nbGVuZ3RoID0gK3Rva2Vuc1trZXldWyd0ZXh0J11bJ2JlZ2luT2Zmc2V0J10gLSArdG9rZW5zW3ByZXZpb3VzS2V5XVsndGV4dCddWydiZWdpbk9mZnNldCddO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHN0cmluZ2xlbmd0aCk7XG4gICAgICAgICAgaWYgKHN0cmluZ2xlbmd0aCA+PSAzNSkge1xuICAgICAgICAgICAgY29uc3QgcHJlcExpc3QgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hTGlzdCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHByZXZpb3VzS2V5ICsgMjsgaSA8ICtrZXk7IGkrKykge1xuICAgICAgICAgICAgICBzd2l0Y2ggKHRva2Vuc1tpXVsnZGVwZW5kZW5jeUVkZ2UnXVsnbGFiZWwnXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1BSRVAnOlxuICAgICAgICAgICAgICAgICAgLy8gaWYgKGkgPiAxICYmIHRva2Vuc1tpIC0gMV1bJ3BhcnRPZlNwZWVjaCddWyd0YWcnXSA9PT0gJ1ZFUkInKSB7XG4gICAgICAgICAgICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgaWYgKGkgPiAyICYmICh0aGlzLmNoZWNrTGFiZWwoWydBVVgnLCAnQVVYUEFTUyddLCBpIC0gMSwgdG9rZW5zKSlcbiAgICAgICAgICAgICAgICAgICAgJiYgdG9rZW5zW2kgLSAxXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA+IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvLyBpZiAodG9rZW5zW2ldWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJ29mJykge1xuICAgICAgICAgICAgICAgICAgLy8gICBwcmVwTGlzdC5wdXNoKGkgKyAxKTtcbiAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBwcmVwTGlzdC5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnUCc6XG4gICAgICAgICAgICAgICAgICBpZiAodG9rZW5zW2ldWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJywnIHx8IHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICc7Jykge1xuICAgICAgICAgICAgICAgICAgICBjb21tYUxpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jaHVua1Rvb0xvbmcodG9rZW5zLCBjaHVua1Bvc2l0aW9uTGlzdCwgcHJlcExpc3QsIGNvbW1hTGlzdCwgK2tleSwgcHJldmlvdXNLZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm90IHRvbyBsb25nIDE6ICcgKyBzdHJpbmdsZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91c0tleSA9ICtrZXk7XG4gICAgICB9XG4gICAgfVxuICAgIGtleSA9IHRva2Vucy5sZW5ndGggLSAxO1xuICAgIGxlbmd0aCA9ICtrZXkgLSBwcmV2aW91c0tleSArIDE7XG4gICAgaWYgKGxlbmd0aCA+PSA2KSB7XG4gICAgICBjb25zdCBzdHJpbmdsZW5ndGggPSArdG9rZW5zW2tleV1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXSAtICt0b2tlbnNbcHJldmlvdXNLZXldWyd0ZXh0J11bJ2JlZ2luT2Zmc2V0J107XG4gICAgICBpZiAoc3RyaW5nbGVuZ3RoID49IDM1KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHByZXZpb3VzS2V5ICsgJyB0byAnICsga2V5ICsgJyB0b28gbG9uZzogJyArIHN0cmluZ2xlbmd0aCk7XG4gICAgICAgIGNvbnN0IHByZXBMaXN0ID0gW107XG4gICAgICAgIGNvbnN0IGNvbW1hTGlzdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gcHJldmlvdXNLZXkgKyAyOyBpIDwgK2tleTsgaSsrKSB7XG4gICAgICAgICAgc3dpdGNoICh0b2tlbnNbaV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2xhYmVsJ10pIHtcbiAgICAgICAgICAgIGNhc2UgJ1BSRVAnOlxuICAgICAgICAgICAgICBwcmVwTGlzdC5wdXNoKGkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1AnOlxuICAgICAgICAgICAgICBpZiAodG9rZW5zW2ldWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJywnIHx8IHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICc7Jykge1xuICAgICAgICAgICAgICAgIGNvbW1hTGlzdC5wdXNoKGkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2h1bmtUb29Mb25nKHRva2VucywgY2h1bmtQb3NpdGlvbkxpc3QsIHByZXBMaXN0LCBjb21tYUxpc3QsICtrZXksIHByZXZpb3VzS2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdub3QgdG9vIGxvbmcgMjogJyArIHN0cmluZ2xlbmd0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGNodW5rUG9zaXRpb25MaXN0KTtcbiAgfVxuXG4gIHByaXZhdGUgY2h1bmtUb29Mb25nKHRva2VuczogYW55LCBjaHVua1Bvc2l0aW9uTGlzdDogUmVjb3JkPG51bWJlciwgbnVtYmVyPiwgcHJlcExpc3Q6IG51bWJlcltdLFxuICAgIGNvbW1hTGlzdDogbnVtYmVyW10sIGtleTogbnVtYmVyLCBwcmV2aW91c0tleTogbnVtYmVyKSB7XG4gICAgY29uc29sZS5sb2cocHJldmlvdXNLZXkgKyAnIHRvICcgKyBrZXkgKyAnIHRvbyBsb25nOiAnKTtcblxuICAgIGxldCBjbG9zZXN0ID0gbnVsbDtcbiAgICBpZiAocHJlcExpc3QubGVuZ3RoICE9PSAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhwcmVwTGlzdCk7XG4gICAgICBjb25zdCBnb2FsID0gKGtleSArIHByZXZpb3VzS2V5KSAvIDI7XG4gICAgICBjb25zb2xlLmxvZygnZ29hbDogJyArIGdvYWwpO1xuICAgICAgY2xvc2VzdCA9IHByZXBMaXN0LnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGN1cnIgLSBnb2FsKSA8IE1hdGguYWJzKHByZXYgLSBnb2FsKSA/IGN1cnIgOiBwcmV2KTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGNsb3Nlc3QgPCBrZXkgJiYgY2xvc2VzdCA+IHByZXZpb3VzS2V5KSB7XG4gICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGNsb3Nlc3QsIHRva2VucywgJ3RvbyBsb25nIHBhcnQgcHJlcDogJyArIGNsb3Nlc3QpO1xuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gcHJlcExpc3QuaW5kZXhPZihjbG9zZXN0KTtcbiAgICAgICAgcHJlcExpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNsb3Nlc3QgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29tbWFMaXN0Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBjb25zb2xlLmxvZyhjb21tYUxpc3QpO1xuICAgICAgICBjb25zdCBnb2FsID0gKCtrZXkgKyBwcmV2aW91c0tleSkgLyAyO1xuICAgICAgICBjb25zb2xlLmxvZygnZ29hbDogJyArIGdvYWwpO1xuICAgICAgICBjbG9zZXN0ID0gY29tbWFMaXN0LnJlZHVjZShmdW5jdGlvbiAocHJldiwgY3Vycikge1xuICAgICAgICAgIHJldHVybiAoTWF0aC5hYnMoY3VyciAtIGdvYWwpIDwgTWF0aC5hYnMocHJldiAtIGdvYWwpID8gY3VyciA6IHByZXYpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Nsb3Nlc3Q6ICcgKyBjbG9zZXN0KTtcblxuICAgICAgICBpZiAoY2xvc2VzdCA8IGtleSAmJiBjbG9zZXN0ID4gcHJldmlvdXNLZXkpIHtcbiAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBjbG9zZXN0ICsgMSwgdG9rZW5zLCAndG9vIGxvbmcgcGFydCBjb21tYTonICsgY2xvc2VzdCk7XG5cbiAgICAgICAgICBjb25zdCBpbmRleCA9IGNvbW1hTGlzdC5pbmRleE9mKGNsb3Nlc3QpO1xuICAgICAgICAgIGNvbW1hTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNsb3Nlc3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjbG9zZXN0ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBsZW5ndGgxID0gK3Rva2Vuc1tjbG9zZXN0XVsndGV4dCddWydiZWdpbk9mZnNldCddIC0gK3Rva2Vuc1twcmV2aW91c0tleV1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXTtcbiAgICAgIGNvbnN0IGxlbmd0aDIgPSArdG9rZW5zW2tleV1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXSAtICt0b2tlbnNbY2xvc2VzdF1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXTtcbiAgICAgIGNvbnNvbGUubG9nKCcxOiAnICsgbGVuZ3RoMSArICcgMjogJyArIGxlbmd0aDIpO1xuICAgICAgaWYgKGxlbmd0aDEgPiAzMCkge1xuICAgICAgICB0aGlzLmNodW5rVG9vTG9uZyh0b2tlbnMsIGNodW5rUG9zaXRpb25MaXN0LCBwcmVwTGlzdCwgY29tbWFMaXN0LCBjbG9zZXN0LCBwcmV2aW91c0tleSk7XG4gICAgICB9XG4gICAgICBpZiAobGVuZ3RoMiA+IDMwKSB7XG4gICAgICAgIHRoaXMuY2h1bmtUb29Mb25nKHRva2VucywgY2h1bmtQb3NpdGlvbkxpc3QsIHByZXBMaXN0LCBjb21tYUxpc3QsIGtleSwgY2xvc2VzdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVUb29TaG9ydFBhcnQodG9rZW5zOiBhbnksIGNodW5rUG9zaXRpb25MaXN0OiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+KSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICBsZXQgcHJldmlvdXNLZXkgPSAwO1xuICAgIGxldCBrZXksIGxlbmd0aDtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwga2V5cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgaWYgKGNodW5rUG9zaXRpb25MaXN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgbGVuZ3RoID0gK2tleSAtIHByZXZpb3VzS2V5O1xuICAgICAgICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgaWYgKCh0b2tlbnNbcHJldmlvdXNLZXldWydwYXJ0T2ZTcGVlY2gnXVsndGFnJ10gPT09ICdWRVJCJyAmJiAhdGhpcy5jaGVja0xhYmVsKFsnVk1PRCddLCBwcmV2aW91c0tleSwgdG9rZW5zKSB8fFxuICAgICAgICAgICAgKHByZXZpb3VzS2V5ID4gMCAmJiB0aGlzLmNoZWNrTGFiZWwoWydQJ10sIHByZXZpb3VzS2V5IC0gMSwgdG9rZW5zKSkpKSB7XG4gICAgICAgICAgICBkZWxldGUgY2h1bmtQb3NpdGlvbkxpc3Rba2V5XTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRva2Vuc1twcmV2aW91c0tleV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPCBwcmV2aW91c0tleVxuICAgICAgICAgICAgICB8fCAoIXRoaXMuY2hlY2tMYWJlbChbJ0FEVk1PRCddLCBwcmV2aW91c0tleSwgdG9rZW5zKSAmJiB0aGlzLmlzQ29uanVnYXRlVmVyYihwcmV2aW91c0tleSAtIDEsIHRva2VucykpKSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBjaHVua1Bvc2l0aW9uTGlzdFtwcmV2aW91c0tleV07XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcmV2aW91cycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGVsZXRlIGNodW5rUG9zaXRpb25MaXN0W2tleV07XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXh0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVtb3ZlIGNodW5rIHRvbyBzaG9ydDogJyArIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsZW5ndGggPT09IDIpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNLZXkgIT09IDAgJiYgdGhpcy5jaGVja0xhYmVsKFsnUCddLCAra2V5IC0gMSwgdG9rZW5zKSkge1xuICAgICAgICAgICAgLy8gaWYgKHRva2Vuc1twcmV2aW91c0tleV1bJ3BhcnRPZlNwZWVjaCddWyd0YWcnXSA9PT0gJ1ZFUkInKSB7XG4gICAgICAgICAgICAvLyAgIGRlbGV0ZSBjaHVua1Bvc2l0aW9uTGlzdFtrZXldO1xuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgaWYgKHRva2Vuc1twcmV2aW91c0tleV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPCBwcmV2aW91c0tleSkge1xuICAgICAgICAgICAgZGVsZXRlIGNodW5rUG9zaXRpb25MaXN0W3ByZXZpb3VzS2V5XTtcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgIGRlbGV0ZSBjaHVua1Bvc2l0aW9uTGlzdFtrZXldO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlbW92ZSBjaHVuayB0b28gc2hvcnQ6ICcgKyBrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91c0tleSA9ICtrZXk7XG4gICAgICB9XG4gICAgfVxuICAgIGtleSA9IHRva2Vucy5sZW5ndGggLSAxO1xuICAgIGxlbmd0aCA9ICtrZXkgLSBwcmV2aW91c0tleSArIDE7XG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgZGVsZXRlIGNodW5rUG9zaXRpb25MaXN0W3ByZXZpb3VzS2V5XTtcbiAgICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZW1vdmUgY2h1bmsgdG9vIHNob3J0OiAnICsga2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGxlbmd0aCA9PT0gMikge1xuICAgICAgaWYgKHByZXZpb3VzS2V5ICE9PSAwICYmIHRoaXMuY2hlY2tMYWJlbChbJ1AnXSwgK3ByZXZpb3VzS2V5ICsgMSwgdG9rZW5zKSkge1xuICAgICAgICBkZWxldGUgY2h1bmtQb3NpdGlvbkxpc3RbcHJldmlvdXNLZXldO1xuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdyZW1vdmUgY2h1bmsgdG9vIHNob3J0OiAnICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhjaHVua1Bvc2l0aW9uTGlzdCk7XG4gIH1cblxuICBwcml2YXRlIGFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0OiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+LCBpbmRleDogbnVtYmVyLCB0b2tlbnM6IGFueSwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgaWYgKGluZGV4ID4gMCAmJiBpbmRleCA8IHRva2Vucy5sZW5ndGggLSAxKSB7XG4gICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnYWRkIGNodW5rICcgKyBpbmRleCArICcgOicgKyBtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbmRleCA+IDEgJiYgdGhpcy5jaGVja0xhYmVsKFsnUCddLCBpbmRleCAtIDEsIHRva2VucykgJiZcbiAgICAgICAgKHRva2Vuc1tpbmRleCAtIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJygnIHx8XG4gICAgICAgICAgKCh0b2tlbnNbaW5kZXggLSAxXVsndGV4dCddWydjb250ZW50J10gPT09ICdcIicpICYmIHRva2Vuc1tpbmRleCAtIDFdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddICE9PSBpbmRleCkpKSB7XG4gICAgICAgIGNodW5rUG9zaXRpb25MaXN0W2luZGV4IC0gMV0gPSB0b2tlbnNbaW5kZXggLSAyXVsndGV4dCddWydiZWdpbk9mZnNldCddICsgdG9rZW5zW2luZGV4IC0gMl1bJ3RleHQnXVsnY29udGVudCddLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBqID0gaW5kZXg7XG4gICAgICAgIHdoaWxlIChqIDwgdG9rZW5zLmxlbmd0aCAmJiB0aGlzLmNoZWNrTGFiZWwoWydQJ10sIGosIHRva2VucykpIHtcbiAgICAgICAgICBpZiAoaiA8IHRva2Vucy5sZW5ndGggLSAxICYmICh0b2tlbnNbal1bJ3RleHQnXVsnY29udGVudCddID09PSAnLSdcbiAgICAgICAgICAgIHx8IHRva2Vuc1tqXVsndGV4dCddWydjb250ZW50J10gPT09ICcoJyB8fCB0b2tlbnNbal1bJ3RleHQnXVsnY29udGVudCddID09PSAnXCInKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGorKztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaiA8IHRva2Vucy5sZW5ndGggLSAyICYmIGogPiAwKSB7XG4gICAgICAgICAgaWYgKCg8c3RyaW5nPnRva2Vuc1tqIC0gMV1bJ3RleHQnXVsnY29udGVudCddKS5pbmNsdWRlcygn44CAJykpIHtcbiAgICAgICAgICAgIGNodW5rUG9zaXRpb25MaXN0W2pdID0gdG9rZW5zW2ogLSAxXVsndGV4dCddWydiZWdpbk9mZnNldCddICsgdG9rZW5zW2ogLSAxXVsndGV4dCddWydjb250ZW50J10uc3BsaXQoJ+OAgCcpWzBdLmxlbmd0aDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2h1bmtQb3NpdGlvbkxpc3Rbal0gPSB0b2tlbnNbaiAtIDFdWyd0ZXh0J11bJ2JlZ2luT2Zmc2V0J10gKyB0b2tlbnNbaiAtIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXS5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpZiAodGhpcy5jaGVja0xhYmVsKFsnUCddLCBpbmRleCwgdG9rZW5zKSkge1xuICAgICAgLy8gICBpZiAoaW5kZXggPCB0b2tlbnMubGVuZ3RoIC0gMikge1xuICAgICAgLy8gICAgIGNodW5rUG9zaXRpb25MaXN0W2luZGV4ICsgMV0gPSB0b2tlbnNbaW5kZXggKyAxXVsndGV4dCddWydiZWdpbk9mZnNldCddIC0gMTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vICAgY2h1bmtQb3NpdGlvbkxpc3RbaW5kZXhdID0gdG9rZW5zW2luZGV4XVsndGV4dCddWydiZWdpbk9mZnNldCddIC0gMTtcbiAgICAgIC8vIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQ0NBbmRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdDogUmVjb3JkPG51bWJlciwgbnVtYmVyPiwgaW5kZXg6IG51bWJlciwgdG9rZW5zOiBhbnksIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmNoZWNrTGFiZWwoWydDQyddLCBpbmRleCAtIDEsIHRva2VucykpIHtcbiAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGluZGV4IC0gMSwgdG9rZW5zLCBtZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgaW5kZXgsIHRva2VucywgbWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0xhYmVsKGxhYmVsOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlciwgdG9rZW5zOiBhbnkpIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRva2Vucy5sZW5naHQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IGIgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhYmVsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodG9rZW5zW2luZGV4XVsnZGVwZW5kZW5jeUVkZ2UnXVsnbGFiZWwnXSA9PT0gbGFiZWxbaV0pIHtcbiAgICAgICAgYiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYjtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tEZXBlbmRlbmN5KGhlYWRUb2tlbkluZGV4OiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIHRva2VuczogYW55KSB7XG4gICAgcmV0dXJuIHRva2Vuc1tpbmRleF1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IGhlYWRUb2tlbkluZGV4O1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja1RhZyh0YWc6IHN0cmluZywgaW5kZXg6IG51bWJlciwgdG9rZW5zOiBhbnkpIHtcbiAgICByZXR1cm4gdG9rZW5zW2luZGV4XVsncGFydE9mU3BlZWNoJ11bJ3RhZyddID09PSB0YWc7XG4gIH1cblxuICBwcml2YXRlIGlzQ29uanVnYXRlVmVyYihpbmRleDogbnVtYmVyLCB0b2tlbnM6IGFueSkge1xuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdG9rZW5zLmxlbmdodCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdG9rZW5zW2luZGV4XVsncGFydE9mU3BlZWNoJ11bJ3RhZyddID09PSAnVkVSQicgJiYgKHRva2Vuc1tpbmRleF1bJ3BhcnRPZlNwZWVjaCddWyd0ZW5zZSddICE9PSAnVEVOU0VfVU5LTk9XTidcbiAgICAgIHx8IHRva2Vuc1tpbmRleF1bJ2xlbW1hJ10gIT09IHRva2Vuc1tpbmRleF1bJ3RleHQnXVsnY29udGVudCddKTtcbiAgfVxufVxuIl19