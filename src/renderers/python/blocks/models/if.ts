import { BlockTypes } from '../enums/BlockTypes'
import { PythonBaseCodeBlock } from './../../models/codeBlock'


export interface ifModel{
    type: BlockTypes.if,
    condition: string
    code: PythonBaseCodeBlock[]
}