// Use a singleton to store the socket so it can be accessed anywhere
// Should first initialize in the html file, or wherever gets called first
class Client 
{
    constructor(socket){
        if(! Client.instance){
            this._data = [];
            this.socket = socket;
            Client.instance = this;
        }

        return Client.instance;
    }
}