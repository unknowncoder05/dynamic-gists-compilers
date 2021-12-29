import { CodeBlock } from './../../../models/code'
import { Argument } from './argument'
import { Import } from './import'

interface RequiredField{
    from:string,
    import:string,
    as:string
}

export interface PythonBaseCodeBlock extends CodeBlock{
    renderInputs?: {[key:string]:Argument}
    requires?: RequiredField[],
    imports?: Import[]
}