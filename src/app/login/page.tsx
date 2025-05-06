import { redirect } from "next/navigation";

import LoginSection from "@/components/sections/login-section";
import LoginTestimonialSection from "@/components/sections/login-testimonial-section";
import { useSession } from "@/hooks/useSession";

const LoginPage = () => {
  const { user } = useSession();

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
