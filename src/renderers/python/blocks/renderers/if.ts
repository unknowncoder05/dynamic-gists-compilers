import { Blockhandler } from '../models/blockhandler'
import { ifModel } from '../models/if'
import { codeBlockRenderer } from './code'
import { CodeLine } from '../../../../models/code'

export function ifBlockRenderer(block:ifModel, blockHandler:Blockhandler, indent:number=0): (CodeLine)[] {
    let result:CodeLine[] = []
    let conditionLine:CodeLine = {
        content: `if ${block.condition}:`,
        indent
    }
    result.push(conditionLine)
    result = [...result, ...codeBlockRenderer(block, blockHandler, indent)]
    return result
}