import { Import } from './../../models/import'
import { codeBlockRenderer } from './code'
import { CodeLine } from '../../../../models/code'

export function ImportBlockRenderer(block:Import[], indent:number=0): (CodeLine)[] {
    let result:CodeLine[] = []
    for(const decoratorLine of block.map( x => `${x.from? 'from '+ x.from + ' ':''}import ${x.import}${x.as? ' as '+ x.as:''}`)){
        let decoratorCodeLine:CodeLine = {
            content: decoratorLine,
            indent
        }
        result.push(decoratorCodeLine)
    }
    let extraSpaceLines:CodeLine[] = Array(1).fill({content:"", indent})
    result = [...result, ...extraSpaceLines]
    return result
}