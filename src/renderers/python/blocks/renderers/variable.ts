import { Blockhandler } from '../models/blockhandler'
import { VariableModel } from '../models/variable'
import { codeBlockRenderer } from './code'
import { CodeLine } from '../../../../models/code'

export function VariableBlockRenderer(block:VariableModel, _:Blockhandler, indent:number=0): (CodeLine)[] {
    let result:CodeLine[] = []
    let returnLine:CodeLine = {
        content: `${block.name}${block.variableType ? ':'+block.variableType:''} = ${block.expression}`,
        indent
    }
    result.push(returnLine)
    return result
}