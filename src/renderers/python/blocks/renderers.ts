import { ifBlockRenderer } from './renderers/if'
import { functionBlockRenderer } from './renderers/function'
import { functionCallBlockRenderer } from './renderers/functionCall'
import { baseCodeBlockRenderer } from './renderers/baseCode'
import { VariableBlockRenderer } from './renderers/variable'
import { ReturnBlockRenderer } from './renderers/return'

import { CodeLine } from '../../../models/code'
import { Blockhandler } from './models/blockhandler'


interface Renderer{
    (block:any, blockhandler:Blockhandler, indent?:number):(CodeLine)[]
}

export const renderers:{[key:string]:Renderer} = {
    if: ifBlockRenderer,
    function: functionBlockRenderer,
    functionCall: functionCallBlockRenderer,
    code: baseCodeBlockRenderer,
    variable: VariableBlockRenderer,
    return: ReturnBlockRenderer,
}