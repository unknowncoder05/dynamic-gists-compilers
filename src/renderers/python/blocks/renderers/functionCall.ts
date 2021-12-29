import { Blockhandler } from '../models/blockhandler'
import { FunctionCallModel } from '../models/functionCall'
import { CodeLine } from '../../../../models/code'

export function functionCallBlockRenderer(block:FunctionCallModel, _:Blockhandler, indent:number=0): (CodeLine)[] {
    let result:CodeLine[] = []
    let argsFragment = ''
    if(block.args != undefined){
        argsFragment = block.args.join(', ')
    }
    let declarationLine:CodeLine = {
        content: `${block.function}(${argsFragment})`,
        indent: indent
    }
    result.push(declarationLine)
    
    return result
}