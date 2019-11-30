import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Component, NgModule, defineInjectable, inject } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MglishNlService {
    /**
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
        this.debug = true;
    }
    /**
     * @private
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    request(text, apiKeyGoogle) {
        /** @type {?} */
        const params = new HttpParams().append('key', apiKeyGoogle);
        /** @type {?} */
        const url = 'https://cors-anywhere.herokuapp.com/https://language.googleapis.com/v1beta2/documents:analyzeSyntax';
        /** @type {?} */
        const request = {
            'document': {
                'content': text,
                'type': 'PLAIN_TEXT',
            },
            'encodingType': 'UTF8',
        };
        /** @type {?} */
        const options = { headers: { 'Content-Type': 'application/json' }, params: params };
        return this.http.post(url, JSON.stringify(request), options);
    }
    /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    chunkText(text, apiKeyGoogle) {
        /** @type {?} */
        const textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-').replace(/\…/g, '...');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        (subscriber) => this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        (result) => {
            subscriber.next(this.getTextWithChunk(result, textToChunk));
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        error => {
            subscriber.error(error);
        }))));
    }
    /**
     * @param {?} textArray
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    chunkTextArray(textArray, apiKeyGoogle) {
        /** @type {?} */
        let textToChunk = '';
        for (let i = 0; i < textArray.length; i++) {
            textToChunk += textArray[i] + '　';
        }
        textToChunk = textToChunk.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-').replace(/\…/g, '...');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        (subscriber) => this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        (result) => {
            /** @type {?} */
            const textWithChunk = this.getTextWithChunk(result, textToChunk.replace(/　/g, '|||'));
            /** @type {?} */
            const textChunkArray = textWithChunk.split(/\|{3,}/g);
            textChunkArray.pop();
            subscriber.next(textChunkArray);
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        error => {
            subscriber.error(error);
        }))));
    }
    /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    textWithMitre(text, apiKeyGoogle) {
        /** @type {?} */
        const textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        (subscriber) => this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        (result) => {
            subscriber.next(this.getTextWithMitre(result, textToChunk));
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        error => {
            subscriber.error(error);
        }))));
    }
    /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    textWithBreakLine(text, apiKeyGoogle) {
        /** @type {?} */
        const textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        (subscriber) => this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        (result) => {
            subscriber.next(this.getTextWithBreakLine(result, textToChunk));
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        error => {
            subscriber.error(error);
        }))));
    }
    /**
     * @param {?} text
     * @param {?} apiKeyGoogle
     * @return {?}
     */
    chunkPositionList(text, apiKeyGoogle) {
        /** @type {?} */
        const textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        (subscriber) => this.request(textToChunk, apiKeyGoogle).subscribe((/**
         * @param {?} result
         * @return {?}
         */
        (result) => {
            subscriber.next(this.handle(result, textToChunk));
            subscriber.complete();
        }), (/**
         * @param {?} error
         * @return {?}
         */
        error => {
            subscriber.error(error);
        }))));
    }
    /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    getTextWithMitre(result, text) {
        /** @type {?} */
        const chunkPositionList = this.handle(result, text);
        if (Object.keys(chunkPositionList).length === 0) {
            return '「' + text + '」';
        }
        else {
            /** @type {?} */
            let newText = '';
            /** @type {?} */
            let previousPosition = 0;
            /** @type {?} */
            let fragment = '';
            for (const key in chunkPositionList) {
                if (chunkPositionList.hasOwnProperty(key)) {
                    /** @type {?} */
                    const tmp = text.substring(chunkPositionList[previousPosition], chunkPositionList[key]);
                    /** @type {?} */
                    let countBegin = 0;
                    /** @type {?} */
                    let countEnd = tmp.length - 1;
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
            const tmpLast = text.substring(chunkPositionList[previousPosition], text.length);
            /** @type {?} */
            let count = 0;
            while (count < tmpLast.length && tmpLast.charAt(count) === '\n') {
                count++;
            }
            fragment = count === 0 ? '' : '\n'.repeat(count);
            fragment += '「' + tmpLast.trim() + '」';
            newText = newText + fragment;
            return newText;
        }
    }
    /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    getTextWithBreakLine(result, text) {
        /** @type {?} */
        const chunkPositionList = this.handle(result, text);
        if (Object.keys(chunkPositionList).length === 0) {
            return text;
        }
        else {
            /** @type {?} */
            const part = [];
            /** @type {?} */
            let previousPosition = 0;
            /** @type {?} */
            let fragment;
            for (const key in chunkPositionList) {
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
    }
    /**
     * @private
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    getTextWithChunk(result, text) {
        /** @type {?} */
        const chunkPositionList = this.handle(result, text);
        if (Object.keys(chunkPositionList).length === 0) {
            return text;
        }
        else {
            /** @type {?} */
            const part = [];
            /** @type {?} */
            let previousPosition = 0;
            /** @type {?} */
            let fragment;
            for (const key in chunkPositionList) {
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
    }
    /**
     * @param {?} result
     * @param {?} text
     * @return {?}
     */
    handle(result, text) {
        /** @type {?} */
        const chunkPositionList = {};
        /** @type {?} */
        const tokens = result.tokens;
        for (let i = 0; i < tokens.length; i++) {
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
                    const indexFirst = tokens[i]['dependencyEdge']['headTokenIndex'];
                    if (i < indexFirst) {
                        break;
                    }
                    /** @type {?} */
                    let indexSecond;
                    for (let k = i + 1; k < tokens.length; k++) {
                        if (this.checkLabel(['CONJ'], k, tokens) && tokens[k]['dependencyEdge']['headTokenIndex'] === indexFirst) {
                            indexSecond = k;
                            break;
                        }
                    }
                    if (typeof indexSecond === 'undefined') {
                        break;
                    }
                    /** @type {?} */
                    let count = indexSecond - indexFirst;
                    /** @type {?} */
                    let a = indexFirst - 1;
                    while (a > 0 && tokens[a]['dependencyEdge']['headTokenIndex'] === indexFirst) {
                        count++;
                        a--;
                    }
                    /** @type {?} */
                    let b = indexSecond + 1;
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
    }
    // chunk after verb, keep following prt if exists
    /**
     * @private
     * @param {?} tokens
     * @param {?} index
     * @param {?} chunkPositionList
     * @return {?}
     */
    handleVerb(tokens, index, chunkPositionList) {
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
    }
    // check length of subject if too long, chunk subj / verb
    /**
     * @private
     * @param {?} tokens
     * @param {?} index
     * @param {?} chunkPositionList
     * @return {?}
     */
    handleSubj(tokens, index, chunkPositionList) {
        if (!(index < tokens.length - 1 && (((/** @type {?} */ (tokens[index + 1]['text']['content']))).startsWith('\'')
            || ((/** @type {?} */ (tokens[index + 1]['text']['content']))).startsWith('\’')))) {
            /** @type {?} */
            const verbIndex = tokens[index]['dependencyEdge']['headTokenIndex'];
            /** @type {?} */
            const verbIndexHead = tokens[verbIndex]['dependencyEdge']['headTokenIndex'];
            /** @type {?} */
            let k = index - 1;
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
                let count = verbIndex - index + 1;
                if (verbIndex < tokens.length - 1 &&
                    this.checkLabel(['PRT'], verbIndex + 1, tokens) && tokens[verbIndex + 1]['dependencyEdge']['headTokenIndex'] === index) {
                    count++;
                }
                /** @type {?} */
                let j = index - 1;
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
    }
    /**
     * @private
     * @param {?} tokens
     * @param {?} chunkPositionList
     * @return {?}
     */
    handleTooLongPart(tokens, chunkPositionList) {
        /** @type {?} */
        const keys = Object.keys(chunkPositionList);
        /** @type {?} */
        let previousKey = 0;
        /** @type {?} */
        let key;
        /** @type {?} */
        let length;
        for (let index = 0; index < keys.length; index++) {
            key = keys[index];
            if (chunkPositionList.hasOwnProperty(key)) {
                length = +key - previousKey;
                if (length >= 6) {
                    /** @type {?} */
                    const stringlength = +tokens[key]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
                    console.log(stringlength);
                    if (stringlength >= 35) {
                        /** @type {?} */
                        const prepList = [];
                        /** @type {?} */
                        const commaList = [];
                        for (let i = previousKey + 2; i < +key; i++) {
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
            const stringlength = +tokens[key]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
            if (stringlength >= 35) {
                console.log(previousKey + ' to ' + key + ' too long: ' + stringlength);
                /** @type {?} */
                const prepList = [];
                /** @type {?} */
                const commaList = [];
                for (let i = previousKey + 2; i < +key; i++) {
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
    }
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
    chunkTooLong(tokens, chunkPositionList, prepList, commaList, key, previousKey) {
        console.log(previousKey + ' to ' + key + ' too long: ');
        /** @type {?} */
        let closest = null;
        if (prepList.length !== 0) {
            console.log(prepList);
            /** @type {?} */
            const goal = (key + previousKey) / 2;
            console.log('goal: ' + goal);
            closest = prepList.reduce((/**
             * @param {?} prev
             * @param {?} curr
             * @return {?}
             */
            function (prev, curr) {
                return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
            }));
            if (closest < key && closest > previousKey) {
                this.addChunk(chunkPositionList, closest, tokens, 'too long part prep: ' + closest);
                /** @type {?} */
                const index = prepList.indexOf(closest);
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
                const goal = (+key + previousKey) / 2;
                console.log('goal: ' + goal);
                closest = commaList.reduce((/**
                 * @param {?} prev
                 * @param {?} curr
                 * @return {?}
                 */
                function (prev, curr) {
                    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                }));
                console.log('closest: ' + closest);
                if (closest < key && closest > previousKey) {
                    this.addChunk(chunkPositionList, closest + 1, tokens, 'too long part comma:' + closest);
                    /** @type {?} */
                    const index = commaList.indexOf(closest);
                    commaList.splice(index, 1);
                }
                else {
                    closest = null;
                }
            }
        }
        if (closest !== null) {
            /** @type {?} */
            const length1 = +tokens[closest]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
            /** @type {?} */
            const length2 = +tokens[key]['text']['beginOffset'] - +tokens[closest]['text']['beginOffset'];
            console.log('1: ' + length1 + ' 2: ' + length2);
            if (length1 > 30) {
                this.chunkTooLong(tokens, chunkPositionList, prepList, commaList, closest, previousKey);
            }
            if (length2 > 30) {
                this.chunkTooLong(tokens, chunkPositionList, prepList, commaList, key, closest);
            }
        }
    }
    /**
     * @private
     * @param {?} tokens
     * @param {?} chunkPositionList
     * @return {?}
     */
    removeTooShortPart(tokens, chunkPositionList) {
        /** @type {?} */
        const keys = Object.keys(chunkPositionList);
        /** @type {?} */
        let previousKey = 0;
        /** @type {?} */
        let key;
        /** @type {?} */
        let length;
        for (let index = 0; index < keys.length; index++) {
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
    }
    /**
     * @private
     * @param {?} chunkPositionList
     * @param {?} index
     * @param {?} tokens
     * @param {?} message
     * @return {?}
     */
    addChunk(chunkPositionList, index, tokens, message) {
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
                let j = index;
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
    }
    /**
     * @private
     * @param {?} chunkPositionList
     * @param {?} index
     * @param {?} tokens
     * @param {?} message
     * @return {?}
     */
    checkCCAndChunk(chunkPositionList, index, tokens, message) {
        if (this.checkLabel(['CC'], index - 1, tokens)) {
            this.addChunk(chunkPositionList, index - 1, tokens, message);
        }
        else {
            this.addChunk(chunkPositionList, index, tokens, message);
        }
    }
    /**
     * @private
     * @param {?} label
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    checkLabel(label, index, tokens) {
        if (index < 0 || index >= tokens.lenght) {
            return false;
        }
        /** @type {?} */
        let b = false;
        for (let i = 0; i < label.length; i++) {
            if (tokens[index]['dependencyEdge']['label'] === label[i]) {
                b = true;
                break;
            }
        }
        return b;
    }
    /**
     * @private
     * @param {?} headTokenIndex
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    checkDependency(headTokenIndex, index, tokens) {
        return tokens[index]['dependencyEdge']['headTokenIndex'] === headTokenIndex;
    }
    /**
     * @private
     * @param {?} tag
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    checkTag(tag, index, tokens) {
        return tokens[index]['partOfSpeech']['tag'] === tag;
    }
    /**
     * @private
     * @param {?} index
     * @param {?} tokens
     * @return {?}
     */
    isConjugateVerb(index, tokens) {
        if (index < 0 || index >= tokens.lenght) {
            return false;
        }
        return tokens[index]['partOfSpeech']['tag'] === 'VERB' && (tokens[index]['partOfSpeech']['tense'] !== 'TENSE_UNKNOWN'
            || tokens[index]['lemma'] !== tokens[index]['text']['content']);
    }
}
MglishNlService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
MglishNlService.ctorParameters = () => [
    { type: HttpClient }
];
/** @nocollapse */ MglishNlService.ngInjectableDef = defineInjectable({ factory: function MglishNlService_Factory() { return new MglishNlService(inject(HttpClient)); }, token: MglishNlService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MglishNlComponent {
    constructor() { }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
MglishNlComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-mglish-nl',
                template: `
    <p>
      mglish-nl works!
    </p>
  `
            }] }
];
/** @nocollapse */
MglishNlComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MglishNlModule {
}
MglishNlModule.decorators = [
    { type: NgModule, args: [{
                declarations: [MglishNlComponent],
                imports: [],
                exports: [MglishNlComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { MglishNlService, MglishNlComponent, MglishNlModule };

//# sourceMappingURL=mglish-nl.js.map