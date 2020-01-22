import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MglishnlService {
  private params = new HttpParams().append('key', environment.googleAPIKey);
  private debug = isDevMode();

  constructor(private http: HttpClient) { }

  private request(text: string) {
    const url = 'https://cors-anywhere.herokuapp.com/https://language.googleapis.com/v1beta2/documents:analyzeSyntax';
    const request = {
      document: {
        content: text,
        type: 'PLAIN_TEXT',
      },
      encodingType: 'UTF8',
    };
    const options = { headers: { 'Content-Type': 'application/json' }, params: this.params };
    return this.http.post(url, JSON.stringify(request), options);
  }

  chunkText(text: string) {
    const textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-').replace(/\…/g, '...');
    return new Observable((subscriber) => this.request(textToChunk).subscribe(
      (result: any) => {
        console.log(result);
        subscriber.next(this.getTextWithChunk(result, textToChunk));
        subscriber.complete();
      },
      error => {
        subscriber.error(error);
      })
    );
  }

  chunkTextArray(textArray: string[]) {
    let textToChunk = '';
    for (let i = 0; i < textArray.length; i++) {
      textToChunk += textArray[i] + '　';
    }
    textToChunk = textToChunk.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-').replace(/\…/g, '...');
    return new Observable((subscriber) => this.request(textToChunk).subscribe(
      (result: any) => {
        const textWithChunk = this.getTextWithChunk(result, textToChunk.replace(/　/g, '|||'));
        const textChunkArray = textWithChunk.split(/\|{3,}/g);
        textChunkArray.pop();
        subscriber.next(textChunkArray);
        subscriber.complete();
      },
      error => {
        subscriber.error(error);
      })
    );
  }

  textWithMitre(text: string) {
    const textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
    return new Observable((subscriber) => this.request(textToChunk).subscribe(
      (result: any) => {
        subscriber.next(this.getTextWithMitre(result, textToChunk));
        subscriber.complete();
      },
      error => {
        subscriber.error(error);
      })
    );
  }

  textWithBreakLine(text: string) {
    const textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
    return new Observable((subscriber) => this.request(textToChunk).subscribe(
      (result: any) => {
        subscriber.next(this.getTextWithBreakLine(result, textToChunk));
        subscriber.complete();
      },
      error => {
        subscriber.error(error);
      })
    );
  }

  chunkPositionList(text: string) {
    const textToChunk = text.replace(/\“|\”/g, '\"').replace(/\’/g, '\'').replace(/\–/g, '\-');
    return new Observable((subscriber) => this.request(textToChunk).subscribe(
      (result: any) => {
        subscriber.next(this.handle(result));
        subscriber.complete();
      },
      error => {
        subscriber.error(error);
      })
    );
  }


  private getTextWithMitre(result: { sentences: [], tokens: [], language: string }, text: string) {
    const chunkPositionList = this.handle(result);
    if (Object.keys(chunkPositionList).length === 0) {
      return '「' + text + '」';
    } else {
      let newText = '';
      let previousPosition = 0;
      let fragment = '';
      for (const key in chunkPositionList) {
        if (chunkPositionList.hasOwnProperty(key) && text.charAt(chunkPositionList[key]) === ' ') {
          const tmp = text.substring(chunkPositionList[previousPosition], chunkPositionList[key]);
          let countBegin = 0;
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
      const tmpLast = text.substring(chunkPositionList[previousPosition], text.length);
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

  private getTextWithBreakLine(result: { sentences: [], tokens: [], language: string }, text: string) {
    const chunkPositionList = this.handle(result);
    if (Object.keys(chunkPositionList).length === 0) {
      return text;
    } else {
      const part = [];
      let previousPosition = 0;
      let fragment: string;
      for (const key in chunkPositionList) {
        if (chunkPositionList.hasOwnProperty(key) && text.charAt(chunkPositionList[key]) === ' ') {
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

  private getTextWithChunk(result: { sentences: [], tokens: [], language: string }, text: string) {
    const chunkPositionList = this.handle(result);
    if (Object.keys(chunkPositionList).length === 0) {
      return text;
    } else {
      const part = [];
      let previousPosition = 0;
      let fragment: string;
      for (const key in chunkPositionList) {
        if (chunkPositionList.hasOwnProperty(key) && text.charAt(chunkPositionList[key]) === ' ') {
          fragment = text.substring(chunkPositionList[previousPosition], chunkPositionList[key]);
          part.push(fragment);
          previousPosition = +key;
        }
      }
      fragment = text.substring(chunkPositionList[previousPosition], text.length);
      part.push(fragment);
      console.log(part);
      return part.join(' |');
    }
  }

  handle(result: { sentences: [], tokens: [], language: string }) {
    const chunkPositionList: Record<number, number> = {};
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
            } else {
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
          const indexFirst = tokens[i]['dependencyEdge']['headTokenIndex'];
          if (i < indexFirst) {
            break;
          }
          let indexSecond: number;
          for (let k = i + 1; k < tokens.length; k++) {
            if (this.checkLabel(['CONJ'], k, tokens) && tokens[k]['dependencyEdge']['headTokenIndex'] === indexFirst) {
              indexSecond = k;
              break;
            }
          }
          if (typeof indexSecond === 'undefined') {
            break;
          }
          let count = indexSecond - indexFirst;
          let a = indexFirst - 1;
          while (a > 0 && tokens[a]['dependencyEdge']['headTokenIndex'] === indexFirst) {
            count++;
            a--;
          }
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
  private handleVerb(tokens: any, index: number, chunkPositionList: Record<number, number>) {
    if (index !== tokens.length - 1 &&
      ((this.checkLabel(['PRT', 'XCOMP'], index + 1, tokens) && tokens[index + 1]['dependencyEdge']['headTokenIndex'] === index)
        || this.checkLabel(['ACOMP'], index + 1, tokens))
    ) {
      if (index + 1 < tokens.length - 1) {
        this.addChunk(chunkPositionList, index + 2, tokens, 'verb :' + index);
      }
    } else {
      if (index !== tokens.length - 1) {
        this.addChunk(chunkPositionList, index + 1, tokens, 'verb :' + index);
      }
    }
  }

  // check length of subject if too long, chunk subj / verb
  private handleSubj(tokens: any, index: number, chunkPositionList: Record<number, number>) {
    if (!(index < tokens.length - 1 && ((<string>tokens[index + 1]['text']['content']).startsWith('\'')
      || (<string>tokens[index + 1]['text']['content']).startsWith('\’')))) {
      const verbIndex = tokens[index]['dependencyEdge']['headTokenIndex'];
      const verbIndexHead = tokens[verbIndex]['dependencyEdge']['headTokenIndex'];

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
            || this.checkLabel(['ACOMP'], verbIndex + 1, tokens))
        ) {
          if (verbIndex + 1 < tokens.length - 1) {
            delete chunkPositionList[verbIndex + 2];
          }
        } else {
          if (verbIndex !== tokens.length - 1) {
            delete chunkPositionList[verbIndex + 1];
          }
        }
      } else {
        let count = verbIndex - index + 1;

        if (verbIndex < tokens.length - 1 &&
          this.checkLabel(['PRT'], verbIndex + 1, tokens) && tokens[verbIndex + 1]['dependencyEdge']['headTokenIndex'] === index) {
          count++;
        }
        let j = index - 1;
        while (j >= 0 && tokens[j]['dependencyEdge']['headTokenIndex'] <= verbIndex
          && (tokens[j]['dependencyEdge']['headTokenIndex'] >= j)) {
          count++;
          j--;
        }

        if (count > 5) {
          if (verbIndex > 2 && (this.checkLabel(['AUX', 'AUXPASS'], verbIndex - 2, tokens))) {
            this.addChunk(chunkPositionList, verbIndex - 2, tokens, 'subj + aux 2:' + index);
          } else {
            if (verbIndex > 1 && (this.checkLabel(['AUX', 'AUXPASS'], verbIndex - 1, tokens))) {
              this.addChunk(chunkPositionList, verbIndex - 1, tokens, 'subj + aux 1:' + index);
            } else {
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

  private handleTooLongPart(tokens: any, chunkPositionList: Record<number, number>) {
    const keys = Object.keys(chunkPositionList);
    let previousKey = 0;
    let key: number;
    let length: number;
    for (let index = 0; index < keys.length; index++) {
      key = +keys[index];
      if (chunkPositionList.hasOwnProperty(key)) {
        length = +key - previousKey;
        if (length >= 6) {
          const stringlength = +tokens[key]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
          console.log(stringlength);
          if (stringlength >= 35) {
            const prepList = [];
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
          } else {
            console.log('not too long 1: ' + stringlength);
          }
        }
        previousKey = +key;
      }
    }
    key = tokens.length - 1;
    length = +key - previousKey + 1;
    if (length >= 6) {
      const stringlength = +tokens[key]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
      if (stringlength >= 35) {
        console.log(previousKey + ' to ' + key + ' too long: ' + stringlength);
        const prepList = [];
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
      } else {
        console.log('not too long 2: ' + stringlength);
      }
    }
    console.log(chunkPositionList);
  }

  private chunkTooLong(tokens: any, chunkPositionList: Record<number, number>, prepList: number[],
    commaList: number[], key: number, previousKey: number) {
    console.log(previousKey + ' to ' + key + ' too long: ');

    let closest = null;
    if (prepList.length !== 0) {
      console.log(prepList);
      const goal = (key + previousKey) / 2;
      console.log('goal: ' + goal);
      closest = prepList.reduce((prev, curr) => {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
      });
      if (closest < key && closest > previousKey) {
        this.addChunk(chunkPositionList, closest, tokens, 'too long part prep: ' + closest);

        const index = prepList.indexOf(closest);
        prepList.splice(index, 1);
      } else {
        closest = null;
      }
    } else {
      if (commaList.length !== 0) {
        console.log(commaList);
        const goal = (+key + previousKey) / 2;
        console.log('goal: ' + goal);
        closest = commaList.reduce((prev, curr) => {
          return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
        });
        console.log('closest: ' + closest);

        if (closest < key && closest > previousKey) {
          this.addChunk(chunkPositionList, closest + 1, tokens, 'too long part comma:' + closest);

          const index = commaList.indexOf(closest);
          commaList.splice(index, 1);
        } else {
          closest = null;
        }
      }
    }
    if (closest !== null) {
      const length1 = +tokens[closest]['text']['beginOffset'] - +tokens[previousKey]['text']['beginOffset'];
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

  private removeTooShortPart(tokens: any, chunkPositionList: Record<number, number>) {
    const keys = Object.keys(chunkPositionList);
    let previousKey = 0;
    let key: number;
    let length: number;
    for (let index = 0; index < keys.length; index++) {
      key = +keys[index];
      if (chunkPositionList.hasOwnProperty(key)) {
        length = +key - previousKey;
        if (length === 1) {
          if ((tokens[previousKey]['partOfSpeech']['tag'] === 'VERB' && !this.checkLabel(['VMOD'], previousKey, tokens) ||
            (previousKey > 0 && this.checkLabel(['P'], previousKey - 1, tokens)))) {
            delete chunkPositionList[key];
          } else {
            if (tokens[previousKey]['dependencyEdge']['headTokenIndex'] < previousKey
              || (!this.checkLabel(['ADVMOD'], previousKey, tokens) && this.isConjugateVerb(previousKey - 1, tokens))) {
              delete chunkPositionList[previousKey];
              console.log('previous');
            } else {
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

  private addChunk(chunkPositionList: Record<number, number>, index: number, tokens: any, message: string) {
    if (index > 0 && index < tokens.length - 1) {
      if (this.debug) {
        console.log('add chunk ' + index + ' :' + message);
      }
      if (index > 1 && this.checkLabel(['P'], index - 1, tokens) &&
        (tokens[index - 1]['text']['content'] === '(' ||
          ((tokens[index - 1]['text']['content'] === '"') && tokens[index - 1]['dependencyEdge']['headTokenIndex'] !== index))) {
        chunkPositionList[index - 1] = tokens[index - 2]['text']['beginOffset'] + tokens[index - 2]['text']['content'].length;
      } else {
        let j = index;
        while (j < tokens.length && this.checkLabel(['P'], j, tokens)) {
          if (j < tokens.length - 1 && (tokens[j]['text']['content'] === '-'
            || tokens[j]['text']['content'] === '(' || tokens[j]['text']['content'] === '"')) {
            break;
          }
          j++;
        }
        if (j < tokens.length - 2 && j > 0) {
          if (tokens[j - 1]['text']['content'].includes('　')) {
            chunkPositionList[j] = tokens[j - 1]['text']['beginOffset'] + tokens[j - 1]['text']['content'].split('　')[0].length;
          } else {
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

  private checkCCAndChunk(chunkPositionList: Record<number, number>, index: number, tokens: any, message: string) {
    if (this.checkLabel(['CC'], index - 1, tokens)) {
      this.addChunk(chunkPositionList, index - 1, tokens, message);
    } else {
      this.addChunk(chunkPositionList, index, tokens, message);
    }
  }

  private checkLabel(label: string[], index: number, tokens: any) {
    if (index < 0 || index >= tokens.lenght) {
      return false;
    }
    let b = false;
    for (let i = 0; i < label.length; i++) {
      if (tokens[index]['dependencyEdge']['label'] === label[i]) {
        b = true;
        break;
      }
    }
    return b;
  }

  private checkDependency(headTokenIndex: string, index: number, tokens: any) {
    return tokens[index]['dependencyEdge']['headTokenIndex'] === headTokenIndex;
  }

  private checkTag(tag: string, index: number, tokens: any) {
    return tokens[index]['partOfSpeech']['tag'] === tag;
  }

  private isConjugateVerb(index: number, tokens: any) {
    if (index < 0 || index >= tokens.lenght) {
      return false;
    }
    return tokens[index]['partOfSpeech']['tag'] === 'VERB' && (tokens[index]['partOfSpeech']['tense'] !== 'TENSE_UNKNOWN'
      || tokens[index]['lemma'] !== tokens[index]['text']['content']);
  }
}
