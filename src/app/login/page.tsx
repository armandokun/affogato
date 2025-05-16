import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import LoginSection from "@/components/sections/login-section";
import LoginTestimonialSection from "@/components/sections/login-testimonial-section";

const LoginPage = async () => {
  const user = await getServerSession();

  if (user) redirect("/dashboard");

  return (
    <div className="flex-row flex items-stretch justify-center bg-background min-h-screen">
      <div className="w-full lg:w-1/2">
        <LoginSection />
      </div>
      <LoginTestimonialSection />
    </div>
  );
};

export default LoginPage;
