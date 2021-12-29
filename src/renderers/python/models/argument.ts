import { VariableType } from './../enums/VariableTypes'

export interface Argument{
    name?:string,
    type?:VariableType,
    default?:any
}