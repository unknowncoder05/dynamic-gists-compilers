import { Project } from './models/project'
import FileCompiler from './FileCompiler'
import { CompiledFile } from './models/file'

import path from 'path'

interface ProjectCompilerInteface{
    project:Project,
    projectPath:string,
    readJsonFromFile?:Function
}
export default class ProjectCompiler{
    project:Project
    projectPath:string
    readJsonFromFile:Function

    constructor(args:ProjectCompilerInteface){
        this.project = args.project
        this.projectPath = args.projectPath
        if(!args.readJsonFromFile){
            this.readJsonFromFile = require
        } else {
            this.readJsonFromFile = args.readJsonFromFile
        }
    }
    
    async codeLinesCompile(): Promise<CompiledFile[] | undefined> {
        let fileCodeLines = []
        for(const file of this.project.files){
            const filePath = path.join(this.projectPath, file.path)
            const fileContent = await this.readJsonFromFile(filePath)
            const fileCompiler = new FileCompiler({
                block: fileContent,
                args: file.args,
                baseRoute: filePath
            })
            fileCodeLines.push(
                await fileCompiler.codeLinesCompile()
            )
        }
        return fileCodeLines
    }

    async compile(): Promise<CompiledFile[]>{
        let fileCodeLines = []
        for(const file of this.project.files){
            const filePath = path.join(this.projectPath, file.path)
            const fileContent = await this.readJsonFromFile(filePath)
            const fileCompiler = new FileCompiler({
                block: fileContent,
                args: file.args,
                baseRoute: filePath
            })
            fileCodeLines.push(
                await fileCompiler.compile()
            )
        }
        return fileCodeLines
    }
}