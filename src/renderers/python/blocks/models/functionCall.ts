import { BlockTypes } from '../enums/BlockTypes'

export interface FunctionCallModel{
    type: BlockTypes.functionCall,
    function: string
    args?: string[]
}