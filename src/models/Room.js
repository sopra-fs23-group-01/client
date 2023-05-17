/**
 * User model
 */
class Room {
    constructor(data = {}) {
        this.roomId = null;
        this.token = null;
        this.maxPlayersNum = null;
        this.roomProperty = null;
        this.theme = null;
        this.roomOwnerId = null;
        this.roomPlayers = null;
        this.roomPlayersList = null;
        this.alivePlayersList = null;
        this.gameStage = null;
        Object.assign(this, data);
    }
}
export default Room;