export interface CodeLine {
    content: string,
    indent?: number
}

export interface CodeBlock {
    type: string,
    [x: string]: any 
}