import { Blockhandler } from '../models/blockhandler'
import { FunctionModel } from '../models/function'
import { codeBlockRenderer } from './code'
import { CodeLine } from '../../../../models/code'
import { Argument } from './../../models/argument'

function argumentLineRenderer(args:Argument[]){
    return args.map(x => `${x.name}${x.type ? ':'+x.type:''}${x.default ? '=' + x.default:''}`).join(', ')
}

export function functionBlockRenderer(block:FunctionModel, blockHandler:Blockhandler, indent:number=0): (CodeLine)[] {
    let result:CodeLine[] = []
    let argsFragment = ''
    if(block.args){
        argsFragment = argumentLineRenderer(block.args)
    }
    if(block.decorators){
        for(const decoratorLine of block.decorators.map(x => `@${x.name}${x.args? '('+x.args.join(', ')+')':''}`)){
            let decoratorCodeLine:CodeLine = {
                content: decoratorLine,
                indent
            }
            result.push(decoratorCodeLine)
        }
    }
    
    let declarationLine:CodeLine = {
        content: `def ${block.name}(${argsFragment}):`,
        indent
    }
    result.push(declarationLine)
    result = [...result, ...codeBlockRenderer(block, blockHandler, indent)]
    return result
}