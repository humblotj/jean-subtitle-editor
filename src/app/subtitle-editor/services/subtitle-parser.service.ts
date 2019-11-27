import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubtitleParserService {

  constructor() { }

  parse(data, extension: string) {
    try {
      switch (extension) {
        case 'sbv':
          return this.fromSbv(data);
        case 'srt':
          return this.fromSrt(data);
        case 'ass':
          return this.fromAss(data);
        case 'mss':
          return this.fromMss(data);
        case 'txt':
          return this.fromTxt(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  fromSrt(data) {
    data = data.replace(/\r/g, '');
    const regex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{1,}) --> (\d{2}:\d{2}:\d{2},\d{1,})/g;
    data = data.split(regex);
    data.shift();

    const items = [];
    for (let i = 0; i < data.length; i += 4) {
      items.push({
        id: data[i].trim(),
        startTime: this.timeWithHourToMs(data[i + 1].trim()),
        endTime: this.timeWithHourToMs(data[i + 2].trim()),
        text: data[i + 3].trim().replace(/(\r\n|\n|\r)/gm, ' '),
      });
    }
    console.log(items);
    return items;
  }

  fromSbv(data) {
    data = data.replace(/\r/g, '');
    const regex = /(\d{1,}:\d{2}:\d{2}.\d{3}),(\d{1,}:\d{2}:\d{2}.\d{3})/g;
    data = data.split(regex);
    data.shift();

    const items = [];
    for (let i = 0; i < data.length; i += 3) {
      items.push({
        id: i / 4 + 1,
        startTime: this.timeWithHourToMs(data[i].trim()),
        endTime: this.timeWithHourToMs(data[i + 1].trim()),
        text: data[i + 2].trim().replace(/(\r\n|\n|\r)/gm, ' '),
      });
    }
    return items;
  }

  fromMss(data) {
    data = data.replace(/\r|Dialogue: \d{1,},/g, '');
    const regex = /(\d{1,}:\d{2}:\d{2}.\d{2}),(\d{1,}:\d{2}:\d{2}.\d{2})/g;
    data = data.split(regex);
    data.shift();

    const items = [];
    for (let i = 0; i < data.length; i += 3) {
      let text = data[i + 2];
      for (let j = 0; j < 7; j++) {
        text = text.substring(text.indexOf(',') + 1, text.length);
      }
      items.push({
        id: i / 4 + 1,
        startTime: this.timeWithHourToMs(data[i].trim()),
        endTime: this.timeWithHourToMs(data[i + 1].trim()),
        text: text.trim().replace(/\\N/gi, ' ')
      });
    }
    return items;
  }

  fromAss(data) {
    data = data.replace(/\r|Dialogue: \d{1,},/g, '');
    const regex = /(\d{1,}:\d{2}:\d{2}.\d{2}),(\d{1,}:\d{2}:\d{2}.\d{2})/g;
    data = data.split(regex);
    data.shift();

    const items = [];
    for (let i = 0; i < data.length; i += 3) {
      let text = data[i + 2];
      for (let j = 0; j < 7; j++) {
        text = text.substring(text.indexOf(',') + 1, text.length);
      }
      items.push({
        id: i / 4 + 1,
        startTime: this.timeWithHourToMs(data[i].trim()),
        endTime: this.timeWithHourToMs(data[i + 1].trim()),
        text: text.trim().replace(/\\N/gi, ' ')
      });
    }
    return items;
  }

  fromTxt(data) {
    data = data.split('\n');

    const items = [];
    for (let i = 0; i < data.length; i++) {
      items.push({
        id: i,
        startTime: i * 1000,
        endTime: (i + 1) * 1000,
        text: data[i].trim().replace(/(\r\n|\n|\r)/gm, ' '),
      });
    }
    return items;
  }


  fromVtt(data) {
    data = data.replace(/\r/g, '');
    const regex = /(\d{1,}:\d{2}:\d{2}.\d{3}) --> (\d{1,}:\d{2}:\d{2}.\d{3})/g;
    data = data.split(regex);
    data.shift();

    const items = [];
    for (let i = 0; i < data.length; i += 3) {
      items.push({
        id: i / 4 + 1,
        startTime: this.timeWithHourToMs(data[i].trim()),
        endTime: this.timeWithHourToMs(data[i + 1].trim()),
        text: data[i + 2].trim().replace(/(\r\n|\n|\r)/gm, ' '),
      });
    }
    return items;
  }

  timeWithHourToMs(val) {
    const regex = /(\d+):(\d{2}):(\d{2})[,.](\d{1,})/;
    const parts = regex.exec(val);

    if (parts === null) {
      return 0;
    }

    let ms: number;
    switch (parts[4].length) {
      case 3:
        ms = Math.floor(+parts[4] / 10) * 10;
        break;
      case 2:
        ms = +parts[4] * 10;
        break;
      case 1:
        ms = +parts[4] * 100;
        break;
      default:
        ms = Math.round(+parts[4].substring(0, 3) / 10) * 10;
        break;
    }

    for (let i = 1; i < 5; i++) {
      parts[i] = parseInt(parts[i], 10) + '';
      if (isNaN(+parts[i])) { parts[i] = 0 + ''; }
    }

    // hours + minutes + seconds + ms
    return +parts[1] * 3600000 + +parts[2] * 60000 + +parts[3] * 1000 + ms;
  }

}
