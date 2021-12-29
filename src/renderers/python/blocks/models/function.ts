import { BlockTypes } from '../enums/BlockTypes'
import { Argument } from './../../models/argument'
import { PythonBaseCodeBlock } from './../../models/codeBlock'
import { DecoratorCallModel } from './decoratorCallModel'


export interface FunctionModel{
    type: BlockTypes.function,
    decorators?: DecoratorCallModel[],
    name: string
    code: PythonBaseCodeBlock[]
    args?: Argument[]
}