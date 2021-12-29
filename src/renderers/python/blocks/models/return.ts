import { BlockTypes } from '../enums/BlockTypes'


export interface ReturnModel{
    type: BlockTypes.return,
    expressions?: string[],
}