import { BlockTypes } from '../enums/BlockTypes'


export interface VariableModel{
    type: BlockTypes.variable,
    name: string,
    expression?: string,
    variableType?: string,
}