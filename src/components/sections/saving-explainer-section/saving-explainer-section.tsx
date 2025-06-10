const SavingExplainerSection = () => {
  return (
    <section id="saving-explainer">
      <div className="container">
        <h2 className="text-4xl font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter text-center">
          How does Affogato do that?
        </h2>
        <p className="text-gray-400 text-center w-[80%] mx-auto">
          We directly access model APIs, which means we pay the actual cost per
          use, not the subscription markup, and pass those savings to you.
        </p>
      </div>
    </section>
  );
};

export default SavingExplainerSection;
