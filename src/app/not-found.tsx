import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-cc-cream text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border-3 border-cc-navy shadow-solid space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cc-coral text-white font-display font-black text-2xl flex items-center justify-center mx-auto border-2 border-cc-navy shadow-solid-sm">
          404
        </div>

        <div className="space-y-2">
          <h2 className="font-display font-black text-2xl text-cc-navy">
            ไม่พบหน้าที่คุณต้องการ
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-normal">
            หน้าที่คุณพยายามเข้าถึงอาจถูกย้าย หรือไม่มีอยู่ในระบบ ComClick 20
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cc-navy hover:bg-cc-navy/90 text-white font-display font-bold text-xs border-2 border-cc-navy shadow-solid-sm transition-all"
          >
            <Home className="w-4 h-4 text-cc-yellow" />
            <span>กลับหน้าแรก</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
