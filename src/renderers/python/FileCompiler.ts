import { renderers } from './blocks/renderers'
import { ImportBlockRenderer } from './blocks/renderers/import'
import { CodeLine } from './../../models/code'
import { PythonBaseCodeBlock } from './models/codeBlock'
import { Import } from './models/import'
import { CompiledFile } from './models/file'
import { BlockTypes } from './blocks/enums/BlockTypes'
import path from 'path'

const loadBlockRegex = /^:/
const loadBlockRegexRemove = /^:/
const renderInputRegex = /##(.*?)##/g
const renderInputRegexRemove = /##/g

interface FileCompilerCompileArguments {
    tab?:string
    lines?:CodeLine[]
}

const defaultTab = '    '

interface FileCompilerInterface{
    block:PythonBaseCodeBlock,
    args:any,
    baseRoute:string,
    blockRoute?:string,
    readJsonFromFile?:Function
}

export default class FileCompiler{
    originalBlock:PythonBaseCodeBlock | undefined
    renderedBlock:PythonBaseCodeBlock | undefined
    originalArgs:any
    inputs:any
    imports:Import[]
    baseRoute?:string
    fileCompiledPath:string
    blockRoute:string
    readJsonFromFile:Function
    args:any

    constructor(args:FileCompilerInterface){
        this.originalBlock = args.block
        this.originalArgs = args.args
        this.baseRoute = args.baseRoute
        if(!args.readJsonFromFile){
            this.readJsonFromFile = require
        } else {
            this.readJsonFromFile = args.readJsonFromFile
        }
        this.args = args.args
        this.imports = []
        this.blockRoute = args.blockRoute ? args.blockRoute : 'base'
        this.fileCompiledPath = this.baseRoute.replace(/\.gist\.json/, '.py')
    }
    async renderInputs(){
        if(!this.originalBlock) return;
        if(!this.baseRoute) return;
        let inputRenderingResult = await renderBlockInputs(
            this.originalBlock,
            this.args,
            this.baseRoute,
            this.blockRoute,
            this.readJsonFromFile
        )
        this.renderedBlock = inputRenderingResult.result
        this.inputs = inputRenderingResult.inputs
        let imports = getImports(this.renderedBlock)
        this.imports = imports ? imports : []
    }
    
    async codeLinesCompile(): Promise<CompiledFile> {
        await this.renderInputs()
        let codeLines:CodeLine[] = []
        let importCodeLines = ImportBlockRenderer(this.imports)
        if(importCodeLines)
            codeLines = [ ...codeLines, ...importCodeLines]
        let mainCodeLines = blockHandler(this.renderedBlock)
        if(mainCodeLines)
            codeLines = [ ...codeLines, ...mainCodeLines]
        return {
            filePath: this.fileCompiledPath,
            codeLines
        }
    }

    async compile(args:FileCompilerCompileArguments={}): Promise<CompiledFile>{
        let compiledFile:CompiledFile | undefined = undefined;
        if(!args.lines){
            compiledFile = await this.codeLinesCompile()
        }
        let codeLines = args.lines ? args.lines : compiledFile?.codeLines
        if(!codeLines) return {
            filePath: this.fileCompiledPath
        }
        
        let resultLines = []
        for(const line of codeLines){
            let indentationString = ''
            if (line.indent != undefined && line.indent > 0){
                indentationString = Array(line.indent+1).join(args.tab ? args.tab : defaultTab)
            }
            resultLines.push(`${indentationString}${line.content}`)
        }
        let content = resultLines.join('\n')
        return {
            filePath: this.fileCompiledPath,
            content
        }
    }
}

function getImports(block:PythonBaseCodeBlock | PythonBaseCodeBlock[] | undefined): Import[] | undefined{
    if(Array.isArray(block)){
        let result:Import[] = []
        for(const blockItem of block){
            let newImports = getImports(blockItem)
            if(newImports)
                result = [ ...result, ...newImports]
        }
        return result
    }
    if(typeof block === 'object'){
        let result:Import[] = block.imports ? block.imports : []
        
        if(block.code){
            let newImports = getImports(block.code)
            if(newImports)
                result = [ ...result, ...newImports]
        }
        return result
    }
}

function blockHandler(block:PythonBaseCodeBlock | undefined, indent:number=0): CodeLine[] | undefined{
    if (!block) return
    if (renderers.hasOwnProperty(block.type)){
        return renderers[block.type](block, blockHandler, indent)
    } else {
        console.error(`'${block.type}' is not a valid block type`)
    }
}

async function renderBlockInputs(block: PythonBaseCodeBlock, args:any, baseRoute:string, blockRoute:string, readJsonFromFile:Function): Promise<{result:PythonBaseCodeBlock | undefined, inputs:any}>{
    let loadedRequiredBlocks = await getRequiredInputsFromBlock(block, args, baseRoute, blockRoute, readJsonFromFile)
    let renderedBlock = block
    let inputs = getInputsFromBlock(renderedBlock, args, blockRoute)
    inputs = Object.assign(inputs, loadedRequiredBlocks.inputs)
    inputs = replaceStringsInObject(inputs, inputs, renderedBlock.renderInputs, blockRoute)
    let result = replaceStringsInObject(renderedBlock, inputs, renderedBlock.renderInputs, blockRoute)
    
    return {
        result,
        inputs
    }
}

function replaceStringsInObject(block:any, args:any, argsDefinition:any, blockRoute:string): any{
    if(Array.isArray(block)){
        let result = []
        for(const blockItem of block){
            result.push(replaceStringsInObject(blockItem, args, argsDefinition, blockRoute))
        }
        return result
    }
    if(typeof block === 'object'){
        let result:any = {}
        for(const blockPropperty in block){
            result[blockPropperty] = replaceStringsInObject(block[blockPropperty], args, argsDefinition, blockRoute)
        }
        return result
    }
    if(typeof block === 'string'){
        let matches = block.match(renderInputRegex)
        let result = block
        if(matches){
            if(matches.length == 1 && matches[0] == block){
                let rawLoadInputValue = matches[0].replace(renderInputRegexRemove,'')
                if (loadBlockRegex.test(rawLoadInputValue)){
                    let rawInputValue = rawLoadInputValue.replace(loadBlockRegexRemove, '')
                    let value = getInputAttribute(rawInputValue, args, blockRoute)
                    return value
                }
            }
            for(const match of matches){
                let rawInputName = match.replace(renderInputRegexRemove,'')
                let value = getInputAttribute(rawInputName, args, blockRoute)
                var replace = match;
                var re = new RegExp(replace,"g");
                result = result.replace(re, value)
            }
        }

        return result
    }
    return block
    
}

function getInputAttribute(rawInputName:string, args:any, blockRoute:string): any{
    let value = args
    if(/\./.test(rawInputName)){
        for(const part of rawInputName.split('.')){
            if(!value.hasOwnProperty(part)){
                value = undefined
                console.error(`${blockRoute} attribute ${rawInputName} is not defined`);
                break
            }
            value = value[part]
        }
    } else {
        value = value[rawInputName]
    }
    return value
}

function getInputsFromBlock(block: PythonBaseCodeBlock, args:any, blockRoute:string): any{
    let inputs:{[key:string]:any} = {}
    for(const renderInput in block.renderInputs){        
        if(args.hasOwnProperty(renderInput)){
            inputs[renderInput] = args[renderInput]
            // TODO: check input type
            /*if(typeof args[renderInput] == block.renderInputs[renderInput].type)
            else console.error(`'${renderInput}' input incorrect type ${}, expected ${}`)*/
        } else {
            if(!block.renderInputs[renderInput].hasOwnProperty('default')){
                console.error(`required argument '${renderInput}' was not set`)
            }
            inputs[renderInput] = block.renderInputs[renderInput].default
        }
    }
    return inputs
}

async function getRequiredInputsFromBlock(block: PythonBaseCodeBlock, args:any, baseRoute:string, blockRoute:string, readJsonFromFile:Function): Promise<any>{
    if(!block.requires) return {
        inputs:[]
    }
    let inputs:{[key:string]:any} = {}
    for(const requirement of block.requires){
        const importPathFile = path.join(baseRoute, requirement.from)
        const importCodeBlock:PythonBaseCodeBlock = await readJsonFromFile(importPathFile)
        let requirementName = ''
        if(requirement.as){
            requirementName = requirement.as
        } else {
            requirementName = path.basename(requirement.from).split('.')[0]
        }
        const importBlock = new FileCompiler({
            block: importCodeBlock,
            args,
            baseRoute,
            blockRoute: `${blockRoute ? blockRoute+'.' : blockRoute}${requirementName}`,
            readJsonFromFile
        })
        inputs[requirementName] = importBlock.renderedBlock
        inputs = Object.assign(inputs, importBlock.inputs)
    }
    return {
        inputs
    }
}