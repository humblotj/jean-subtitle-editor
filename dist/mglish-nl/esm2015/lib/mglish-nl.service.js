/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class MglishNlService {
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
/** @nocollapse */ MglishNlService.ngInjectableDef = i0.defineInjectable({ factory: function MglishNlService_Factory() { return new MglishNlService(i0.inject(i1.HttpClient)); }, token: MglishNlService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWdsaXNoLW5sLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9tZ2xpc2gtbmwvIiwic291cmNlcyI6WyJsaWIvbWdsaXNoLW5sLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFNbEMsTUFBTSxPQUFPLGVBQWU7Ozs7SUFHMUIsWUFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUY1QixVQUFLLEdBQUcsSUFBSSxDQUFDO0lBRW1CLENBQUM7Ozs7Ozs7SUFFakMsT0FBTyxDQUFDLElBQVksRUFBRSxZQUFvQjs7Y0FDMUMsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUM7O2NBQ3JELEdBQUcsR0FBRyxxR0FBcUc7O2NBQzNHLE9BQU8sR0FBRztZQUNkLFVBQVUsRUFBRTtnQkFDVixTQUFTLEVBQUUsSUFBSTtnQkFDZixNQUFNLEVBQUUsWUFBWTthQUNyQjtZQUNELGNBQWMsRUFBRSxNQUFNO1NBQ3ZCOztjQUNLLE9BQU8sR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7UUFFbkYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRCxDQUFDOzs7Ozs7SUFFRCxTQUFTLENBQUMsSUFBWSxFQUFFLFlBQW9COztjQUNwQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxD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TyxlQUFlLENBQUMsY0FBc0IsRUFBRSxLQUFhLEVBQUUsTUFBVztRQUN4RSxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssY0FBYyxDQUFDO0lBQzlFLENBQUM7Ozs7Ozs7O0lBRU8sUUFBUSxDQUFDLEdBQVcsRUFBRSxLQUFhLEVBQUUsTUFBVztRQUN0RCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUM7SUFDdEQsQ0FBQzs7Ozs7OztJQUVPLGVBQWUsQ0FBQyxLQUFhLEVBQUUsTUFBVztRQUNoRCxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDdkMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxlQUFlO2VBQ2hILE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDOzs7WUEzcUJGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7OztZQU5RLFVBQVU7Ozs7Ozs7O0lBUWpCLGdDQUFxQjs7Ozs7SUFFVCwrQkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE1nbGlzaE5sU2VydmljZSB7XG4gIHByaXZhdGUgZGVidWcgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkgeyB9XG5cbiAgcHJpdmF0ZSByZXF1ZXN0KHRleHQ6IHN0cmluZywgYXBpS2V5R29vZ2xlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpLmFwcGVuZCgna2V5JywgYXBpS2V5R29vZ2xlKTtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9jb3JzLWFueXdoZXJlLmhlcm9rdWFwcC5jb20vaHR0cHM6Ly9sYW5ndWFnZS5nb29nbGVhcGlzLmNvbS92MWJldGEyL2RvY3VtZW50czphbmFseXplU3ludGF4JztcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xuICAgICAgJ2RvY3VtZW50Jzoge1xuICAgICAgICAnY29udGVudCc6IHRleHQsXG4gICAgICAgICd0eXBlJzogJ1BMQUlOX1RFWFQnLFxuICAgICAgfSxcbiAgICAgICdlbmNvZGluZ1R5cGUnOiAnVVRGOCcsXG4gICAgfTtcbiAgICBjb25zdCBvcHRpb25zID0geyBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSwgcGFyYW1zOiBwYXJhbXMgfTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh1cmwsIEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNodW5rVGV4dCh0ZXh0OiBzdHJpbmcsIGFwaUtleUdvb2dsZTogc3RyaW5nKSB7XG4gICAgY29uc3QgdGV4dFRvQ2h1bmsgPSB0ZXh0LnJlcGxhY2UoL1xc4oCcfFxc4oCdL2csICdcXFwiJykucmVwbGFjZSgvXFzigJkvZywgJ1xcJycpLnJlcGxhY2UoL1xc4oCTL2csICdcXC0nKS5yZXBsYWNlKC9cXOKApi9nLCAnLi4uJyk7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB0aGlzLnJlcXVlc3QodGV4dFRvQ2h1bmssIGFwaUtleUdvb2dsZSkuc3Vic2NyaWJlKFxuICAgICAgKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCh0aGlzLmdldFRleHRXaXRoQ2h1bmsocmVzdWx0LCB0ZXh0VG9DaHVuaykpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3IgPT4ge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGNodW5rVGV4dEFycmF5KHRleHRBcnJheTogc3RyaW5nW10sIGFwaUtleUdvb2dsZTogc3RyaW5nKSB7XG4gICAgbGV0IHRleHRUb0NodW5rID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRleHRUb0NodW5rICs9IHRleHRBcnJheVtpXSArICfjgIAnO1xuICAgIH1cbiAgICB0ZXh0VG9DaHVuayA9IHRleHRUb0NodW5rLnJlcGxhY2UoL1xc4oCcfFxc4oCdL2csICdcXFwiJykucmVwbGFjZSgvXFzigJkvZywgJ1xcJycpLnJlcGxhY2UoL1xc4oCTL2csICdcXC0nKS5yZXBsYWNlKC9cXOKApi9nLCAnLi4uJyk7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB0aGlzLnJlcXVlc3QodGV4dFRvQ2h1bmssIGFwaUtleUdvb2dsZSkuc3Vic2NyaWJlKFxuICAgICAgKHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IHRleHRXaXRoQ2h1bmsgPSB0aGlzLmdldFRleHRXaXRoQ2h1bmsocmVzdWx0LCB0ZXh0VG9DaHVuay5yZXBsYWNlKC/jgIAvZywgJ3x8fCcpKTtcbiAgICAgICAgY29uc3QgdGV4dENodW5rQXJyYXkgPSB0ZXh0V2l0aENodW5rLnNwbGl0KC9cXHx7Myx9L2cpO1xuICAgICAgICB0ZXh0Q2h1bmtBcnJheS5wb3AoKTtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHRleHRDaHVua0FycmF5KTtcbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgfSxcbiAgICAgIGVycm9yID0+IHtcbiAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICB0ZXh0V2l0aE1pdHJlKHRleHQ6IHN0cmluZywgYXBpS2V5R29vZ2xlOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0ZXh0VG9DaHVuayA9IHRleHQucmVwbGFjZSgvXFzigJx8XFzigJ0vZywgJ1xcXCInKS5yZXBsYWNlKC9cXOKAmS9nLCAnXFwnJykucmVwbGFjZSgvXFzigJMvZywgJ1xcLScpO1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4gdGhpcy5yZXF1ZXN0KHRleHRUb0NodW5rLCBhcGlLZXlHb29nbGUpLnN1YnNjcmliZShcbiAgICAgIChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy5nZXRUZXh0V2l0aE1pdHJlKHJlc3VsdCwgdGV4dFRvQ2h1bmspKTtcbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgfSxcbiAgICAgIGVycm9yID0+IHtcbiAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICB0ZXh0V2l0aEJyZWFrTGluZSh0ZXh0OiBzdHJpbmcsIGFwaUtleUdvb2dsZTogc3RyaW5nKSB7XG4gICAgY29uc3QgdGV4dFRvQ2h1bmsgPSB0ZXh0LnJlcGxhY2UoL1xc4oCcfFxc4oCdL2csICdcXFwiJykucmVwbGFjZSgvXFzigJkvZywgJ1xcJycpLnJlcGxhY2UoL1xc4oCTL2csICdcXC0nKTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHRoaXMucmVxdWVzdCh0ZXh0VG9DaHVuaywgYXBpS2V5R29vZ2xlKS5zdWJzY3JpYmUoXG4gICAgICAocmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMuZ2V0VGV4dFdpdGhCcmVha0xpbmUocmVzdWx0LCB0ZXh0VG9DaHVuaykpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3IgPT4ge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGNodW5rUG9zaXRpb25MaXN0KHRleHQ6IHN0cmluZywgYXBpS2V5R29vZ2xlOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0ZXh0VG9DaHVuayA9IHRleHQucmVwbGFjZSgvXFzigJx8XFzigJ0vZywgJ1xcXCInKS5yZXBsYWNlKC9cXOKAmS9nLCAnXFwnJykucmVwbGFjZSgvXFzigJMvZywgJ1xcLScpO1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4gdGhpcy5yZXF1ZXN0KHRleHRUb0NodW5rLCBhcGlLZXlHb29nbGUpLnN1YnNjcmliZShcbiAgICAgIChyZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy5oYW5kbGUocmVzdWx0LCB0ZXh0VG9DaHVuaykpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3IgPT4ge1xuICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBnZXRUZXh0V2l0aE1pdHJlKHJlc3VsdDogeyBzZW50ZW5jZXM6IFtdLCB0b2tlbnM6IFtdLCBsYW5ndWFnZTogc3RyaW5nIH0sIHRleHQ6IHN0cmluZykge1xuICAgIGNvbnN0IGNodW5rUG9zaXRpb25MaXN0ID0gdGhpcy5oYW5kbGUocmVzdWx0LCB0ZXh0KTtcbiAgICBpZiAoT2JqZWN0LmtleXMoY2h1bmtQb3NpdGlvbkxpc3QpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuICfjgIwnICsgdGV4dCArICfjgI0nO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3VGV4dCA9ICcnO1xuICAgICAgbGV0IHByZXZpb3VzUG9zaXRpb24gPSAwO1xuICAgICAgbGV0IGZyYWdtZW50ID0gJyc7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBjaHVua1Bvc2l0aW9uTGlzdCkge1xuICAgICAgICBpZiAoY2h1bmtQb3NpdGlvbkxpc3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGNvbnN0IHRtcCA9IHRleHQuc3Vic3RyaW5nKGNodW5rUG9zaXRpb25MaXN0W3ByZXZpb3VzUG9zaXRpb25dLCBjaHVua1Bvc2l0aW9uTGlzdFtrZXldKTtcbiAgICAgICAgICBsZXQgY291bnRCZWdpbiA9IDA7XG4gICAgICAgICAgbGV0IGNvdW50RW5kID0gdG1wLmxlbmd0aCAtIDE7XG4gICAgICAgICAgd2hpbGUgKGNvdW50QmVnaW4gPCB0bXAubGVuZ3RoICYmIHRtcC5jaGFyQXQoY291bnRCZWdpbikgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICBjb3VudEJlZ2luKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHdoaWxlIChjb3VudEVuZCA+IDAgJiYgdG1wLmNoYXJBdChjb3VudEVuZCkgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICBjb3VudEVuZC0tO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudEVuZCA9IHRtcC5sZW5ndGggLSAxIC0gY291bnRFbmQ7XG5cbiAgICAgICAgICBmcmFnbWVudCA9ICdcXG4nLnJlcGVhdChjb3VudEJlZ2luKTtcbiAgICAgICAgICBmcmFnbWVudCArPSAn44CMJztcbiAgICAgICAgICBmcmFnbWVudCArPSB0bXAudHJpbSgpO1xuICAgICAgICAgIGZyYWdtZW50ICs9ICfjgI0nICsgJ1xcbicucmVwZWF0KGNvdW50RW5kKTtcbiAgICAgICAgICBpZiAoY291bnRFbmQgPT09IDApIHtcbiAgICAgICAgICAgIGZyYWdtZW50ICs9ICfjgIAnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5ld1RleHQgPSBuZXdUZXh0ICsgZnJhZ21lbnQ7XG4gICAgICAgICAgcHJldmlvdXNQb3NpdGlvbiA9ICtrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHRtcExhc3QgPSB0ZXh0LnN1YnN0cmluZyhjaHVua1Bvc2l0aW9uTGlzdFtwcmV2aW91c1Bvc2l0aW9uXSwgdGV4dC5sZW5ndGgpO1xuICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgIHdoaWxlIChjb3VudCA8IHRtcExhc3QubGVuZ3RoICYmIHRtcExhc3QuY2hhckF0KGNvdW50KSA9PT0gJ1xcbicpIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cblxuICAgICAgZnJhZ21lbnQgPSBjb3VudCA9PT0gMCA/ICcnIDogJ1xcbicucmVwZWF0KGNvdW50KTtcbiAgICAgIGZyYWdtZW50ICs9ICfjgIwnICsgdG1wTGFzdC50cmltKCkgKyAn44CNJztcbiAgICAgIG5ld1RleHQgPSBuZXdUZXh0ICsgZnJhZ21lbnQ7XG4gICAgICByZXR1cm4gbmV3VGV4dDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRleHRXaXRoQnJlYWtMaW5lKHJlc3VsdDogeyBzZW50ZW5jZXM6IFtdLCB0b2tlbnM6IFtdLCBsYW5ndWFnZTogc3RyaW5nIH0sIHRleHQ6IHN0cmluZykge1xuICAgIGNvbnN0IGNodW5rUG9zaXRpb25MaXN0ID0gdGhpcy5oYW5kbGUocmVzdWx0LCB0ZXh0KTtcbiAgICBpZiAoT2JqZWN0LmtleXMoY2h1bmtQb3NpdGlvbkxpc3QpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBhcnQgPSBbXTtcbiAgICAgIGxldCBwcmV2aW91c1Bvc2l0aW9uID0gMDtcbiAgICAgIGxldCBmcmFnbWVudDogc3RyaW5nO1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY2h1bmtQb3NpdGlvbkxpc3QpIHtcbiAgICAgICAgaWYgKGNodW5rUG9zaXRpb25MaXN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBmcmFnbWVudCA9IHRleHQuc3Vic3RyaW5nKGNodW5rUG9zaXRpb25MaXN0W3ByZXZpb3VzUG9zaXRpb25dLCBjaHVua1Bvc2l0aW9uTGlzdFtrZXldKTtcbiAgICAgICAgICBwYXJ0LnB1c2goZnJhZ21lbnQpO1xuICAgICAgICAgIHByZXZpb3VzUG9zaXRpb24gPSAra2V5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmcmFnbWVudCA9IHRleHQuc3Vic3RyaW5nKGNodW5rUG9zaXRpb25MaXN0W3ByZXZpb3VzUG9zaXRpb25dLCB0ZXh0Lmxlbmd0aCk7XG4gICAgICBwYXJ0LnB1c2goZnJhZ21lbnQpO1xuICAgICAgY29uc29sZS5sb2cocGFydCk7XG4gICAgICByZXR1cm4gcGFydC5qb2luKCdcXG4nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldFRleHRXaXRoQ2h1bmsocmVzdWx0OiB7IHNlbnRlbmNlczogW10sIHRva2VuczogW10sIGxhbmd1YWdlOiBzdHJpbmcgfSwgdGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgY2h1bmtQb3NpdGlvbkxpc3QgPSB0aGlzLmhhbmRsZShyZXN1bHQsIHRleHQpO1xuICAgIGlmIChPYmplY3Qua2V5cyhjaHVua1Bvc2l0aW9uTGlzdCkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcGFydCA9IFtdO1xuICAgICAgbGV0IHByZXZpb3VzUG9zaXRpb24gPSAwO1xuICAgICAgbGV0IGZyYWdtZW50OiBzdHJpbmc7XG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBjaHVua1Bvc2l0aW9uTGlzdCkge1xuICAgICAgICBpZiAoY2h1bmtQb3NpdGlvbkxpc3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGZyYWdtZW50ID0gdGV4dC5zdWJzdHJpbmcoY2h1bmtQb3NpdGlvbkxpc3RbcHJldmlvdXNQb3NpdGlvbl0sIGNodW5rUG9zaXRpb25MaXN0W2tleV0pO1xuICAgICAgICAgIHBhcnQucHVzaChmcmFnbWVudCk7XG4gICAgICAgICAgcHJldmlvdXNQb3NpdGlvbiA9ICtrZXk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZyYWdtZW50ID0gdGV4dC5zdWJzdHJpbmcoY2h1bmtQb3NpdGlvbkxpc3RbcHJldmlvdXNQb3NpdGlvbl0sIHRleHQubGVuZ3RoKTtcbiAgICAgIHBhcnQucHVzaChmcmFnbWVudCk7XG4gICAgICBjb25zb2xlLmxvZyhwYXJ0KTtcbiAgICAgIHJldHVybiBwYXJ0LmpvaW4oJ3wnKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGUocmVzdWx0OiB7IHNlbnRlbmNlczogW10sIHRva2VuczogW10sIGxhbmd1YWdlOiBzdHJpbmcgfSwgdGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgY2h1bmtQb3NpdGlvbkxpc3Q6IFJlY29yZDxudW1iZXIsIG51bWJlcj4gPSB7fTtcbiAgICBjb25zdCB0b2tlbnMgPSByZXN1bHQudG9rZW5zO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN3aXRjaCAodG9rZW5zW2ldWydkZXBlbmRlbmN5RWRnZSddWydsYWJlbCddKSB7XG4gICAgICAgIGNhc2UgJ1JPT1QnOlxuICAgICAgICAgIHRoaXMuaGFuZGxlVmVyYih0b2tlbnMsIGksIGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQ0NPTVAnOlxuICAgICAgICAgIHRoaXMuaGFuZGxlVmVyYih0b2tlbnMsIGksIGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUkNNT0QnOlxuICAgICAgICAgIHRoaXMuaGFuZGxlVmVyYih0b2tlbnMsIGksIGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQ09OSic6XG4gICAgICAgICAgaWYgKHRoaXMuaXNDb25qdWdhdGVWZXJiKGksIHRva2VucykgfHwgdG9rZW5zW3Rva2Vuc1tpXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2xhYmVsJ10gPT09ICdST09UJ1xuICAgICAgICAgICAgfHwgdG9rZW5zW3Rva2Vuc1tpXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2xhYmVsJ10gPT09ICdDQ09NUCdcbiAgICAgICAgICAgIHx8IHRva2Vuc1t0b2tlbnNbaV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J11dWydkZXBlbmRlbmN5RWRnZSddWydsYWJlbCddID09PSAnUkNNT0QnXG4gICAgICAgICAgICB8fCB0b2tlbnNbdG9rZW5zW2ldWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddXVsnZGVwZW5kZW5jeUVkZ2UnXVsnbGFiZWwnXSA9PT0gJ0FEVkNMJ1xuICAgICAgICAgICAgfHwgdG9rZW5zW3Rva2Vuc1tpXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2xhYmVsJ10gPT09ICdQQVJBVEFYSVMnKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVZlcmIodG9rZW5zLCBpLCBjaHVua1Bvc2l0aW9uTGlzdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdQQVJBVEFYSVMnOlxuICAgICAgICAgIGlmICh0aGlzLmlzQ29uanVnYXRlVmVyYihpLCB0b2tlbnMpKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVZlcmIodG9rZW5zLCBpLCBjaHVua1Bvc2l0aW9uTGlzdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdBRFZDTCc6XG4gICAgICAgICAgaWYgKHRva2Vuc1tpXVsncGFydE9mU3BlZWNoJ11bJ3RhZyddID09PSAnVkVSQicpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlVmVyYih0b2tlbnMsIGksIGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIGFjb21wIGV4YW1wbGUgOiBiZWluZyBhYmxlLCBjdXQgYWZ0ZXIgYWNvbXAgaWYgZXhpc3RcbiAgICAgICAgY2FzZSAnUENPTVAnOlxuICAgICAgICAgIGlmIChpID4gMSAmJiBpIDwgdG9rZW5zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIGlmIChpIDwgdG9rZW5zLmxlbmd0aCAtIDIgJiYgdGhpcy5jaGVja0xhYmVsKFsnQUNPTVAnXSwgaSArIDEsIHRva2VucykpIHtcbiAgICAgICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgaSArIDIsIHRva2VucywgJ3Bjb21wICsgYWNvbXA6JyArIGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgaSArIDEsIHRva2VucywgJ3Bjb21wOicgKyBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1BSRVAnOlxuICAgICAgICAgIC8vIGNoZWNrIGlmIHByZXZpb3VzIHdvcmQgaXMgcmVsYXRlZCwgY2h1bmsgaWYgbm90XG4gICAgICAgICAgLy8gc3BlY2lhbCBydWxlczogYnJlYWsgaWYgcHJldmlvdXMgd29yZCA9IGF1eFxuICAgICAgICAgIC8vIGNodW5rIGJlZm9yZSBwcmV2aW91cyB3b3JkcyBpZiBwcmV2aW91cyB3b3JkID0gbXdlXG4gICAgICAgICAgaWYgKGkgPiAyICYmICh0aGlzLmNoZWNrTGFiZWwoWydBVVgnLCAnQVVYUEFTUyddLCBpIC0gMSwgdG9rZW5zKVxuICAgICAgICAgICAgJiYgdG9rZW5zW2kgLSAxXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA+IGkpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGkgPiAyICYmICgodGhpcy5jaGVja0xhYmVsKFsnTVdFJ10sIGkgLSAxLCB0b2tlbnMpICYmIHRva2Vuc1tpIC0gMV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IGkpKSkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0NDQW5kQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGkgLSAxLCB0b2tlbnMsICdwcmVwIG13ZTonICsgaSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGkgPiAwICYmIHRva2Vuc1tpXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSAhPT0gaSAtIDEgJiZcbiAgICAgICAgICAgIHRva2Vuc1tpIC0gMV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gIT09IGkpIHtcbiAgICAgICAgICAgIGlmIChpID4gMSAmJiB0aGlzLmlzQ29uanVnYXRlVmVyYihpIC0gMiwgdG9rZW5zKSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tDQ0FuZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpLCB0b2tlbnMsICdwcmVwOicgKyBpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ01BUksnOlxuICAgICAgICAgIGlmIChpID4gMSkge1xuICAgICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgaSwgdG9rZW5zLCAnbWFyazogJyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTlNVQkonOlxuICAgICAgICAgIHRoaXMuaGFuZGxlU3Viaih0b2tlbnMsIGksIGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTlNVQkpQQVNTJzpcbiAgICAgICAgICB0aGlzLmhhbmRsZVN1YmoodG9rZW5zLCBpLCBjaHVua1Bvc2l0aW9uTGlzdCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1AnOlxuICAgICAgICAgIGlmICh0b2tlbnNbaV1bJ3RleHQnXVsnY29udGVudCddID09PSAnLicgfHwgdG9rZW5zW2ldWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJyEnIHx8IHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICc/Jykge1xuICAgICAgICAgICAgaWYgKGkgPCB0b2tlbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b2tlbnNbaSArIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJy0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpIDwgdG9rZW5zLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgJiYgISh0b2tlbnNbaSArIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJy4nXG4gICAgICAgICAgICAgICAgfHwgdG9rZW5zW2kgKyAxXVsndGV4dCddWydjb250ZW50J10gPT09ICchJ1xuICAgICAgICAgICAgICAgIHx8IHRva2Vuc1tpICsgMV1bJ3RleHQnXVsnY29udGVudCddID09PSAnPydcbiAgICAgICAgICAgICAgICB8fCB0b2tlbnNbaSArIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJy0nKSkge1xuICAgICAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpICsgMSwgdG9rZW5zLCAncHVuY3R1YXRpb246ICcgKyBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0NDJzpcbiAgICAgICAgICAvLyBjaHVuayBpZiB3b3JkcyBiZWhpbmQgYW5kIGFmdGVyIHRvbyBsb25nXG4gICAgICAgICAgY29uc3QgaW5kZXhGaXJzdCA9IHRva2Vuc1tpXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXTtcbiAgICAgICAgICBpZiAoaSA8IGluZGV4Rmlyc3QpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgaW5kZXhTZWNvbmQ6IG51bWJlcjtcbiAgICAgICAgICBmb3IgKGxldCBrID0gaSArIDE7IGsgPCB0b2tlbnMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrTGFiZWwoWydDT05KJ10sIGssIHRva2VucykgJiYgdG9rZW5zW2tdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSBpbmRleEZpcnN0KSB7XG4gICAgICAgICAgICAgIGluZGV4U2Vjb25kID0gaztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgaW5kZXhTZWNvbmQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGNvdW50ID0gaW5kZXhTZWNvbmQgLSBpbmRleEZpcnN0O1xuICAgICAgICAgIGxldCBhID0gaW5kZXhGaXJzdCAtIDE7XG4gICAgICAgICAgd2hpbGUgKGEgPiAwICYmIHRva2Vuc1thXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA9PT0gaW5kZXhGaXJzdCkge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIGEtLTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGIgPSBpbmRleFNlY29uZCArIDE7XG4gICAgICAgICAgd2hpbGUgKGIgPiB0b2tlbnMubGVuZ3RoIC0gMSAmJiB0b2tlbnNbYl1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IGluZGV4U2Vjb25kKSB7XG4gICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgYisrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY291bnQgPiAyKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpLCB0b2tlbnMsICdjYyA6JyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQVVYJzpcbiAgICAgICAgICAvLyBjaHVuayBpZiBmb2xsb3dpbmcgaXMgdmVyYiwgZXhhbXBsZSAndG8gZG8nXG4gICAgICAgICAgaWYgKGkgPiAwICYmIGkgPCB0b2tlbnMubGVuZ3RoIC0gMiAmJiB0b2tlbnNbaV1bJ3BhcnRPZlNwZWVjaCddWyd0YWcnXSA9PT0gJ1BSVCdcbiAgICAgICAgICAgICYmIHRva2Vuc1tpICsgMV1bJ3BhcnRPZlNwZWVjaCddWyd0YWcnXSA9PT0gJ1ZFUkInKSB7XG4gICAgICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpLCB0b2tlbnMsICdhdXggOicgKyBpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1ZNT0QnOlxuICAgICAgICAgIC8vIGNodW5rIGJlZm9yZSB2bW9kIGlmIHByZXZpb3VzIHdvcmQgbm90IHZlcmJcbiAgICAgICAgICBpZiAoaSA+IDIgJiYgdG9rZW5zW2kgLSAxXVsncGFydE9mU3BlZWNoJ11bJ3RhZyddICE9PSAnUFJUJykge1xuICAgICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgaSwgdG9rZW5zLCAndm1vZCA6JyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQURWTU9EJzpcbiAgICAgICAgICAvLyBjaHVuayBiZWZvcmUgdm1vZCBpZiBwcmV2aW91cyB3b3JkIG5vdCB2ZXJiXG4gICAgICAgICAgaWYgKGkgPiAyICYmICh0b2tlbnNbaV1bJ3RleHQnXVsnY29udGVudCddID09PSAnYXMnXG4gICAgICAgICAgICB8fCB0b2tlbnNbaV1bJ3RleHQnXVsnY29udGVudCddID09PSAnd2hlbicgfHwgdG9rZW5zW2ldWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJ3doZXJlJykpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGksIHRva2VucywgJ2Fkdm1vZCA6JyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZVRvb0xvbmdQYXJ0KHRva2VucywgY2h1bmtQb3NpdGlvbkxpc3QpO1xuICAgIHRoaXMucmVtb3ZlVG9vU2hvcnRQYXJ0KHRva2VucywgY2h1bmtQb3NpdGlvbkxpc3QpO1xuXG4gICAgcmV0dXJuIGNodW5rUG9zaXRpb25MaXN0O1xuICB9XG5cbiAgLy8gY2h1bmsgYWZ0ZXIgdmVyYiwga2VlcCBmb2xsb3dpbmcgcHJ0IGlmIGV4aXN0c1xuICBwcml2YXRlIGhhbmRsZVZlcmIodG9rZW5zOiBhbnksIGluZGV4OiBudW1iZXIsIGNodW5rUG9zaXRpb25MaXN0OiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+KSB7XG4gICAgaWYgKGluZGV4ICE9PSB0b2tlbnMubGVuZ3RoIC0gMSAmJlxuICAgICAgKCh0aGlzLmNoZWNrTGFiZWwoWydQUlQnLCAnWENPTVAnXSwgaW5kZXggKyAxLCB0b2tlbnMpICYmIHRva2Vuc1tpbmRleCArIDFdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSBpbmRleClcbiAgICAgICAgfHwgdGhpcy5jaGVja0xhYmVsKFsnQUNPTVAnXSwgaW5kZXggKyAxLCB0b2tlbnMpKVxuICAgICkge1xuICAgICAgaWYgKGluZGV4ICsgMSA8IHRva2Vucy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGluZGV4ICsgMiwgdG9rZW5zLCAndmVyYiA6JyArIGluZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGluZGV4ICE9PSB0b2tlbnMubGVuZ3RoIC0gMSkge1xuICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpbmRleCArIDEsIHRva2VucywgJ3ZlcmIgOicgKyBpbmRleCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gY2hlY2sgbGVuZ3RoIG9mIHN1YmplY3QgaWYgdG9vIGxvbmcsIGNodW5rIHN1YmogLyB2ZXJiXG4gIHByaXZhdGUgaGFuZGxlU3Viaih0b2tlbnM6IGFueSwgaW5kZXg6IG51bWJlciwgY2h1bmtQb3NpdGlvbkxpc3Q6IFJlY29yZDxudW1iZXIsIG51bWJlcj4pIHtcbiAgICBpZiAoIShpbmRleCA8IHRva2Vucy5sZW5ndGggLSAxICYmICgoPHN0cmluZz50b2tlbnNbaW5kZXggKyAxXVsndGV4dCddWydjb250ZW50J10pLnN0YXJ0c1dpdGgoJ1xcJycpXG4gICAgICB8fCAoPHN0cmluZz50b2tlbnNbaW5kZXggKyAxXVsndGV4dCddWydjb250ZW50J10pLnN0YXJ0c1dpdGgoJ1xc4oCZJykpKSkge1xuICAgICAgY29uc3QgdmVyYkluZGV4ID0gdG9rZW5zW2luZGV4XVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXTtcbiAgICAgIGNvbnN0IHZlcmJJbmRleEhlYWQgPSB0b2tlbnNbdmVyYkluZGV4XVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXTtcblxuICAgICAgbGV0IGsgPSBpbmRleCAtIDE7XG4gICAgICB3aGlsZSAoayA+PSAwICYmICh0b2tlbnNba11bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPT09IGluZGV4XG4gICAgICAgIHx8IHRva2Vuc1trXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA9PT0gayArIDFcbiAgICAgICAgfHwgdG9rZW5zW2tdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSB2ZXJiSW5kZXhcbiAgICAgICAgfHwgKHRva2Vuc1trXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSA9PT0gdmVyYkluZGV4SGVhZCAmJiAhdGhpcy5jaGVja0xhYmVsKFsnUCddLCBrLCB0b2tlbnMpKVxuICAgICAgICB8fCB0aGlzLmNoZWNrTGFiZWwoWydBRFZNT0QnLCAnQU1PRCcsICdQUyddLCBpbmRleCAtIDEsIHRva2VucykpKSB7XG4gICAgICAgIGstLTtcbiAgICAgIH1cbiAgICAgIGlmIChrID4gMCkge1xuICAgICAgICB0aGlzLmNoZWNrQ0NBbmRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgayArIDEsIHRva2VucywgJ25zdWJqOiAnICsgaW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodmVyYkluZGV4IDwgaW5kZXgpIHtcbiAgICAgICAgaWYgKGluZGV4ICE9PSB0b2tlbnMubGVuZ3RoIC0gMSAmJlxuICAgICAgICAgICgodGhpcy5jaGVja0xhYmVsKFsnUFJUJ10sIHZlcmJJbmRleCArIDEsIHRva2VucykgJiYgdG9rZW5zW3ZlcmJJbmRleCArIDFdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSB2ZXJiSW5kZXgpXG4gICAgICAgICAgICB8fCB0aGlzLmNoZWNrTGFiZWwoWydBQ09NUCddLCB2ZXJiSW5kZXggKyAxLCB0b2tlbnMpKVxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAodmVyYkluZGV4ICsgMSA8IHRva2Vucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBkZWxldGUgY2h1bmtQb3NpdGlvbkxpc3RbdmVyYkluZGV4ICsgMl07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2ZXJiSW5kZXggIT09IHRva2Vucy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBkZWxldGUgY2h1bmtQb3NpdGlvbkxpc3RbdmVyYkluZGV4ICsgMV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY291bnQgPSB2ZXJiSW5kZXggLSBpbmRleCArIDE7XG5cbiAgICAgICAgaWYgKHZlcmJJbmRleCA8IHRva2Vucy5sZW5ndGggLSAxICYmXG4gICAgICAgICAgdGhpcy5jaGVja0xhYmVsKFsnUFJUJ10sIHZlcmJJbmRleCArIDEsIHRva2VucykgJiYgdG9rZW5zW3ZlcmJJbmRleCArIDFdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSBpbmRleCkge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGogPSBpbmRleCAtIDE7XG4gICAgICAgIHdoaWxlIChqID49IDAgJiYgdG9rZW5zW2pdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddIDw9IHZlcmJJbmRleFxuICAgICAgICAgICYmICh0b2tlbnNbal1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPj0gaikpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIGotLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb3VudCA+IDUpIHtcbiAgICAgICAgICBpZiAodmVyYkluZGV4ID4gMiAmJiAodGhpcy5jaGVja0xhYmVsKFsnQVVYJywgJ0FVWFBBU1MnXSwgdmVyYkluZGV4IC0gMiwgdG9rZW5zKSkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIHZlcmJJbmRleCAtIDIsIHRva2VucywgJ3N1YmogKyBhdXggMjonICsgaW5kZXgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodmVyYkluZGV4ID4gMSAmJiAodGhpcy5jaGVja0xhYmVsKFsnQVVYJywgJ0FVWFBBU1MnXSwgdmVyYkluZGV4IC0gMSwgdG9rZW5zKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgdmVyYkluZGV4IC0gMSwgdG9rZW5zLCAnc3ViaiArIGF1eCAxOicgKyBpbmRleCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAodmVyYkluZGV4ID4gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIHZlcmJJbmRleCwgdG9rZW5zLCAnc3ViajonICsgaW5kZXgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb3VudCAnICsgaW5kZXggKyAnOiAnICsgY291bnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlVG9vTG9uZ1BhcnQodG9rZW5zOiBhbnksIGNodW5rUG9zaXRpb25MaXN0OiBSZWNvcmQ8bnVtYmVyLCBudW1iZXI+KSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGNodW5rUG9zaXRpb25MaXN0KTtcbiAgICBsZXQgcHJldmlvdXNLZXkgPSAwO1xuICAgIGxldCBrZXksIGxlbmd0aDogbnVtYmVyO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBrZXlzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICBpZiAoY2h1bmtQb3NpdGlvbkxpc3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBsZW5ndGggPSAra2V5IC0gcHJldmlvdXNLZXk7XG4gICAgICAgIGlmIChsZW5ndGggPj0gNikge1xuICAgICAgICAgIGNvbnN0IHN0cmluZ2xlbmd0aCA9ICt0b2tlbnNba2V5XVsndGV4dCddWydiZWdpbk9mZnNldCddIC0gK3Rva2Vuc1twcmV2aW91c0tleV1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzdHJpbmdsZW5ndGgpO1xuICAgICAgICAgIGlmIChzdHJpbmdsZW5ndGggPj0gMzUpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXBMaXN0ID0gW107XG4gICAgICAgICAgICBjb25zdCBjb21tYUxpc3QgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBwcmV2aW91c0tleSArIDI7IGkgPCAra2V5OyBpKyspIHtcbiAgICAgICAgICAgICAgc3dpdGNoICh0b2tlbnNbaV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2xhYmVsJ10pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdQUkVQJzpcbiAgICAgICAgICAgICAgICAgIC8vIGlmIChpID4gMSAmJiB0b2tlbnNbaSAtIDFdWydwYXJ0T2ZTcGVlY2gnXVsndGFnJ10gPT09ICdWRVJCJykge1xuICAgICAgICAgICAgICAgICAgLy8gICBicmVhaztcbiAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgIGlmIChpID4gMiAmJiAodGhpcy5jaGVja0xhYmVsKFsnQVVYJywgJ0FVWFBBU1MnXSwgaSAtIDEsIHRva2VucykpXG4gICAgICAgICAgICAgICAgICAgICYmIHRva2Vuc1tpIC0gMV1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2hlYWRUb2tlbkluZGV4J10gPiBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgLy8gaWYgKHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICdvZicpIHtcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJlcExpc3QucHVzaChpICsgMSk7XG4gICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcHJlcExpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1AnOlxuICAgICAgICAgICAgICAgICAgaWYgKHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICcsJyB8fCB0b2tlbnNbaV1bJ3RleHQnXVsnY29udGVudCddID09PSAnOycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tbWFMaXN0LnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2h1bmtUb29Mb25nKHRva2VucywgY2h1bmtQb3NpdGlvbkxpc3QsIHByZXBMaXN0LCBjb21tYUxpc3QsICtrZXksIHByZXZpb3VzS2V5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25vdCB0b28gbG9uZyAxOiAnICsgc3RyaW5nbGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXNLZXkgPSAra2V5O1xuICAgICAgfVxuICAgIH1cbiAgICBrZXkgPSB0b2tlbnMubGVuZ3RoIC0gMTtcbiAgICBsZW5ndGggPSAra2V5IC0gcHJldmlvdXNLZXkgKyAxO1xuICAgIGlmIChsZW5ndGggPj0gNikge1xuICAgICAgY29uc3Qgc3RyaW5nbGVuZ3RoID0gK3Rva2Vuc1trZXldWyd0ZXh0J11bJ2JlZ2luT2Zmc2V0J10gLSArdG9rZW5zW3ByZXZpb3VzS2V5XVsndGV4dCddWydiZWdpbk9mZnNldCddO1xuICAgICAgaWYgKHN0cmluZ2xlbmd0aCA+PSAzNSkge1xuICAgICAgICBjb25zb2xlLmxvZyhwcmV2aW91c0tleSArICcgdG8gJyArIGtleSArICcgdG9vIGxvbmc6ICcgKyBzdHJpbmdsZW5ndGgpO1xuICAgICAgICBjb25zdCBwcmVwTGlzdCA9IFtdO1xuICAgICAgICBjb25zdCBjb21tYUxpc3QgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHByZXZpb3VzS2V5ICsgMjsgaSA8ICtrZXk7IGkrKykge1xuICAgICAgICAgIHN3aXRjaCAodG9rZW5zW2ldWydkZXBlbmRlbmN5RWRnZSddWydsYWJlbCddKSB7XG4gICAgICAgICAgICBjYXNlICdQUkVQJzpcbiAgICAgICAgICAgICAgcHJlcExpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdQJzpcbiAgICAgICAgICAgICAgaWYgKHRva2Vuc1tpXVsndGV4dCddWydjb250ZW50J10gPT09ICcsJyB8fCB0b2tlbnNbaV1bJ3RleHQnXVsnY29udGVudCddID09PSAnOycpIHtcbiAgICAgICAgICAgICAgICBjb21tYUxpc3QucHVzaChpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNodW5rVG9vTG9uZyh0b2tlbnMsIGNodW5rUG9zaXRpb25MaXN0LCBwcmVwTGlzdCwgY29tbWFMaXN0LCAra2V5LCBwcmV2aW91c0tleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnbm90IHRvbyBsb25nIDI6ICcgKyBzdHJpbmdsZW5ndGgpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhjaHVua1Bvc2l0aW9uTGlzdCk7XG4gIH1cblxuICBwcml2YXRlIGNodW5rVG9vTG9uZyh0b2tlbnM6IGFueSwgY2h1bmtQb3NpdGlvbkxpc3Q6IFJlY29yZDxudW1iZXIsIG51bWJlcj4sIHByZXBMaXN0OiBudW1iZXJbXSxcbiAgICBjb21tYUxpc3Q6IG51bWJlcltdLCBrZXk6IG51bWJlciwgcHJldmlvdXNLZXk6IG51bWJlcikge1xuICAgIGNvbnNvbGUubG9nKHByZXZpb3VzS2V5ICsgJyB0byAnICsga2V5ICsgJyB0b28gbG9uZzogJyk7XG5cbiAgICBsZXQgY2xvc2VzdCA9IG51bGw7XG4gICAgaWYgKHByZXBMaXN0Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgY29uc29sZS5sb2cocHJlcExpc3QpO1xuICAgICAgY29uc3QgZ29hbCA9IChrZXkgKyBwcmV2aW91c0tleSkgLyAyO1xuICAgICAgY29uc29sZS5sb2coJ2dvYWw6ICcgKyBnb2FsKTtcbiAgICAgIGNsb3Nlc3QgPSBwcmVwTGlzdC5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnIpIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyhjdXJyIC0gZ29hbCkgPCBNYXRoLmFicyhwcmV2IC0gZ29hbCkgPyBjdXJyIDogcHJldik7XG4gICAgICB9KTtcbiAgICAgIGlmIChjbG9zZXN0IDwga2V5ICYmIGNsb3Nlc3QgPiBwcmV2aW91c0tleSkge1xuICAgICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBjbG9zZXN0LCB0b2tlbnMsICd0b28gbG9uZyBwYXJ0IHByZXA6ICcgKyBjbG9zZXN0KTtcblxuICAgICAgICBjb25zdCBpbmRleCA9IHByZXBMaXN0LmluZGV4T2YoY2xvc2VzdCk7XG4gICAgICAgIHByZXBMaXN0LnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbG9zZXN0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNvbW1hTGlzdC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coY29tbWFMaXN0KTtcbiAgICAgICAgY29uc3QgZ29hbCA9ICgra2V5ICsgcHJldmlvdXNLZXkpIC8gMjtcbiAgICAgICAgY29uc29sZS5sb2coJ2dvYWw6ICcgKyBnb2FsKTtcbiAgICAgICAgY2xvc2VzdCA9IGNvbW1hTGlzdC5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnIpIHtcbiAgICAgICAgICByZXR1cm4gKE1hdGguYWJzKGN1cnIgLSBnb2FsKSA8IE1hdGguYWJzKHByZXYgLSBnb2FsKSA/IGN1cnIgOiBwcmV2KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjbG9zZXN0OiAnICsgY2xvc2VzdCk7XG5cbiAgICAgICAgaWYgKGNsb3Nlc3QgPCBrZXkgJiYgY2xvc2VzdCA+IHByZXZpb3VzS2V5KSB7XG4gICAgICAgICAgdGhpcy5hZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdCwgY2xvc2VzdCArIDEsIHRva2VucywgJ3RvbyBsb25nIHBhcnQgY29tbWE6JyArIGNsb3Nlc3QpO1xuXG4gICAgICAgICAgY29uc3QgaW5kZXggPSBjb21tYUxpc3QuaW5kZXhPZihjbG9zZXN0KTtcbiAgICAgICAgICBjb21tYUxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbG9zZXN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2xvc2VzdCAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgbGVuZ3RoMSA9ICt0b2tlbnNbY2xvc2VzdF1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXSAtICt0b2tlbnNbcHJldmlvdXNLZXldWyd0ZXh0J11bJ2JlZ2luT2Zmc2V0J107XG4gICAgICBjb25zdCBsZW5ndGgyID0gK3Rva2Vuc1trZXldWyd0ZXh0J11bJ2JlZ2luT2Zmc2V0J10gLSArdG9rZW5zW2Nsb3Nlc3RdWyd0ZXh0J11bJ2JlZ2luT2Zmc2V0J107XG4gICAgICBjb25zb2xlLmxvZygnMTogJyArIGxlbmd0aDEgKyAnIDI6ICcgKyBsZW5ndGgyKTtcbiAgICAgIGlmIChsZW5ndGgxID4gMzApIHtcbiAgICAgICAgdGhpcy5jaHVua1Rvb0xvbmcodG9rZW5zLCBjaHVua1Bvc2l0aW9uTGlzdCwgcHJlcExpc3QsIGNvbW1hTGlzdCwgY2xvc2VzdCwgcHJldmlvdXNLZXkpO1xuICAgICAgfVxuICAgICAgaWYgKGxlbmd0aDIgPiAzMCkge1xuICAgICAgICB0aGlzLmNodW5rVG9vTG9uZyh0b2tlbnMsIGNodW5rUG9zaXRpb25MaXN0LCBwcmVwTGlzdCwgY29tbWFMaXN0LCBrZXksIGNsb3Nlc3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlVG9vU2hvcnRQYXJ0KHRva2VuczogYW55LCBjaHVua1Bvc2l0aW9uTGlzdDogUmVjb3JkPG51bWJlciwgbnVtYmVyPikge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhjaHVua1Bvc2l0aW9uTGlzdCk7XG4gICAgbGV0IHByZXZpb3VzS2V5ID0gMDtcbiAgICBsZXQga2V5LCBsZW5ndGg7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgIGlmIChjaHVua1Bvc2l0aW9uTGlzdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGxlbmd0aCA9ICtrZXkgLSBwcmV2aW91c0tleTtcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIGlmICgodG9rZW5zW3ByZXZpb3VzS2V5XVsncGFydE9mU3BlZWNoJ11bJ3RhZyddID09PSAnVkVSQicgJiYgIXRoaXMuY2hlY2tMYWJlbChbJ1ZNT0QnXSwgcHJldmlvdXNLZXksIHRva2VucykgfHxcbiAgICAgICAgICAgIChwcmV2aW91c0tleSA+IDAgJiYgdGhpcy5jaGVja0xhYmVsKFsnUCddLCBwcmV2aW91c0tleSAtIDEsIHRva2VucykpKSkge1xuICAgICAgICAgICAgZGVsZXRlIGNodW5rUG9zaXRpb25MaXN0W2tleV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0b2tlbnNbcHJldmlvdXNLZXldWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddIDwgcHJldmlvdXNLZXlcbiAgICAgICAgICAgICAgfHwgKCF0aGlzLmNoZWNrTGFiZWwoWydBRFZNT0QnXSwgcHJldmlvdXNLZXksIHRva2VucykgJiYgdGhpcy5pc0Nvbmp1Z2F0ZVZlcmIocHJldmlvdXNLZXkgLSAxLCB0b2tlbnMpKSkge1xuICAgICAgICAgICAgICBkZWxldGUgY2h1bmtQb3NpdGlvbkxpc3RbcHJldmlvdXNLZXldO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygncHJldmlvdXMnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSBjaHVua1Bvc2l0aW9uTGlzdFtrZXldO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbmV4dCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlbW92ZSBjaHVuayB0b28gc2hvcnQ6ICcgKyBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzS2V5ICE9PSAwICYmIHRoaXMuY2hlY2tMYWJlbChbJ1AnXSwgK2tleSAtIDEsIHRva2VucykpIHtcbiAgICAgICAgICAgIC8vIGlmICh0b2tlbnNbcHJldmlvdXNLZXldWydwYXJ0T2ZTcGVlY2gnXVsndGFnJ10gPT09ICdWRVJCJykge1xuICAgICAgICAgICAgLy8gICBkZWxldGUgY2h1bmtQb3NpdGlvbkxpc3Rba2V5XTtcbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgIGlmICh0b2tlbnNbcHJldmlvdXNLZXldWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddIDwgcHJldmlvdXNLZXkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjaHVua1Bvc2l0aW9uTGlzdFtwcmV2aW91c0tleV07XG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICBkZWxldGUgY2h1bmtQb3NpdGlvbkxpc3Rba2V5XTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmRlYnVnKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZW1vdmUgY2h1bmsgdG9vIHNob3J0OiAnICsga2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXNLZXkgPSAra2V5O1xuICAgICAgfVxuICAgIH1cbiAgICBrZXkgPSB0b2tlbnMubGVuZ3RoIC0gMTtcbiAgICBsZW5ndGggPSAra2V5IC0gcHJldmlvdXNLZXkgKyAxO1xuICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgIGRlbGV0ZSBjaHVua1Bvc2l0aW9uTGlzdFtwcmV2aW91c0tleV07XG4gICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVtb3ZlIGNodW5rIHRvbyBzaG9ydDogJyArIGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChsZW5ndGggPT09IDIpIHtcbiAgICAgIGlmIChwcmV2aW91c0tleSAhPT0gMCAmJiB0aGlzLmNoZWNrTGFiZWwoWydQJ10sICtwcmV2aW91c0tleSArIDEsIHRva2VucykpIHtcbiAgICAgICAgZGVsZXRlIGNodW5rUG9zaXRpb25MaXN0W3ByZXZpb3VzS2V5XTtcbiAgICAgICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygncmVtb3ZlIGNodW5rIHRvbyBzaG9ydDogJyArIGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2coY2h1bmtQb3NpdGlvbkxpc3QpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRDaHVuayhjaHVua1Bvc2l0aW9uTGlzdDogUmVjb3JkPG51bWJlciwgbnVtYmVyPiwgaW5kZXg6IG51bWJlciwgdG9rZW5zOiBhbnksIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmIChpbmRleCA+IDAgJiYgaW5kZXggPCB0b2tlbnMubGVuZ3RoIC0gMSkge1xuICAgICAgaWYgKHRoaXMuZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2FkZCBjaHVuayAnICsgaW5kZXggKyAnIDonICsgbWVzc2FnZSk7XG4gICAgICB9XG4gICAgICBpZiAoaW5kZXggPiAxICYmIHRoaXMuY2hlY2tMYWJlbChbJ1AnXSwgaW5kZXggLSAxLCB0b2tlbnMpICYmXG4gICAgICAgICh0b2tlbnNbaW5kZXggLSAxXVsndGV4dCddWydjb250ZW50J10gPT09ICcoJyB8fFxuICAgICAgICAgICgodG9rZW5zW2luZGV4IC0gMV1bJ3RleHQnXVsnY29udGVudCddID09PSAnXCInKSAmJiB0b2tlbnNbaW5kZXggLSAxXVsnZGVwZW5kZW5jeUVkZ2UnXVsnaGVhZFRva2VuSW5kZXgnXSAhPT0gaW5kZXgpKSkge1xuICAgICAgICBjaHVua1Bvc2l0aW9uTGlzdFtpbmRleCAtIDFdID0gdG9rZW5zW2luZGV4IC0gMl1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXSArIHRva2Vuc1tpbmRleCAtIDJdWyd0ZXh0J11bJ2NvbnRlbnQnXS5sZW5ndGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgaiA9IGluZGV4O1xuICAgICAgICB3aGlsZSAoaiA8IHRva2Vucy5sZW5ndGggJiYgdGhpcy5jaGVja0xhYmVsKFsnUCddLCBqLCB0b2tlbnMpKSB7XG4gICAgICAgICAgaWYgKGogPCB0b2tlbnMubGVuZ3RoIC0gMSAmJiAodG9rZW5zW2pdWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJy0nXG4gICAgICAgICAgICB8fCB0b2tlbnNbal1bJ3RleHQnXVsnY29udGVudCddID09PSAnKCcgfHwgdG9rZW5zW2pdWyd0ZXh0J11bJ2NvbnRlbnQnXSA9PT0gJ1wiJykpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBqKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGogPCB0b2tlbnMubGVuZ3RoIC0gMiAmJiBqID4gMCkge1xuICAgICAgICAgIGlmICgoPHN0cmluZz50b2tlbnNbaiAtIDFdWyd0ZXh0J11bJ2NvbnRlbnQnXSkuaW5jbHVkZXMoJ+OAgCcpKSB7XG4gICAgICAgICAgICBjaHVua1Bvc2l0aW9uTGlzdFtqXSA9IHRva2Vuc1tqIC0gMV1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXSArIHRva2Vuc1tqIC0gMV1bJ3RleHQnXVsnY29udGVudCddLnNwbGl0KCfjgIAnKVswXS5sZW5ndGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNodW5rUG9zaXRpb25MaXN0W2pdID0gdG9rZW5zW2ogLSAxXVsndGV4dCddWydiZWdpbk9mZnNldCddICsgdG9rZW5zW2ogLSAxXVsndGV4dCddWydjb250ZW50J10ubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gaWYgKHRoaXMuY2hlY2tMYWJlbChbJ1AnXSwgaW5kZXgsIHRva2VucykpIHtcbiAgICAgIC8vICAgaWYgKGluZGV4IDwgdG9rZW5zLmxlbmd0aCAtIDIpIHtcbiAgICAgIC8vICAgICBjaHVua1Bvc2l0aW9uTGlzdFtpbmRleCArIDFdID0gdG9rZW5zW2luZGV4ICsgMV1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXSAtIDE7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyAgIGNodW5rUG9zaXRpb25MaXN0W2luZGV4XSA9IHRva2Vuc1tpbmRleF1bJ3RleHQnXVsnYmVnaW5PZmZzZXQnXSAtIDE7XG4gICAgICAvLyB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0NDQW5kQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3Q6IFJlY29yZDxudW1iZXIsIG51bWJlcj4sIGluZGV4OiBudW1iZXIsIHRva2VuczogYW55LCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5jaGVja0xhYmVsKFsnQ0MnXSwgaW5kZXggLSAxLCB0b2tlbnMpKSB7XG4gICAgICB0aGlzLmFkZENodW5rKGNodW5rUG9zaXRpb25MaXN0LCBpbmRleCAtIDEsIHRva2VucywgbWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQ2h1bmsoY2h1bmtQb3NpdGlvbkxpc3QsIGluZGV4LCB0b2tlbnMsIG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tMYWJlbChsYWJlbDogc3RyaW5nW10sIGluZGV4OiBudW1iZXIsIHRva2VuczogYW55KSB7XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0b2tlbnMubGVuZ2h0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCBiID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYWJlbC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRva2Vuc1tpbmRleF1bJ2RlcGVuZGVuY3lFZGdlJ11bJ2xhYmVsJ10gPT09IGxhYmVsW2ldKSB7XG4gICAgICAgIGIgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrRGVwZW5kZW5jeShoZWFkVG9rZW5JbmRleDogc3RyaW5nLCBpbmRleDogbnVtYmVyLCB0b2tlbnM6IGFueSkge1xuICAgIHJldHVybiB0b2tlbnNbaW5kZXhdWydkZXBlbmRlbmN5RWRnZSddWydoZWFkVG9rZW5JbmRleCddID09PSBoZWFkVG9rZW5JbmRleDtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tUYWcodGFnOiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIHRva2VuczogYW55KSB7XG4gICAgcmV0dXJuIHRva2Vuc1tpbmRleF1bJ3BhcnRPZlNwZWVjaCddWyd0YWcnXSA9PT0gdGFnO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0Nvbmp1Z2F0ZVZlcmIoaW5kZXg6IG51bWJlciwgdG9rZW5zOiBhbnkpIHtcbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRva2Vucy5sZW5naHQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRva2Vuc1tpbmRleF1bJ3BhcnRPZlNwZWVjaCddWyd0YWcnXSA9PT0gJ1ZFUkInICYmICh0b2tlbnNbaW5kZXhdWydwYXJ0T2ZTcGVlY2gnXVsndGVuc2UnXSAhPT0gJ1RFTlNFX1VOS05PV04nXG4gICAgICB8fCB0b2tlbnNbaW5kZXhdWydsZW1tYSddICE9PSB0b2tlbnNbaW5kZXhdWyd0ZXh0J11bJ2NvbnRlbnQnXSk7XG4gIH1cbn1cbiJdfQ==