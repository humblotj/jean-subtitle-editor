import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export declare class MglishNlService {
    private http;
    private debug;
    constructor(http: HttpClient);
    private request;
    chunkText(text: string, apiKeyGoogle: string): Observable<{}>;
    chunkTextArray(textArray: string[], apiKeyGoogle: string): Observable<{}>;
    textWithMitre(text: string, apiKeyGoogle: string): Observable<{}>;
    textWithBreakLine(text: string, apiKeyGoogle: string): Observable<{}>;
    chunkPositionList(text: string, apiKeyGoogle: string): Observable<{}>;
    private getTextWithMitre;
    private getTextWithBreakLine;
    private getTextWithChunk;
    handle(result: {
        sentences: [];
        tokens: [];
        language: string;
    }, text: string): Record<number, number>;
    private handleVerb;
    private handleSubj;
    private handleTooLongPart;
    private chunkTooLong;
    private removeTooShortPart;
    private addChunk;
    private checkCCAndChunk;
    private checkLabel;
    private checkDependency;
    private checkTag;
    private isConjugateVerb;
}
