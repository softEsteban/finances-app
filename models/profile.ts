import { Schema, model, models } from "mongoose";

const profileSchema = new Schema({
  name: String,
  profileKey: String,
  config: Object
});

const Profile = models.Profile || model("Profile", profileSchema, "profiles");
export default Profile;
