import React, { useState } from "react";
import { Card } from "@/components/card";
import { useNavigate } from "react-router-dom";
import Logo from "/assets/app-logo.svg";
import { signUpWithEmail } from "../firebase/auth"; // Adjust the path as needed

export default function Signin() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			await signUpWithEmail(email, password);
			alert("Verification email sent! Please check your inbox.");
			navigate("/login"); // Redirect to login after sign-up
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<>
			<nav className="p-4 bg-gray-900 flex justify-between items-center">
				<button onClick={() => navigate("/")} className="ml-4">
					<img src={Logo} alt="Logo" width="40" height="40" />
				</button>
			</nav>
			<div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-950 dark:bg-gray-900">
				<Card className="p-8 bg-gray-800 rounded-lg shadow-lg w-96 dark:bg-gray-800">
					<h1 className="mb-6 text-3xl font-bold text-center text-white">Setup Your Account</h1>
					<form onSubmit={handleSignup} className="flex flex-col space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-300">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="block w-full px-4 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="block w-full px-4 py-2 mt-1 text-gray-200 bg-gray-700 border border-gray-600 rounded-md"
								placeholder="Create a password"
							/>
						</div>
						<button
							type="submit"
							className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
						>
							Complete Setup
						</button>
						{error && <p className="text-red-500 text-center">{error}</p>}
					</form>
					<p className="mt-6 text-center text-gray-400">
						Already have an account?{" "}
						<button onClick={() => navigate("/login")} className="text-indigo-400 hover:underline">
							Login
						</button>
					</p>
				</Card>
			</div>
		</>
	);
}
