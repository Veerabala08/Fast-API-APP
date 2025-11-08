import { useState, useEffect } from "react";
import { Link2, Sparkles, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const [floatingElements, setFloatingElements] = useState([]);

    useEffect(() => {
        setIsVisible(true);
        
        // Generate random floating elements
        const elements = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 15 + Math.random() * 10,
            size: 20 + Math.random() * 40
        }));
        setFloatingElements(elements);
    }, []);

    const handleGetStarted = () => {
        // Replace with: navigate('/signup') or navigate('/register')
        console.log('Navigate to signup');
    };

    const handleSignIn = () => {
        navigate('/login')
        console.log('Navigate to login');
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#030303]">

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {floatingElements.map((el) => (
                    <div
                        key={el.id}
                        className="absolute rounded-full opacity-30"
                        style={{
                            left: `${el.left}%`,
                            bottom: '-50px',
                            width: `${el.size}px`,
                            height: `${el.size}px`,
                            backgroundColor: ['#E5D9F2', '#CDC1FF', '#A594F9'][el.id % 3],
                            animation: `float-up ${el.duration}s linear ${el.delay}s infinite`,
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes float-up {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateY(-100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                
                @keyframes wave {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-10px) translateX(5px);
                    }
                    50% {
                        transform: translateY(0) translateX(10px);
                    }
                    75% {
                        transform: translateY(10px) translateX(5px);
                    }
                }
                
                @keyframes bounce-subtle {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
            {/* <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500  mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500  mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>hello</div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div> */}

            {/* Content */}
            <div className="relative flex min-h-screen w-full items-center justify-center p-6 md:p-10">
                <div className={`max-w-4xl w-full text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-50 animate-ping"></div>
                            <div className="relative bg-white/10 backdrop-blur-lg p-4 rounded-full border-4 border-white/20">
                                <Link2 className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-clip-text bg-linear-to-r from-purple-200 via-pink-200 to-blue-200">
                        One Link, Infinite Possibilities
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto">
                        Share all your content, social profiles, and projects with a single beautiful link
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button 
                            onClick={handleGetStarted}
                            className="group relative px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
                        >
                            <span className="relative z-10">Get Started Free</span>
                            <div className="absolute inset-0 bg-linear-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                        
                        <button 
                            onClick={handleSignIn}
                            className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
                            <div className="bg-linear-to-br from-purple-400 to-pink-400 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Beautiful Design</h3>
                            <p className="text-purple-200 text-sm">Stunning templates that make your links stand out</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
                            <div className="bg-linear-to-br from-purple-400 to-pink-400 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Lightning Fast</h3>
                            <p className="text-purple-200 text-sm">Set up your page in minutes, not hours</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
                            <div className="bg-linear-to-br  from-purple-400 to-pink-400 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">Analytics</h3>
                            <p className="text-purple-200 text-sm">Track clicks and engage with your audience</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-r from-transparent via-purple-400 to-transparent">

                <p className="text-black text-center">jjhk</p>
            </div>
        </div>
    );
}