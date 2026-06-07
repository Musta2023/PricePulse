import { useState } from 'react';
import { login, register } from '../api/auth';
import toast from 'react-hot-toast';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';

interface Props {
    onSuccess: (token: string, user: any) => void;
}

export default function AuthForm({ onSuccess }: Props) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = isLogin 
                ? await login({ email, password })
                : await register({ email, password, name });
            
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            toast.success(isLogin ? 'Welcome back!' : 'Account created!');
            onSuccess(token, user);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-indigo-600 rounded-xl text-white mb-4">
                    {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                    {isLogin ? 'Sign In to PricePulse' : 'Create an Account'}
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                    {isLogin ? 'Enter your credentials to access your dashboard' : 'Join us to start tracking product prices'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                )}
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-400 transition shadow-md shadow-indigo-100"
                >
                    {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-indigo-600 font-semibold hover:underline"
                >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
    );
}
