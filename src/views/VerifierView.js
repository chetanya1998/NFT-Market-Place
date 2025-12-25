import React from 'react';
import { Scan, ShieldCheck, X } from 'lucide-react';

const VerifierView = ({ setView, verifyStatus, handleVerify, verifyCode, setVerifyCode }) => {
    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
            <button onClick={() => setView('profile')} className="absolute top-6 left-6 text-white underline font-mono">
                &larr; Exit Partner Mode
            </button>

            <div className="w-full max-w-md border-4 border-white p-8 bg-gray-900 shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)]">
                <h2 className="text-4xl font-black uppercase text-center mb-2 text-yellow-400">Verifier Tool</h2>
                <p className="font-mono text-center text-gray-400 mb-8">Scan attendee QR codes to validate utility.</p>

                <div className="relative aspect-square bg-gray-800 border-2 border-dashed border-gray-500 mb-6 flex items-center justify-center overflow-hidden">
                    {verifyStatus === 'scanning' && <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>}
                    {verifyStatus === 'success' ? (
                        <div className="text-center animate-bounce">
                            <ShieldCheck size={64} className="text-green-500 mx-auto mb-2" />
                            <h3 className="text-2xl font-black text-green-500">VALID TICKET</h3>
                            <p className="font-mono">User: Cyberpunk_01</p>
                        </div>
                    ) : verifyStatus === 'error' ? (
                        <div className="text-center animate-shake">
                            <X size={64} className="text-red-500 mx-auto mb-2" />
                            <h3 className="text-2xl font-black text-red-500">INVALID CODE</h3>
                        </div>
                    ) : (
                        <Scan size={48} className="text-gray-600" />
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Enter Code (e.g. QR-1-8892)"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    className="w-full bg-black border-2 border-white p-3 font-mono text-white mb-4 text-center uppercase"
                />

                <button
                    onClick={handleVerify}
                    className="w-full bg-white text-black font-black uppercase py-4 hover:bg-yellow-400 transition-colors"
                >
                    {verifyStatus === 'scanning' ? 'Verifying...' : 'Verify Access'}
                </button>

                {verifyStatus === 'success' && (
                    <button onClick={() => { /* This would be setVerifyStatus('idle') and setVerifyCode('') */ }} className="mt-4 w-full text-center underline font-mono">
                        Scan Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifierView;
