/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.email = null;
    this.gender = null;
    this.introduction = null;
    this.rateDe =null;
    this.rateUn = null;
    Object.assign(this, data);
  }
}
export default User;
