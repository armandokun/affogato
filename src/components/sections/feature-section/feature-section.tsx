import { MagicCard } from "@/components/ui/magic-card";
import { BrainCircuit, Globe, Sparkle } from "lucide-react";

const FeatureSection = () => {
  return (
    <section id="features" className="text-center">
      <div className="container">
        <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          <MagicCard className="rounded-xl min-h-[250px] flex items-center justify-center">
            <div className="p-4 px-6 flex flex-col items-center justify-center">
              <div
                className="rounded-xl w-16 h-16 flex items-center justify-center mb-6 mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, #3D5AFE 0%, #FF80AB 50%, #FF6D00 100%)",
                }}
              >
                <BrainCircuit className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Feels familiar.</h3>
              <p className="text-gray-400">
                Comes preinstalled with web search, document uploads and
                reasoning.
              </p>
            </div>
          </MagicCard>
          <MagicCard className="rounded-xl min-h-[250px] flex items-center justify-center">
            <div className="p-4 px-6 flex flex-col items-center justify-center">
              <div
                className="rounded-xl w-16 h-16 flex items-center justify-center mb-6 mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, #3D5AFE 0%, #FF80AB 50%, #FF6D00 100%)",
                }}
              >
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold">All you can eat buffet.</h3>
              <p className="text-gray-400">
                Choose from a wide range of providers. We support most up to
                date models.
              </p>
            </div>
          </MagicCard>
          <MagicCard className="rounded-xl min-h-[250px] flex items-center justify-center">
            <div className="p-4 px-6 flex flex-col items-center justify-center">
              <div
                className="rounded-xl w-16 h-16 flex items-center justify-center mb-6 mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, #3D5AFE 0%, #FF80AB 50%, #FF6D00 100%)",
                }}
              >
                <Sparkle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold">
                And might work not as expected.
              </h3>
              <p className="text-gray-400">
                Use multiple LLMs at once and enable features other models
                don&apos;t support.
              </p>
            </div>
          </MagicCard>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
