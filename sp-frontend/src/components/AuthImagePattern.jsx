import { useState, useEffect } from "react";
import QRCode from "react-qr-code"; // ✅ Fix: Default import

const AuthImagePattern = ({ title, subtitle }) => {
  const [loading, setLoading] = useState(true);
  const discordInviteLink = "https://discord.gg/vF8RQFQ"; // Your Discord invite link

  useEffect(() => {
    // Show QR Code after 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        {loading ? (
          // Animated Boxes (Loading Effect)
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-primary/10 ${
                  i % 2 === 0 ? "animate-pulse" : ""
                }`}
              />
            ))}
          </div>
        ) : (
          // Show QR Code After Loading
          <div className="relative flex justify-center items-center mb-8">
            <div className="p-2 bg-white rounded-2xl shadow-lg">
              <QRCode
                value={discordInviteLink}
                size={300} // Larger for better scanning
                bgColor="#ffffff" // White background for contrast
                fgColor="#000000" // Black QR code
              />
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;