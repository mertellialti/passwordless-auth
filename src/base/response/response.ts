export class Response {
    status: boolean
    data: any
    msg: string
    
    constructor(status: boolean, data: any, msg: string) {
        this.status = status
        this.data = data
        this.msg = msg
    }
}