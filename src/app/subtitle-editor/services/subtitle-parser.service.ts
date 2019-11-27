import { Injectable } from '@angular/core';
import * as subsrt from 'subsrt';
import * as assCompiler from 'ass-compiler';

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

  build(srt: { id: number, start: number, end: number, text: string }[], extensionExport: string) {
    switch (extensionExport) {
      case 'mss':
        return this.buildMss(srt);
      case 'ass':
        return this.buildAss(srt);
      default:
        return subsrt.build(srt, { format: extensionExport });
    }
  }

  private buildMss(srt: { id: number, start: number, end: number, text: string }[]) {
    // const defaultSize = this.style['tag']['{t0}'].fontSize;
    // const defaultColor = this.getColor(this.style['tag']['{t0}'].color);
    // // tslint:disable-next-line: max-line-length
    // let text = '[Script Info]\nMglish\nhttp://www.mglish.com/\nPlayResX: 0\nPlayResY: 0\nWrapStyle: 0\nScaledBorderAndShadow: no\nYCbCr Matrix: TV.601\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,a타이틀고딕,' + defaultSize + ',' + defaultColor + ',&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,' + (this.style['whiteBackground'] ? '0,0,1,2,0' : '1,0,3,28,0') + ',2,' + this.style.marginLeft + ',' + this.style.marginRight + ',' + this.style.marginVertical + ',1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
    // for (let i = 0; i < srt.length; i++) {
    //   let newLine = 'Dialogue: 0,';
    //   newLine += this.msToTimeWithHour(srt[i].start) + ',';
    //   newLine += this.msToTimeWithHour(srt[i].end) + ',';
    //   newLine += 'Default,,0000,0000,0000,,';
    //   newLine += srt[i].text.replace(/\n/gi, '\\N') + '\n';
    //   text += newLine;
    // }
    // return text;
  }

  private buildAss(srt: { id: number, start: number, end: number, text: string }[]) {
    // const defaultSize = this.style['tag']['{t0}'].fontSize;
    // const defaultColor = this.getColor(this.style['tag']['{t0}'].color);
    // const defaultBold = this.style['tag']['{t0}'].bold ? -1 : 0;
    // const opaqueBox = this.style['opaqueBox'];
    // const outline = this.style['outline'];
    // const shadow = this.style['shadow'];
    // const backGroundColor = this.getColor(this.style['backGroundColor']);
    // const spacing = this.style['spacing'];

    // // tslint:disable-next-line: max-line-length
    // let text = '[Script Info]\nMglish\nhttp://www.mglish.com/\nPlayResX: 0\nPlayResY: 0\nWrapStyle: 0\nScaledBorderAndShadow: no\nYCbCr Matrix: TV.601\n\n';
    // // tslint:disable-next-line: max-line-length
    // text += '[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n';
    // // tslint:disable-next-line: max-line-length
    // text += 'Style: Default,a타이틀고딕,' + defaultSize + ',' + defaultColor + ',&H000000FF,' + backGroundColor + ',' + backGroundColor + ',' + defaultBold + ',0,0,0,100,100,' + spacing + ',0,' + opaqueBox + ',' + outline + ',' + shadow + ',2,' + this.style.marginLeft + ',' + this.style.marginRight + ',' + this.style.marginVertical + ',1' + '\n';
    // // tslint:disable-next-line: max-line-length
    // text += 'Style: t0,a타이틀고딕,' + defaultSize + ',' + defaultColor + ',&H000000FF,' + backGroundColor + ',' + backGroundColor + ',' + defaultBold + ',0,0,0,100,100,' + spacing + ',0,' + opaqueBox + ',' + outline + ',' + shadow + ',2,' + this.style.marginLeft + ',' + this.style.marginRight + ',' + this.style.marginVertical + ',1' + '\n';
    // // tslint:disable-next-line: max-line-length
    // text += 'Style: t1,a타이틀고딕,' + this.style['tag']['{t1}'].fontSize + ',' + this.getColor(this.style['tag']['{t1}'].color) + ',&H000000FF,' + backGroundColor + ',' + backGroundColor + ',' + (this.style['tag']['{t1}'].bold ? -1 : 0) + ',0,0,0,100,100,' + spacing + ',0,' + opaqueBox + ',' + outline + ',' + shadow + ',2,' + this.style.marginLeft + ',' + this.style.marginRight + ',' + this.style.marginVertical + ',1' + '\n';
    // // tslint:disable-next-line: max-line-length
    // text += 'Style: t2,a타이틀고딕,' + this.style['tag']['{t2}'].fontSize + ',' + this.getColor(this.style['tag']['{t2}'].color) + ',&H000000FF,' + backGroundColor + ',' + backGroundColor + ',' + (this.style['tag']['{t2}'].bold ? -1 : 0) + ',0,0,0,100,100,' + spacing + ',0,' + opaqueBox + ',' + outline + ',' + shadow + ',2,' + this.style.marginLeft + ',' + this.style.marginRight + ',' + this.style.marginVertical + ',1' + '\n';
    // // tslint:disable-next-line: max-line-length
    // text += 'Style: t3,a타이틀고딕,' + this.style['tag']['{t3}'].fontSize + ',' + this.getColor(this.style['tag']['{t3}'].color) + ',&H000000FF,' + backGroundColor + ',' + backGroundColor + ',' + (this.style['tag']['{t3}'].bold ? -1 : 0) + ',0,0,0,100,100,' + spacing + ',0,' + opaqueBox + ',' + outline + ',' + shadow + ',2,' + this.style.marginLeft + ',' + this.style.marginRight + ',' + this.style.marginVertical + ',1' + '\n';
    // // tslint:disable-next-line: max-line-length
    // text += 'Style: chunk,a타이틀고딕,' + this.style['tag']['chunk'].fontSize + ',' + this.getColor(this.style['tag']['chunk'].color) + ',&H000000FF,' + backGroundColor + ',' + backGroundColor + ',' + (this.style['tag']['chunk'].bold ? -1 : 0) + ',0,0,0,100,100,' + spacing + ',0,' + opaqueBox + ',' + outline + ',' + shadow + ',2,' + this.style.marginLeft + ',' + this.style.marginRight + ',' + this.style.marginVertical + ',1' + '\n';
    // text += '\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
    // console.log(text);
    // for (let i = 0; i < srt.length; i++) {
    //   let newLine = 'Dialogue: 0,';
    //   newLine += this.msToTimeWithHour(srt[i].start) + ',';
    //   newLine += this.msToTimeWithHour(srt[i].end) + ',';
    //   newLine += 'Default,,0000,0000,0000,,';
    //   // newLine += this.applyAssStyle2(srt[i].text).replace(/\n/gi, '\\N') + '\n';
    //   newLine += this.addMitre(this.applyAssStyle2(srt[i].text)) + '\n';
    //   text += newLine;
    // }
    // return text;
  }

}
