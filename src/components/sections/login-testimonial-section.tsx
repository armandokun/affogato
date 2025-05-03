import Image from "next/image";

import TestimonialCard from "../testimonial-card";

const LoginTestimonialSection = () => (
  <div className="hidden lg:flex flex-1 lg:w-1/2 lg:basis-1/2 items-center justify-center relative rounded-2xl m-6 overflow-hidden bg-black">
    <div className="absolute inset-0">
      <Image
        src="/login.png"
        alt="Login"
        fill
        style={{
          objectFit: "cover",
        }}
      />
    </div>
    <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
      <div className="flex items-center gap-4">
        <TestimonialCard
          avatarUrl="https://github.com/shadcn.png"
          name="Ada Lovelace"
          role="CEO, The First Computer Company"
        >
          &quot;That guy with his lava lamp inspired designs... Where are you
          going to put them next??&quot;
        </TestimonialCard>
      </div>
    </div>
  </div>
);

export default LoginTestimonialSection;
