import { CodeLine } from './../../../../models/code'
import { PythonBaseCodeBlock } from './../../models/codeBlock'


export interface Blockhandler{
    (block:PythonBaseCodeBlock, args:any, indent?:number): CodeLine[] | undefined
}