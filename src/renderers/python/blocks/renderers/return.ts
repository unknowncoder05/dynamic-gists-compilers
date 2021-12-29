import { Blockhandler } from '../models/blockhandler'
import { ReturnModel } from '../models/return'
import { CodeLine } from '../../../../models/code'

export function ReturnBlockRenderer(block:ReturnModel, _:Blockhandler, indent:number=0): (CodeLine)[] {
    let result:CodeLine[] = []
    let returnExpressions = ''
    if(block.expressions){
        returnExpressions = ' ' + block.expressions.join(', ')
    }

    let returnLine:CodeLine = {
        content: `return${returnExpressions}`,
        indent
    }
    result.push(returnLine)
    return result
}