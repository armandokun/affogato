import LoginSection from "@/components/sections/login-section";
import LoginTestimonialSection from "@/components/sections/login-testimonial-section";

const LoginPage = () => {
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
