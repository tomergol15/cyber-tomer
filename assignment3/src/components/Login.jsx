import { useState } from "react";
import axios from "axios";

const Login = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [mode, setMode] = useState("login"); 
    const [secure, setSecure] = useState(true); 
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submitFunction = async (e) => {
        e.preventDefault();

        const url =
            mode === "register"
                ? "http://localhost:3000/register"
                : secure
                    ? "http://localhost:3000/login-secure"
                    : "http://localhost:3000/login-vulnerable";

        try {
            const res = await axios.post(url, form);
            alert(res.data.message);
        } catch (err) {
            console.error("Error:", err);
            alert(err.response?.data?.error || "Something went wrong");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={submitFunction}>
                <label htmlFor="username">Username:</label><br />
                <input type="text" name="username" value={form.username} onChange={handleChange} /><br />
                <label htmlFor="password">Password:</label><br />
                <input type="password" name="password" value={form.password} onChange={handleChange} /><br />

                <button type="submit">{mode === "register"? "Register": secure ? "Login (Secure)" : "Login (Vulnerable)"}</button>
            </form>

            <div> {mode === "register" ? "Already registered?" : "Don't have an account?"}{" "}
                <button type="button" onClick={() => setMode(mode === "register" ? "login" : "register")}>
                {mode === "register" ? "Switch to Login" : "Switch to Register"}</button>
            </div>

            {mode !== "register" && (
                <div> <label> <input type="checkbox" checked={secure} onChange={() => setSecure(!secure)}/>{" "} Use secure login </label> </div>)}
        </div>
    );
};

export default Login;