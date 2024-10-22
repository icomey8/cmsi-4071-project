import { Card } from "@/components/card";

export default function Login() {
	return (
		<>
			<nav className="p-4 bg-gray-800">
				<div className="container flex items-center justify-center mx-auto">
					<div className="text-lg font-semibold text-white">
                        <h1>Async</h1>
					</div>
				</div>
			</nav>
			<div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-950 dark:bg-gray-900">
				<Card className="p-6 bg-white rounded-lg shadow-lg w-80 dark:bg-gray-800">
					<h1 className="mb-4 text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
						Login
					</h1>
					<form className="flex flex-col space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Username
							</label>
							<input
								type="text"
								className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
								placeholder="Enter your username"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
								Password
							</label>
							<input
								type="password"
								className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
								placeholder="Enter your password"
							/>
						</div>
						<button
							type="submit"
							className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
						>
							Login
						</button>
					</form>
				</Card>
			</div>
		</>
	);
}
