import "./newUser.css";
import axios from "axios";
import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import Swal from "sweetalert2";

export default function NewUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState();

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  const handleClick = async (e) => {
    e.preventDefault();

    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const res = await axios.post(
      "http://a749384d347a840de8a1f30b4afcd786-1852372676.us-west-2.elb.amazonaws.com:5000/api/auth/register",
      {
        username,
        email,
        password,
        isAdmin,
      },
      { headers: headers }
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          axios.put(
            "http://a954c3a1117354aa1af418a15820f675-1076326496.us-west-2.elb.amazonaws.com:5000/api/users/" +
              res.data._id,
            {
              username,
              email,
              password,
              isAdmin: true,
              img: downloadURL,
            },
            { headers: headers }
          );
          Swal.fire("Success!", "New users added successfully", "success");
        });
      }
    );
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">Add New Admin User</h1>
      <form className="newUserForm">
        <div className="newUserItem">
          <label>Upload Product Image</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="newUserItem">
          <label>Username</label>
          <input
            type="text"
            placeholder="john"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="newUserItem">
          <label>Email</label>
          <input
            type="email"
            placeholder="john@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="newUserItem">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="newUserButton" onClick={handleClick}>
          Add New Admin User
        </button>
      </form>
    </div>
  );
}
