import { Blockhandler } from '../models/blockhandler'
import { CodeLine } from '../../../../models/code'
import { PythonBaseCodeBlock } from './../../models/codeBlock'
import { BlockTypes } from './../enums/BlockTypes'

export function codeBlockRenderer(block:PythonBaseCodeBlock, blockHandler:Blockhandler, indent:number=0): (CodeLine)[] {
    let result:CodeLine[] = []
    for(const subBlock of block.code){
        let compiledBlocks = blockHandler(subBlock, indent+1)
        let extraSpaces = 0
        //
        switch (subBlock.type) {
            case BlockTypes.function:
                extraSpaces = 1
                break;
            
            case BlockTypes.class:
                extraSpaces = 2
                break;
        
            default:
                break;
        }
        let extraSpaceLines:CodeLine[] = Array(extraSpaces).fill({content:"", indent:indent+1})
        if(!!compiledBlocks){
            result = [...result, ...extraSpaceLines, ...compiledBlocks, ...extraSpaceLines]
        }
    }
    return result
}