import { CodeLine } from './../../../models/code'

export interface File{
    path: string,
    args: {[key:string]:any}
}

export interface CompiledFile{
    filePath: string,
    content?: string,
    codeLines?: CodeLine[],
}