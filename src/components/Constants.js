class Constants {
    constructor() {
        // all the URLs
        this.url = 'http://localhost:9000';
        this.login = `${this.url}/`;
        this.register = `${this.url}/register`;
        this.getUser = `${this.url}/getUser`;
        this.editUser = `${this.url}/editUser`;
        this.checkUsername = `${this.url}/register/{username}`;
        this.getConversation = `${this.url}/getconversation/{id}`;
        this.getRooms = `${this.url}/rooms`;
    }
}
export default Constants;